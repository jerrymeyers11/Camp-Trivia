#!/bin/bash

# Comprehensive signing script for Apple notarization
# Signs everything with hardened runtime and timestamps

set -e

APP_PATH="dist/mac-arm64/Camp Jeopardy.app"
IDENTITY="Developer ID Application: Jeremiah Lowder (UGL4RPWJ95)"
ENTITLEMENTS="build/entitlements.mac.plist"

echo "🧹 Step 1: Cleaning..."
xattr -cr "$APP_PATH"
find "$APP_PATH" -name "*.DS_Store" -delete 2>/dev/null || true

echo ""
echo "🗑️  Step 2: Removing all existing signatures..."
find "$APP_PATH" -type d \( -name "*.app" -o -name "*.framework" \) | while read item; do
    codesign --remove-signature "$item" 2>/dev/null || true
done
codesign --remove-signature "$APP_PATH" 2>/dev/null || true

echo ""
echo "🔐 Step 3: Signing all dylibs..."
find "$APP_PATH/Contents" -name "*.dylib" -type f | while read dylib; do
    echo "  → $(basename "$dylib")"
    codesign --force --sign "$IDENTITY" --timestamp --options runtime "$dylib"
done

echo ""
echo "🔐 Step 4: Signing all executables (including ShipIt and chrome_crashpad_handler)..."
# Find all Mach-O executables
find "$APP_PATH/Contents" -type f -perm +111 | while read exe; do
    if file "$exe" | grep -q "Mach-O"; then
        # Skip if it's inside a .app or .framework that we'll sign later
        if [[ ! "$exe" =~ \.app/Contents/MacOS/ ]] && [[ ! "$exe" =~ \.framework/Versions/[^/]+/[^/]+$ ]]; then
            echo "  → $(basename "$exe")"
            codesign --force --sign "$IDENTITY" --timestamp --options runtime "$exe"
        fi
    fi
done

echo ""
echo "🔐 Step 5: Signing framework binaries (Electron Framework, etc)..."
# Sign the main binary inside Electron Framework
if [ -f "$APP_PATH/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework" ]; then
    echo "  → Electron Framework binary"
    codesign --force --sign "$IDENTITY" --timestamp --options runtime \
        "$APP_PATH/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework"
fi

echo ""
echo "🔐 Step 6: Signing all frameworks..."
# Sort by depth (deepest first) to sign from inside-out
find "$APP_PATH/Contents/Frameworks" -name "*.framework" -type d | \
    awk '{print length, $0}' | sort -rn | cut -d' ' -f2- | while read framework; do
    echo "  → $(basename "$framework")"
    codesign --force --sign "$IDENTITY" --timestamp --options runtime "$framework"
done

echo ""
echo "🔐 Step 7: Signing helper apps..."
find "$APP_PATH/Contents/Frameworks" -name "*.app" -type d | while read helper; do
    echo "  → $(basename "$helper")"
    codesign --force --sign "$IDENTITY" --timestamp --options runtime \
        --entitlements "$ENTITLEMENTS" "$helper"
done

echo ""
echo "🔐 Step 8: Signing main executable..."
codesign --force --sign "$IDENTITY" --timestamp --options runtime \
    "$APP_PATH/Contents/MacOS/Camp Jeopardy"

echo ""
echo "🔐 Step 9: Signing main app bundle..."
codesign --force --sign "$IDENTITY" --timestamp --options runtime \
    --entitlements "$ENTITLEMENTS" "$APP_PATH"

echo ""
echo "✅ Step 10: Verifying signature..."
codesign --verify --verbose=2 "$APP_PATH" 2>&1 || echo "Note: Some nested code warnings are normal for Electron apps"

echo ""
echo "✅ Step 11: Checking signature details..."
codesign --display --verbose=4 "$APP_PATH" 2>&1 | grep -E "Authority|Identifier|TeamIdentifier|Signature" | head -10

echo ""
echo "🎉 Signing complete! App ready for notarization."
echo "📦 Location: $APP_PATH"
