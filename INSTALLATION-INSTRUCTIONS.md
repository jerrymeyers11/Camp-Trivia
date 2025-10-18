# Camp Jeopardy Installation Instructions

## For Mac Users

### Installation Steps:

1. **Download** the DMG file: `Camp Jeopardy-1.0.0-arm64.dmg`

2. **Open the DMG** by double-clicking it

3. **Drag** the "Camp Jeopardy" app to your Applications folder

4. **Important First Launch:**
   - **DO NOT** double-click the app the first time
   - **Right-click** (or Control+click) on "Camp Jeopardy.app"
   - Select **"Open"** from the menu
   - Click **"Open"** in the security dialog that appears

5. **Subsequent Launches:**
   - After the first time, you can launch normally by double-clicking

### Why These Steps?

This app is not notarized with Apple (which requires a $99/year developer account). The right-click method tells macOS that you trust this app. You only need to do this once - after that, the app will open normally.

### Troubleshooting:

**If you get "damaged" or "can't be opened" errors:**

1. Try the right-click method above first
2. If that doesn't work, open Terminal and run:
   ```bash
   xattr -cr "/Applications/Camp Jeopardy.app"
   ```
3. Then try the right-click method again

**If you need help:**
Contact the event organizer or technical support.

---

## Alternative: ZIP Distribution

If you prefer, you can also distribute the ZIP file (`Camp Jeopardy-1.0.0-arm64-mac.zip`):

1. Download and unzip the file
2. Drag "Camp Jeopardy.app" to Applications
3. Follow the "Right-click → Open" steps above for first launch
