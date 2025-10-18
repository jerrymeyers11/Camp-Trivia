# Camp Jeopardy - Project Documentation

## 🎯 Project Overview
This is a Jeopardy-style trivia game built for trade shows/events. It runs as an Electron desktop app that works fully offline. The game features:
- NetApp-themed questions with merit badge icons
- 3-team scoring system
- Buzzer mechanics (3 points initially, 1 point after multiple choice revealed)
- Physical challenge questions
- TV ad break integration
- Animated running lights and winner reveals

## 📁 Project Structure

```
jeopardy-poc/
├── server.js           # ⭐ MAIN GAME LOGIC - Edit this for all game changes
├── main.js             # Electron wrapper - only edit for window/display changes
├── package.json        # Dependencies and build configuration
├── public/             # All game assets
│   ├── index.html      # Main gameboard display
│   ├── host_solo.html  # Host control interface
│   ├── controller_*.html  # Individual player buzzers (optional)
│   ├── *.png           # Graphics (backgrounds, badges, planks, etc.)
│   ├── *.mp3           # Sound effects (correct, wrong, timer, etc.)
│   └── *.mp4           # Video (TV ad)
└── README-ELECTRON.md  # Electron app documentation
```

## 🏗️ Architecture (IMPORTANT!)

### Single Source of Truth
**server.js** contains ALL game logic:
- Question data (QUESTIONS array)
- Game state management
- WebSocket communication
- Scoring logic
- Game phase progression

**main.js** only handles:
- Starting the server
- Creating Electron windows
- Multi-display detection
- Window lifecycle

### How They Work Together
1. `main.js` imports `server.js` via `require('./server')`
2. `server.js` exports a `createServer()` function
3. Electron calls this function to start the game server
4. Both standalone mode (`npm start`) and Electron mode (`npm run electron`) use the SAME server.js code

**⚠️ CRITICAL: Always edit game logic in `server.js`, never in `main.js`**

## 🔧 Common Tasks

### Editing Questions
**File:** `server.js` (lines 15-96)

```javascript
const QUESTIONS = [
    {
        id: 1,
        meritBadge: 5,  // Which badge number to highlight
        question: "Your question text here?",
        multipleChoice: [
            "A) Option 1",
            "B) Option 2",
            "C) Option 3"
        ],
        answer: "Option 2"  // Exact text of correct answer
    },
    // Physical challenge questions:
    {
        id: 3,
        meritBadge: 8,
        type: "physical",  // Special type - no buzzers
        question: "Physical Challenge",
        answer: "Physical Challenge Complete"
    }
];
```

### Changing Graphics
**Location:** `public/` folder

**Key assets:**
- `background-camp.png` - Main background
- `gameboard.png` - Question board overlay
- `merit_1.png` through `merit_12.png` - Badge icons
- `qnaplank.png` - Question/answer display plank
- `winner.png` - Winner reveal screen
- `gameboardlights*.png` - Animated running lights

**To replace:** Just swap the file with same name/dimensions

### Adjusting Scoring
**File:** `server.js`

**Points per answer:**
- Lines 180-181: First answer = 3 points, after MC shown = 1 point
- Line 181: `const points = gameState.multipleChoiceRevealed ? 1 : 3;`

**Physical challenge scoring:**
- Line 261-263: Each team's physical challenge points added to main score

### Changing Window Sizes/Layout
**File:** `main.js` (lines 55-67)

```javascript
hostWindow = new BrowserWindow({
    x: hostDisplay.bounds.x + 100,
    y: hostDisplay.bounds.y + 100,
    width: 1024,  // ← Change width here
    height: 768,  // ← Change height here
    ...
});
```

### Multi-Display Behavior
**File:** `main.js` (lines 28-36)

- **Multiple displays detected:** Gameboard goes fullscreen on external display, host controls on laptop
- **Single display:** Both windows open on primary display (not fullscreen)

### Adding More Windows (e.g., contestant controllers)
**File:** `main.js` (after line 67)

