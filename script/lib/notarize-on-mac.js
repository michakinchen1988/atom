const notarize = require('electron-notarize').notarize;

module.exports = async function(packagedAppPath) {
  if (
    !process.env.ATOM_MAC_CODE_SIGNING_CERT_DOWNLOAD_URL &&
    !process.env.ATOM_MAC_CODE_SIGNING_CERT_PATH
  ) {
    console.log(
      'Skipping notarization because the ATOM_MAC_CODE_SIGNING_CERT_DOWNLOAD_URL environment variable is not defined'
        .gray
    );
    return;
  }

  const appBundleId = 'com.github.atom';
  const appleId = process.env.AC_USER;
  const appleIdPassword = process.env.AC_PASSWORD;
  console.log(`Notarizing application at ${packagedAppPath}`);
  try {
    await notarize({
      appBundleId: appBundleId,
      appPath: packagedAppPath,
      appleId: appleId,
      appleIdPassword: appleIdPassword
    });
  } catch (e) {
    throw new Error(e);
  }
};
