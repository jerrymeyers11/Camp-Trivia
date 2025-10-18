# Camp Jeopardy - Electron App

This app has been converted to run as a standalone Electron desktop application. It works fully offline - perfect for trade shows with unreliable WiFi.

## Quick Start

### Running in Development
```bash
npm run electron
```

This will:
1. Start the Node.js server automatically
2. Open the gameboard window (will use external display if connected)
3. Open the host controls window

### Building for Distribution

**Mac:**
```bash
npm run build
```
This creates a `.dmg` installer and `.zip` in the `dist/` folder.

**Windows:**
```bash
npm run build-win
```
This creates an `.exe` installer and `.zip` in the `dist/` folder.

## How It Works

### Multi-Display Support
The app automatically detects connected displays:
- **Single display**: Both windows open on your primary screen
- **Multiple displays**: Gameboard goes fullscreen on external display, host controls stay on your laptop

### Windows Created
1. **Gameboard** (`index.html`) - The main display for audience/contestants
2. **Host Controls** (`host_solo.html`) - Control panel for running the game

### Offline Operation
Everything runs locally:
- Node.js server starts automatically on port 8080
- WebSocket communication between windows
- All assets (images, audio, video) served from local files
- No internet connection required

## File Structure
```
jeopardy-poc/
├── main.js           # Electron main process (server + window management)
├── server.js         # Original standalone server (still works)
├── package.json      # Updated with Electron config
├── public/           # All game assets (HTML, images, audio, video)
└── build/            # Icons for app packaging (optional)
```

## Customization Tips

### Changing Window Sizes
Edit `main.js` around line 750:
```javascript
hostWindow = new BrowserWindow({
    width: 1024,  // Change this
    height: 768,  // Change this
    ...
});
```

### Adding More Windows
If you need contestant controllers, add to `createWindows()`:
```javascript
const controller1 = new BrowserWindow({...});
controller1.loadURL('http://localhost:8080/controller_1.html');
```

### Changing the Port
Edit `main.js` line 743:
```javascript
const PORT = 8080;  // Change if needed
```

### Development vs Production
In development, uncomment these lines in `main.js` (around line 765) to see console output:
```javascript
gameboardWindow.webContents.openDevTools();
hostWindow.webContents.openDevTools();
```

## Building Icons (Optional)

For a polished app, create icons:
1. Create a `build/` folder
2. Add `icon.icns` (Mac - 512x512 PNG converted to icns)
3. Add `icon.ico` (Windows - 256x256 PNG converted to ico)

Free tools:
- Mac: https://cloudconvert.com/png-to-icns
- Windows: https://cloudconvert.com/png-to-ico

## Troubleshooting

**App won't start:**
- Make sure port 8080 isn't already in use
- Check terminal/console for error messages

**Gameboard not going to external display:**
- Connect display BEFORE launching app
- Or drag window manually to external display and fullscreen

**Assets not loading:**
- Ensure all files in `public/` folder are included
- Check paths are relative, not absolute

**Building fails:**
- Run `npm install` again
- Make sure you have latest Node.js installed
- For Windows builds on Mac, you may need Wine

## Distribution

Send your client:
1. The `.dmg` file (Mac) or `.exe` installer (Windows)
2. Simple instructions: "Double-click to install, then launch Camp Jeopardy"

The built app includes everything - no separate installation needed!