```javascript
// Example: Add contestant controller window
const controller1 = new BrowserWindow({
    width: 400,
    height: 600,
    title: 'Player 1 Buzzer'
});
controller1.loadURL('http://localhost:8080/controller_1.html');
```

## 🎮 Game Phases

The game follows this state machine (in `server.js`):

1. **WAITING** → Click "Start Game"
2. **LIGHTS** → Running lights animation (10 seconds)
3. **READY_FOR_BADGE_SEQUENCE** → Click "Choose Question"
4. **BADGE_SELECTION** → Merit badge highlight animation (3 seconds)
5. **READY_TO_SHOW_QUESTION** → Click "Show Question"
6. **QUESTION_SHOWN** → Question displayed, buzzers active (3 points)
7. **MULTIPLE_CHOICE_SHOWN** → MC displayed, buzzers still active (1 point)
8. **PLAYER_BUZZED** → Someone buzzed, host marks correct/incorrect
9. **CORRECT_ANSWER/ANSWER_SHOWN** → Answer revealed
10. **GAME_COMPLETE** → All questions done
11. **READY_TO_REVEAL_WINNER** → Click "Reveal Winner"
12. **WINNER_REVEALED** → Winner display with animation

**Special phases:**
- **PHYSICAL_CHALLENGE** → No buzzers, manual point tracking
- **TV_AD_READY/TV_AD_PLAYING** → After question 5

## 🚀 Running the Game

### Development/Testing
```bash
# Standalone web server (browser-based)
npm start
# Then open: http://localhost:8080/index.html (gameboard)
#            http://localhost:8080/host_solo.html (controls)

# Electron app (desktop)
npm run electron
```

### Building for Distribution

⚠️ **IMPORTANT: Build Location**
- **DO NOT build from iCloud Drive** (`~/Library/Mobile Documents/...`)
- iCloud causes code signing failures due to extended attributes
- Always build from a local directory (e.g., `~/jeopardy-poc-build/`)
- Copy project to local drive before building

```bash
# Mac app (.dmg installer)
npm run build

# Windows app (.exe installer)
npm run build-win
```

**Output:** `dist/` folder contains installers and zips

### Code Signing (Mac Only)

**What you need:**
1. **Apple Developer Account** with "Developer ID Application" certificate
2. **Entitlements file** at `build/entitlements.mac.plist` (already included)
3. **Local build directory** (NOT iCloud Drive)

**Setup:**
1. Download "Developer ID Application" certificate from https://developer.apple.com/account/resources/certificates
2. Double-click the `.cer` file to install in Keychain
3. Open Keychain Access → find certificate → Trust → Code Signing → "Always Trust"

**Build Process (TESTED & WORKING):**
```bash
# 1. Ensure package.json has "identity": null to skip auto-signing
# 2. Clean extended attributes (important!)
xattr -cr .

# 3. Clean build (unsigned)
rm -rf dist && npm run build

# 4. Remove extended attributes from built app
xattr -cr "dist/mac-arm64/Camp Jeopardy.app"

# 5. Sign the app manually
codesign --deep --force --verify --verbose \
  --sign "Developer ID Application: Jeremiah Lowder (UGL4RPWJ95)" \
  --options runtime \
  --entitlements build/entitlements.mac.plist \
  "dist/mac-arm64/Camp Jeopardy.app"

# 6. Verify signature (main bundle should show your Developer ID)
codesign --display --verbose=4 "dist/mac-arm64/Camp Jeopardy.app"

# 7. Create DMG installer
hdiutil create -volname "Camp Jeopardy" \
  -srcfolder "dist/mac-arm64/Camp Jeopardy.app" \
  -ov -format UDZO "dist/Camp-Jeopardy-Installer.dmg"
```

**Important Notes:**
- The `xattr -cr` commands remove extended attributes that cause signing failures
- You may see "nested code modified" warnings with --deep verification - this is normal for Electron apps
- The main app bundle will be properly signed, which is what matters
- Distribute the .dmg file to users

**Why sign?**
- Prevents "unidentified developer" warnings on client computers
- Required for distribution outside App Store
- Works on any Mac without security prompts

