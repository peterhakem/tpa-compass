import {
	world,
	Player,
	system,
	TicksPerSecond
} from "@minecraft/server";
import {
	ActionFormData,
	MessageFormData
} from "@minecraft/server-ui";

// Enum for translation keys used in UI and messages.
enum Translate {
	ToggleOff = "tpa:toggle.off",
	ToggleOn = "tpa:toggle.on",
	PlayerListTitle = "tpa:players.list_title",
	PlayerListBody = "tpa:players.list_body",
	NoPlayers = "tpa:no_players",
	AskedAlready = "tpa:asked",
	Prevent = "tpa:prevent",
	AcceptPlayer = "tpa:accept_player",
	AcceptTarget = "tpa:accept_target",
	Reject = "tpa:reject",
	NotFound = "tpa:not_found",
	AskBody = "tpa:ask.body",
	AskAccept = "tpa:ask.accept",
	AskReject = "tpa:ask.reject",
	Cooldown = "tpa:ask.cooldown",
	PlayerMenu = "tpa:player_menu",
	tpa = "tpa:tpa",
	tpahere = "tpa:tpa_here",
	back = "tpa:back",
	AskHereBody = "tpa:ask_here_body"
};

world.afterEvents.itemUse.subscribe(({
	source,
	itemStack
}) => {
	if (!(source instanceof Player) || itemStack.typeId !== "minecraft:compass") return;
	if (source.isSneaking) {
		if (source.hasTag("prevent")) {
			source.removeTag("prevent");
			source.onScreenDisplay.setActionBar({ translate: Translate.ToggleOff })
		} else {
			source.addTag("prevent");
			source.onScreenDisplay.setActionBar({ translate: Translate.ToggleOn });
		}
		return;
	}
	if (source.hasTag("cooldown")) {
		source.onScreenDisplay.setActionBar({ translate: Translate.Cooldown })
		return;
	}

	playerListMenu(source)
});

world.afterEvents.playerSpawn.subscribe(({
	player, initialSpawn
}) => {
	if (!initialSpawn) return;

	system.run(() => {
		if (player.hasTag('asked')) player.removeTag('asked');
		if (player.hasTag("cooldown")) player.removeTag("cooldown");
	})
})

/**
 * Shows a list of players to request teleport to.
 * @param player The player who opened the menu.
 */
function playerListMenu(player: Player): void {
	const form = new ActionFormData()
		.title(Translate.PlayerListTitle)
		.body({ translate: Translate.PlayerListBody });

	const players: Player[] = world.getAllPlayers();

	if (players.length <= 1) {
		player.sendMessage({ translate: Translate.NoPlayers });
		return;
	};

	const otherPlayers = players.filter(p => p.name !== player.nameTag);

	for (const plr of otherPlayers) {
		form.button(plr.name, "textures/ui/players");
	}

	form.show(player).then(response => {
		if (response.canceled || !response.selection) return;

		const target = players[response.selection]


		if (target) {
			if (target.hasTag('asked')) return player.sendMessage({ translate: Translate.AskedAlready, with: [target.name] })
			if (target.hasTag('prevent')) return player.sendMessage({ translate: Translate.Prevent, with: [target.name] })

			askMenu(player, target)
		} else {
			player.sendMessage({ translate: Translate.NotFound })
		}
	});
}

/**
 * Shows the tpa menu with options to send a request.
 * @param player Player who sends the request.
 * @param target Player to whom (i just learned that word :) the request is sent.
 */
function askMenu(player: Player, target: Player): void {
	const form = new ActionFormData()
		.title(target.nameTag)
		.body("") // Empty body to avoid visual bugs
		.button({ translate: Translate.tpa })
		.button({ translate: Translate.tpahere })
		.button({ translate: Translate.back });

	form.show(player).then((response) => {
		if (response.selection === undefined || response.canceled) return;

		switch (response.selection) {
			case 0:
				ask(target, player);
				break;
			case 1:
				askhere(target, player)
				break;
			case 2:
				playerListMenu(player);
				break;
		}
	})
}

/**
 * Shows a list of players to request teleport to.
 * @param player The player who opened the menu.
 * @param target The selected player
 */
async function ask(player: Player, target: Player): Promise<void> {
	const form = new MessageFormData()
		.body({ translate: Translate.AskBody, with: [target.name] })
		.button1({ translate: Translate.AskAccept })
		.button2({ translate: Translate.AskReject });


	player.addTag("asked")
	const res = await form.show(player);
	if (res.canceled || res.selection === undefined) return;
	if (res.selection === 0) {
		player.sendMessage({ translate: Translate.AcceptPlayer, with: [target.name] });
		target.sendMessage({ translate: Translate.AcceptTarget, with: [player.name] });

		// In case the player leaves before the request is accepted
		if (target) {
			target.teleport(player.location, { dimension: player.dimension });
		} else {
			player.sendMessage({ translate: Translate.NotFound })
		}
		player.removeTag("asked")
		target.addTag("cooldown")

		system.runTimeout(() => {
			if (player?.hasTag("cooldown")) return player.removeTag("cooldown");
		}, TicksPerSecond * 20) // 20 seconds

	} else {
		target.sendMessage({ translate: Translate.Reject, with: [player.nameTag] });
	}
}

/**
 * Sends a teleport-here request from target to player.
 * @param target The player being asked to teleport here.
 * @param player The player who requested someone to teleport to them.
 */
async function askhere(target: Player, player: Player): Promise<void> {
	const form = new MessageFormData()
		.body({ translate: Translate.AskHereBody, with: [target.name] })
		.button1({ translate: Translate.AskAccept })
		.button2({ translate: Translate.AskReject });

	player.addTag("asked")
	const res = await form.show(player);
	if (res.canceled || res.selection === undefined) return;
	if (res.selection === 0) {
		player.sendMessage({ translate: Translate.AcceptPlayer, with: [target.name] });
		target.sendMessage({ translate: Translate.AcceptTarget, with: [player.name] });

		// In case the player leaves before the request is accepted
		if (target) {
			player.teleport(target.location, { dimension: target.dimension });
		} else {
			player.sendMessage({ translate: Translate.NotFound })
		}
		player.removeTag("asked")
		target.addTag("cooldown")

		system.runTimeout(() => {
			if (player?.hasTag("cooldown")) return player.removeTag("cooldown");
		}, TicksPerSecond * 20) // 20 seconds

	} else {
		target.sendMessage({ translate: Translate.Reject, with: [player.nameTag] });
	}
}
