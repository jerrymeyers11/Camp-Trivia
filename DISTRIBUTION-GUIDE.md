# Camp Jeopardy - Distribution Guide

## Current Distribution Strategy

### What We Have:
- **Unsigned App**: `dist/Camp Jeopardy-1.0.0-arm64.dmg` (or .zip)
- **Installation Instructions**: `INSTALLATION-INSTRUCTIONS.md`

### How to Distribute:

1. **Upload both files** to your SharePoint/file sharing:
   - `Camp Jeopardy-1.0.0-arm64.dmg` (265 MB)
   - `INSTALLATION-INSTRUCTIONS.md`

2. **Send hosts the installation instructions** before the event

3. **Key instruction for hosts**: Right-click app → Open (first time only)

### Why This Works:
- macOS allows users to bypass Gatekeeper by right-clicking
- No terminal commands needed
- Works on all Macs running macOS 10.15+

---

## Future: Full Notarization (If Needed)

If you want zero security warnings, you need Apple notarization:

### Requirements:
- Active Apple Developer account ($99/year)
- App-specific password for notarization
- Build and sign the app (done)
- Upload to Apple for scanning
- Staple notarization ticket to app

### Process:
```bash
# 1. Sign the app
codesign --sign "Developer ID Application: Jeremiah Lowder (UGL4RPWJ95)" \
  --options runtime \
  --entitlements build/entitlements.mac.plist \
  --deep --force \
  "dist/mac-arm64/Camp Jeopardy.app"

# 2. Create ZIP for notarization
ditto -c -k --keepParent "dist/mac-arm64/Camp Jeopardy.app" "Camp-Jeopardy-notarize.zip"

# 3. Submit for notarization (requires Apple ID credentials)
xcrun notarytool submit "Camp-Jeopardy-notarize.zip" \
  --apple-id "your-apple-id@email.com" \
  --password "app-specific-password" \
  --team-id "UGL4RPWJ95" \
  --wait

# 4. Staple the notarization ticket
xcrun stapler staple "dist/mac-arm64/Camp Jeopardy.app"

# 5. Create final DMG
hdiutil create -volname "Camp Jeopardy" \
  -srcfolder "dist/mac-arm64/Camp Jeopardy.app" \
  -ov -format UDZO "dist/Camp-Jeopardy-Notarized.dmg"
```

### Cost/Benefit:
- **Cost**: $99/year Apple Developer Program
- **Benefit**: Zero security warnings for all users
- **Recommended**: Only if distributing to 50+ hosts or selling commercially

---

## Current Recommendation

**Stick with unsigned + instructions** unless:
- You're distributing to non-technical users
- Hosts are reporting installation problems
- You plan to sell/distribute commercially

The right-click method is standard practice for small-scale Mac app distribution.
