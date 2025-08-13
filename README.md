# Mary's NYC Adventure 🗽

A Mario Brothers Level 1 clone with a New York City twist! Help Mary catch the 7 train to Queens while collecting subway tokens and avoiding pigeons.

## 🎮 Play the Game

Play it directly in your browser: [https://sarajo.github.io/SuperMarysWorld](https://sarajo.github.io/SuperMarysWorld)

## 🎯 About the Game

Mary's NYC Adventure is a side-scrolling platformer that reimagines the classic Mario Brothers Level 1 with NYC-themed elements:

- **Mary** - Our hero trying to catch the subway
- **Subway Tokens** - Collect these instead of coins (100 points each)
- **Mets Hats** - Power up to become Big Mary (like mushrooms)
- **Baseball Bats** - Throw baseballs at enemies (like fire flowers)
- **Pigeons** - NYC's notorious birds replace Goombas
- **7 Train** - Your goal is to reach the purple 7 train to Queens

## 🕹️ How to Play

### Controls
- **Arrow Keys** - Move left and right
- **Spacebar** or **Up Arrow** - Jump
- **X** - Throw baseballs (when you have the bat power)

### Gameplay
1. Navigate through the level avoiding or defeating pigeons
2. Hit question blocks from below to get power-ups
3. Collect subway tokens for points
4. Transform with power-ups:
   - **Small Mary** → **Big Mary** (with Mets hat) → **Baseball Bat Mary**
5. Reach the 7 train at the end to win!

### Power-Up Hierarchy
- **Small Mary** - Default state
- **Big Mary** - Wearing a Mets hat, can take one hit
- **Baseball Bat Mary** - Can throw baseballs, shirt turns white with "B" logo

## 🛠️ Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/SaraJo/SuperMarysWorld.git
cd SuperMarysWorld
```

### Run Locally
1. Open `index.html` in any modern web browser
2. No build process or dependencies required!

For local development with live reload:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

Then navigate to `http://localhost:8000`

## 🏗️ Project Structure

```
game/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Game styling
├── js/
│   ├── game.js        # Main game loop and player logic
│   ├── level.js       # Level design and tilemap
│   ├── collectibles.js # Tokens and power-ups
│   ├── enemies.js     # Enemy AI and behavior
│   ├── projectiles.js # Baseball throwing mechanics
│   └── particles.js   # Visual effects and sounds
└── README.md          # This file
```

## 🎨 Features

- **Authentic NYC Theme** - Subway tokens, Mets merchandise, and city pigeons
- **Classic Platformer Mechanics** - Jump, run, and defeat enemies
- **Power-Up System** - Transform and gain new abilities
- **Particle Effects** - Visual feedback for all actions
- **8-bit Sound Effects** - Retro sounds using Web Audio API
- **NYC Skyline Background** - Animated cityscape with moving clouds
- **Enemy Respawning** - Continuous challenge as pigeons keep coming

## 🚀 Deploy to GitHub Pages

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit of Mary's NYC Adventure game"
git remote add origin https://github.com/SaraJo/SuperMarysWorld.git
git push -u origin main
```

2. Enable GitHub Pages:
   - Go to your repository's Settings
   - Navigate to Pages section
   - Set Source to "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder
   - Click Save

3. Your game will be available at: `https://sarajo.github.io/SuperMarysWorld`

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- More enemy types (taxi cabs, hot dog vendors)
- Additional levels (Times Square, Central Park)
- More NYC-themed power-ups
- High score tracking
- Mobile touch controls

## 📝 License

This project is open source and available under the MIT License.

## 🎯 Credits

- Inspired by Super Mario Bros. by Nintendo
- Created with vanilla JavaScript and HTML5 Canvas
- NYC theme and character by Sara Jo

---

Made with ❤️ in New York City