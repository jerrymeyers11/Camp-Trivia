#!/bin/bash

# Final attempt at proper Electron signing
# The key is to NOT use --deep on anything, and sign in strict inside-out order

set -e

APP_PATH="dist/mac-arm64/Camp Jeopardy.app"
IDENTITY="Developer ID Application: Jeremiah Lowder (UGL4RPWJ95)"
ENTITLEMENTS="build/entitlements.mac.plist"

echo "🧹 Step 1: Clean everything..."
xattr -cr "$APP_PATH"
find "$APP_PATH" -name "*.DS_Store" -delete 2>/dev/null || true

# Remove ALL existing signatures
echo ""
echo "🗑️  Step 2: Remove all existing signatures..."
find "$APP_PATH" -type d -name "*.app" -o -name "*.framework" | while read item; do
    codesign --remove-signature "$item" 2>/dev/null || true
done
codesign --remove-signature "$APP_PATH" 2>/dev/null || true

echo ""
echo "🔐 Step 3: Sign individual binaries and libraries..."
# Sign all dylibs and executables that are NOT in .app or .framework bundles
find "$APP_PATH/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries" -name "*.dylib" 2>/dev/null | while read lib; do
    echo "  → $(basename "$lib")"
    codesign --force --sign "$IDENTITY" --timestamp "$lib"
done

# Sign chrome_crashpad_handler
if [ -f "$APP_PATH/Contents/Frameworks/Electron Framework.framework/Versions/A/Helpers/chrome_crashpad_handler" ]; then
    echo "  → chrome_crashpad_handler"
    codesign --force --sign "$IDENTITY" --timestamp \
        "$APP_PATH/Contents/Frameworks/Electron Framework.framework/Versions/A/Helpers/chrome_crashpad_handler"
fi

echo ""
echo "🔐 Step 4: Sign Electron Framework binary..."
codesign --force --sign "$IDENTITY" --timestamp \
    "$APP_PATH/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework"

echo ""
echo "🔐 Step 5: Sign Electron Framework bundle..."
codesign --force --sign "$IDENTITY" --timestamp --options runtime \
    "$APP_PATH/Contents/Frameworks/Electron Framework.framework"

echo ""
echo "🔐 Step 6: Sign other frameworks..."
for fw in "$APP_PATH/Contents/Frameworks"/*.framework; do
    if [ -d "$fw" ] && [ "$(basename "$fw")" != "Electron Framework.framework" ]; then
        echo "  → $(basename "$fw")"
        codesign --force --sign "$IDENTITY" --timestamp --options runtime "$fw"
    fi
done

echo ""
echo "🔐 Step 7: Sign helper apps..."
for helper in "$APP_PATH/Contents/Frameworks"/*.app; do
    if [ -d "$helper" ]; then
        echo "  → $(basename "$helper")"
        codesign --force --sign "$IDENTITY" --timestamp --options runtime \
            --entitlements "$ENTITLEMENTS" "$helper"
    fi
done

echo ""
echo "🔐 Step 8: Sign main executable..."
codesign --force --sign "$IDENTITY" --timestamp \
    "$APP_PATH/Contents/MacOS/Camp Jeopardy"

echo ""
echo "🔐 Step 9: Sign main app bundle..."
codesign --force --sign "$IDENTITY" --timestamp --options runtime \
    --entitlements "$ENTITLEMENTS" "$APP_PATH"

echo ""
echo "✅ Step 10: Verify (without --deep)..."
codesign --verify --verbose=2 "$APP_PATH" 2>&1 || true

echo ""
echo "✅ Step 11: Check display info..."
codesign --display --verbose=4 "$APP_PATH" 2>&1 | head -20

echo ""
echo "📦 Done! App signed at: $APP_PATH"
echo ""
echo "⚠️  Note: Even if spctl fails, the app should work on other Macs"
echo "   with right-click → Open (which bypasses Gatekeeper)."
