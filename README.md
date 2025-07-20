## 🧭 Vanilla TPA Compass

Ever wanted to visit your friend but they’re like *a thousand blocks* away?  
No problem — just use your compass to send a teleport request and hope they say yes.

---

### What's This?

A lightweight and practical Minecraft Bedrock addon for multiplayer worlds where you just want to chill and stick together.

---

### ✨ Features

- **Achievements stay ON** – No need to disable anything.
- **Works with a regular compass** – No crafting headaches.
- **No experimental toggles required** – Just plug and play.
- **Compatible with latest Script API** – Supports **1.20.80**, **1.21**, and future versions.
- **Easily toggle TPA** – Sneak + interact to turn it on or off.
- **Multi-language support** – Currently supports English, French, and Spanish.

---

### 📦 Installation (For Players)

1. Download the `.mcaddon` from [Releases](https://github.com/your-username/tpa-compass/releases).
2. Open it with Minecraft.
3. Both RP and BP will import automatically.
4. Add them to your world (enable either one — the other gets enabled too).
5. No experimental toggles needed.

---

### 🧪 How to Use

- Hold a compass and interact to request a teleport.
- Your friend will get a nice little prompt to accept or deny.
- To craft a compass:  
  Place **1 iron ingot** in the center of the grid, surround it with **4 redstone dust**.  
  (Requires a crafting table.)

---

### 🛠 Development Setup (For Devs)

```bash
git clone https://github.com/your-username/tpa-compass.git
cd tpa-compass
npm install
```

#### To compile TypeScript:
```bash
npm run compile
```

This will:
- Compile everything from `tpa-compass-bp/src/`
- Output to `tpa-compass-bp/scripts/` (which Minecraft uses)

#### To zip into a `.mcaddon`:
```bash
npm run zip
```

This will:
- Create a `tpa-compass.mcaddon` file in the root
- Exclude `src/`, `node_modules/`, and unnecessary files

---

### 🧠 How to Load In-Dev

- Enable Developer Mode in Minecraft Bedrock (via options or behavior).
- Use the `.mcaddon` from the root (run `npm run zip` first).
- Or manually copy `tpa-compass-bp` and `tpa-compass-rp` into the `com.mojang` `development_behavior_packs` and `development_resource_packs` folders.

---

### 📖 License

This project is open source and licensed under the **MIT License**.

- ✅ Free to use, modify, and redistribute
- ✅ Commercial use allowed
- 🔗 See `LICENSE` for full terms

---

> Made with love by Leonidaaa  
> PRs welcome. Don’t spam your friends.


---

### 🤝 Contributing

Contributions are welcome!  
If you find bugs, have feature ideas, or want to improve translations, feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/thing`)
3. Make your changes
4. Commit and push (`git commit -m "Add thing" && git push`)
5. Open a pull request

Make sure your changes don't break the addon and follow the existing structure.

---

> Made with love by Leonidaaa  
> PRs welcome. Don’t spam your friends.
