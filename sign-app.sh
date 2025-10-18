#!/bin/bash

# Script to properly sign Electron app with all nested frameworks
# This signs from the inside out, which is required for proper code signing

set -e  # Exit on error

APP_PATH="dist/mac-arm64/Camp Jeopardy.app"
IDENTITY="Developer ID Application: Jeremiah Lowder (UGL4RPWJ95)"
ENTITLEMENTS="build/entitlements.mac.plist"

echo "🧹 Cleaning extended attributes..."
xattr -cr "$APP_PATH"
find "$APP_PATH" -name "*.DS_Store" -delete 2>/dev/null || true

echo ""
echo "🔐 Step 1: Signing all .dylib files..."
find "$APP_PATH/Contents" -name "*.dylib" -type f | while read dylib; do
    echo "  → $(basename "$dylib")"
    codesign --force --sign "$IDENTITY" --timestamp "$dylib" 2>&1 | grep -v "replacing existing signature" || true
done

echo ""
echo "🔐 Step 2: Signing helper executables..."
# Sign chrome_crashpad_handler and other executables
find "$APP_PATH/Contents/Frameworks" -type f -perm +111 ! -name "*.dylib" ! -path "*/Versions/*" | while read exe; do
    if file "$exe" | grep -q "Mach-O"; then
        echo "  → $(basename "$exe")"
        codesign --force --sign "$IDENTITY" --timestamp "$exe" 2>&1 | grep -v "replacing existing signature" || true
    fi
done

echo ""
echo "🔐 Step 3: Signing frameworks (deepest first)..."
# Get all frameworks and sort by depth (deepest first)
find "$APP_PATH/Contents/Frameworks" -name "*.framework" -type d | awk '{print length, $0}' | sort -rn | cut -d' ' -f2- | while read framework; do
    echo "  → $(basename "$framework")"
    codesign --force --sign "$IDENTITY" --timestamp --options runtime "$framework" 2>&1 | grep -v "replacing existing signature" || true
done

echo ""
echo "🔐 Step 4: Signing helper apps..."
find "$APP_PATH/Contents/Frameworks" -name "*.app" -type d | while read app; do
    echo "  → $(basename "$app")"
    codesign --force --sign "$IDENTITY" --timestamp --options runtime --entitlements "$ENTITLEMENTS" "$app" 2>&1 | grep -v "replacing existing signature" || true
done

echo ""
echo "🔐 Step 5: Signing main app bundle..."
codesign --force --sign "$IDENTITY" --timestamp --options runtime --entitlements "$ENTITLEMENTS" "$APP_PATH"

echo ""
echo "✅ Verifying signature..."
codesign --verify --verbose=2 "$APP_PATH"

echo ""
echo "✅ Testing with Gatekeeper (spctl)..."
if spctl --assess --verbose=4 --type execute "$APP_PATH" 2>&1; then
    echo ""
    echo "🎉 SUCCESS! App is properly signed and will work on other Macs!"
    echo "Users can right-click → Open to bypass first-run warning."
else
    echo ""
    echo "⚠️  Warning: spctl check failed, but app may still work."
    echo "Test on your wife's Mac with right-click → Open"
fi

echo ""
echo "📦 App location: $APP_PATH"
