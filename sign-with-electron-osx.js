const { sign } = require('@electron/osx-sign');

async function signApp() {
  console.log('🔐 Signing app with @electron/osx-sign...');

  try {
    await sign({
      app: 'dist/mac-arm64/Camp Jeopardy.app',
      identity: 'Developer ID Application: Jeremiah Lowder (UGL4RPWJ95)',
      hardenedRuntime: true,
      entitlements: 'build/entitlements.mac.plist',
      'entitlements-inherit': 'build/entitlements.mac.plist',
      'gatekeeper-assess': false,
      timestamp: true,
      verbose: true
    });

    console.log('✅ App signed successfully!');
  } catch (error) {
    console.error('❌ Signing failed:', error);
    process.exit(1);
  }
}

signApp();
