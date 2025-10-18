// main.js - Electron main process
const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const { createServer } = require('./server');

// Window references
let server;
let gameboardWindow;
let hostWindow;

// Start the server and create windows when ready
function startServer() {
    server = createServer(() => {
        console.log('Electron app ready - creating windows...');
        createWindows();
    });
}

// Create windows for gameboard and host
function createWindows() {
    const displays = screen.getAllDisplays();
    console.log(`Detected ${displays.length} display(s)`);

    // Determine which display to use for gameboard
    let gameboardDisplay = displays[0]; // Default to primary
    let hostDisplay = displays[0];

    if (displays.length > 1) {
        // Use external display for gameboard
        const externalDisplay = displays.find(d => d.bounds.x !== 0 || d.bounds.y !== 0) || displays[1];
        gameboardDisplay = externalDisplay;
        hostDisplay = displays[0]; // Primary for host controls
        console.log('Using external display for gameboard');
    } else {
        console.log('Single display detected - both windows will open on primary display');
    }

    // Create gameboard window (fullscreen on external display if available)
    gameboardWindow = new BrowserWindow({
        x: gameboardDisplay.bounds.x,
        y: gameboardDisplay.bounds.y,
        width: gameboardDisplay.bounds.width,
        height: gameboardDisplay.bounds.height,
        fullscreen: displays.length > 1, // Only fullscreen if we have multiple displays
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        title: 'Gameboard'
    });

    gameboardWindow.loadURL('http://localhost:8080/index.html');

    // Create host control window (on primary display)
    hostWindow = new BrowserWindow({
        x: hostDisplay.bounds.x + 50,
        y: hostDisplay.bounds.y + 50,
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        title: 'Host Controls'
    });

    hostWindow.loadURL('http://localhost:8080/host_solo.html');

    // Open DevTools in development (optional - remove for production)
    // gameboardWindow.webContents.openDevTools();
    // hostWindow.webContents.openDevTools();
}

// Electron app lifecycle
app.whenReady().then(() => {
    console.log('Electron app ready - starting server...');
    startServer();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (server) {
            server.close();
        }
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindows();
    }
});

// Cleanup on quit
app.on('before-quit', () => {
    if (server) {
        server.close();
    }
});