**Note:** `package.json` has `identity: null` to skip auto-signing (we sign manually to avoid iCloud issues)

## 🌍 Translation/Localization

### Current Implementation
- Team names are editable in `host_solo.html`
- All UI text is hardcoded in English

### To Add Multi-Language Support
You'll need to:

1. **Extract UI strings** from HTML files to language files (e.g., `lang/en.json`, `lang/es.json`)
2. **Add language selector** to host interface
3. **Load appropriate language file** on startup
4. **Replace static text** with dynamic lookups

**Files to translate:**
- `public/host_solo.html` - Button labels, phase descriptions
- `public/index.html` - Any on-screen text
- `public/controller_*.html` - Buzzer interface

**Questions:** Client provides translated questions, you swap them into the QUESTIONS array in `server.js`

## 🎨 Customization for Different Shows

### Per-Show Checklist
1. **Questions** - Edit QUESTIONS array in `server.js`
2. **Graphics** - Replace assets in `public/` folder
   - City skylines → edit `background-camp.png`
   - Merit badges → replace `merit_*.png` files
   - Company logos → update overlays
3. **Branding** - Update app name in `package.json` (line 2 & 18)
4. **Test** - Run `npm run electron` to verify
5. **Build** - Run `npm run build` or `npm run build-win`

### Creating Multiple Versions for Same Event
If client wants 3 versions for Day 1:
- Create 3 separate folders: `game-v1/`, `game-v2/`, `game-v3/`
- Each has different QUESTIONS array
- Build 3 separate apps with different productName in package.json
- Client runs whichever version they want

**OR** (more advanced):
- Create question files: `questions-v1.json`, `questions-v2.json`, etc.
- Add version selector in host interface
- Load appropriate question set dynamically

## 🐛 Troubleshooting

### Server won't start
- Port 8080 already in use → Kill other process or change PORT in `server.js` line 766

### Graphics not loading
- Check file paths in HTML are relative (not absolute)
- Ensure files are in `public/` folder
- **⚠️ CRITICAL: Check capitalization** - macOS is case-insensitive during development, but packaged apps are case-sensitive
  - Example: `score.png` in HTML must match `Score.png` filename exactly
  - Files work locally but break in packaged app if case doesn't match
  - Always use exact case matching in all file references

### Gameboard not going to external display
- Connect display BEFORE launching app
- Or manually drag window to external display and fullscreen

### WebSocket connection failed
- Server might not be running → Check console for errors
- Wrong port → Verify client HTML uses ws://localhost:8080

### Build fails
- Run `npm install` to ensure all dependencies installed
- Check `build/` folder has icons (optional but helpful)
- For Windows builds on Mac, may need Wine installed

## 💰 Pricing Reference

For your records - pricing strategy discussed:
- **Initial reskin/rebuild:** $4,500-5,500
- **Per show (14 additional):** $750-1,000 each
- **Per language (4 languages):** $1,000-1,500 each (one-time setup)
- **Packaging (Mac/PC):** $1,200-1,500
- **Live support:** $150-250/hour or $1,500/day
- **Package deal discount:** ~15% off total if committing to full scope

## 📝 Version History

### v1.0 - Current
- Original 8-question game with NetApp theme
- Electron app with multi-display support
- Refactored architecture (server.js as single source of truth)
- Mac/PC build capability
- Code signing with Apple Developer ID (Oct 2, 2025)
- Fixed case-sensitive file path issues (Score.png)

### v2.0 - Manual Player Buzzer System (October 14, 2025)
**Major Enhancement:** Added manual player buzzer screens for real buzzer gameplay!

**What Changed:**
- Created 3 dedicated player buzzer screens (player1.html, player2.html, player3.html)
- Updated host_solo.html to show which player buzzed in
- Host now uses Correct/Incorrect buttons instead of selecting players
- Server already had complete buzz-in logic (no changes needed!)
- Scoring: 2 points before MC, 1 point after MC (updated from 3/1)

**New Files Created:**
1. `public/player1.html` - Player 1 buzzer (green theme, Team One)
2. `public/player2.html` - Player 2 buzzer (blue theme, Team Two)
3. `public/player3.html` - Player 3 buzzer (orange theme, Team Three)

