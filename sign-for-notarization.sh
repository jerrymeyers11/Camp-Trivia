#!/bin/bash

# Comprehensive signing script for Electron app notarization
# Signs all nested components individually with proper flags

APP_PATH="dist/mac-arm64/Camp Jeopardy.app"
IDENTITY="Developer ID Application: Jeremiah Lowder (UGL4RPWJ95)"
ENTITLEMENTS="build/entitlements.mac.plist"

echo "Removing extended attributes..."
xattr -cr "$APP_PATH"

echo "Step 1: Sign all dylibs and binaries in Electron Framework..."
find "$APP_PATH/Contents/Frameworks/Electron Framework.framework" -type f \( -name "*.dylib" -o -perm +111 \) | while read file; do
    if file "$file" | grep -q "Mach-O"; then
        echo "  Signing: $(basename "$file")"
        codesign --force --sign "$IDENTITY" --timestamp --options runtime "$file"
    fi
done

echo "Step 2: Sign ShipIt binary in Squirrel framework..."
if [ -f "$APP_PATH/Contents/Frameworks/Squirrel.framework/Resources/ShipIt" ]; then
    codesign --force --sign "$IDENTITY" --timestamp --options runtime \
        "$APP_PATH/Contents/Frameworks/Squirrel.framework/Resources/ShipIt"
fi

echo "Step 3: Sign Electron Framework main binary..."
codesign --force --sign "$IDENTITY" --timestamp --options runtime \
    "$APP_PATH/Contents/Frameworks/Electron Framework.framework/Electron Framework"

echo "Step 4: Sign Electron Framework bundle..."
codesign --force --sign "$IDENTITY" --timestamp --options runtime \
    "$APP_PATH/Contents/Frameworks/Electron Framework.framework"

echo "Step 5: Sign other frameworks..."
for framework in "$APP_PATH/Contents/Frameworks"/*.framework; do
    if [ "$framework" != "$APP_PATH/Contents/Frameworks/Electron Framework.framework" ]; then
        echo "  Signing: $(basename "$framework")"
        codesign --force --sign "$IDENTITY" --timestamp --options runtime "$framework"
    fi
done

echo "Step 6: Sign helper apps..."
find "$APP_PATH/Contents/Frameworks" -name "*.app" -type d | while read app; do
    echo "  Signing: $(basename "$app")"
    codesign --force --sign "$IDENTITY" --timestamp --options runtime --entitlements "$ENTITLEMENTS" "$app"
done

echo "Step 7: Sign main app bundle..."
codesign --force --sign "$IDENTITY" --timestamp --options runtime --entitlements "$ENTITLEMENTS" "$APP_PATH"

echo "Verifying signature..."
codesign --verify --verbose=2 "$APP_PATH"

echo "Done!"