**How the Buzzer System Works:**

**Player Screens:**
- Display player name and current score
- Large circular buzzer button:
  - **RED (disabled):** "WAIT" - cannot buzz yet
  - **GREEN (active):** "BUZZ IN" - ready to answer (pulses!)
  - **YELLOW (buzzed):** "BUZZED!" - you buzzed in
- Connection status indicator (green/red)
- Mobile-friendly responsive design
- WebSocket connection automatically uses host IP

**Host Screen Changes:**
- Shows "⏱️ Waiting for Player to Buzz In..." when buzzers are active
- When player buzzes: "[Player Name] BUZZED IN!"
- Two large buttons:
  - "✅ CORRECT (X pts)" - awards points and shows answer
  - "❌ INCORRECT" - allows other players to buzz in
- Points automatically calculated based on MC state

**Game Flow:**
1. Host reveals question → all player buzzers turn GREEN
2. First player to tap their buzzer → their buzzer turns YELLOW
3. Host sees who buzzed and asks them the question
4. Host clicks Correct or Incorrect:
   - **Correct:** Points awarded, answer shown, move on
   - **Incorrect:** Other players' buzzers turn GREEN again
5. Players can buzz once before MC, once after MC shown
6. Tracks who already attempted to prevent multiple tries

**Server Logic (already existed!):**
- `buzz_in` handler (lines 449-466): Accepts buzz-ins from players
- `ruling` handler (lines 468-500): Handles correct/incorrect judgments
- `gameState.attemptedPlayers`: Tracks who already tried this question
- `gameState.buzzersActive`: Controls when players can buzz
- `gameState.multipleChoiceRevealed`: Determines point value (2 or 1)

**Setup for Live Event (IMPORTANT!):**

Since players will be on separate devices (iPads/iPhones), you need to use your computer's IP address:

1. **Find your computer's IP address:**
   - Mac: `ipconfig getifaddr en0` or System Preferences → Network
   - Windows: `ipconfig` (look for IPv4 Address)
   - Example: `192.168.1.100`

2. **Make sure all devices on same WiFi network**

3. **Start server:** `npm start`

4. **Access URLs using your IP (replace with your actual IP):**
   - Computer (host): `http://192.168.1.100:8080/host_solo.html`
   - Computer (gameboard): `http://192.168.1.100:8080/`
   - iPad 1 (player 1): `http://192.168.1.100:8080/player1.html`
   - iPad 2 (player 2): `http://192.168.1.100:8080/player2.html`
   - iPad 3 (player 3): `http://192.168.1.100:8080/player3.html`

5. **Test connection:** Each player screen should show "Connected" in green

**Testing Tips:**
- Test with 3 devices on same WiFi before the event
- Player screens work great in browser (no app needed)
- Can use tablets or phones
- Connection is automatic - no configuration needed by players
- Buzzers prevent cheating (can't buzz twice per question)

**Proof of Concept Notes:**
- This was built as a quick proof of concept for show floor demo
- System works well for testing the buzzer gameplay
- If this goes well, can enhance with:
  - Sound effects on player screens
  - Vibration feedback when buzzing
  - More visual feedback states
  - Player names customizable from player screen

### Future Enhancements (Ideas)
- Dynamic question loading from JSON files
- Multi-language UI switching
- Admin panel for editing questions without code changes
- Enhanced player buzzer screens with sound/haptic feedback
- Leaderboard across multiple game sessions

---

## 🆘 Quick Start for Future Claude Sessions

**Copy/paste this when starting a new session:**

> "This is an Electron-based Jeopardy game. Please read PROJECT-NOTES.md first. All game logic is in server.js (single source of truth). main.js only handles Electron windows. I need help with [describe your task]."

---

**Last Updated:** October 14, 2025
**Contact:** Jeremiah Lowder
**Client:** NetApp (original build: $5,000)

**Recent Updates:**
- Oct 14, 2025: Added manual player buzzer system (v2.0) - 3 player screens with real-time buzz-in functionality
