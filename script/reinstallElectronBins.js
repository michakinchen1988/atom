const { spawn } = require('child_process');

const electronVersion = require('./config').appMetadata.electronVersion;

if (process.env.ELECTRON_CUSTOM_VERSION !== electronVersion) {
  console.info(`Env var "ELECTRON_CUSTOM_VERSION" doesn't match "electronVersion" from Atom's package.json (or isn't set)...\n` +
    `Setting ELECTRON_CUSTOM_VERSION to match electronVersion from Atom\'s package.json (${electronVersion}).\n` +
    `Running: 'npm install electron-chromedriver electron-mksnapshot'.\n` +
    '(Some versions of chromedriver and mksnapshot are very large. Downloading them may take a while.)\n');

  process.env.ELECTRON_CUSTOM_VERSION = electronVersion;

  const nodePath = process.env.npm_node_execpath;
  const npmPath = process.env.npm_execpath;

  const npmInstall = spawn(nodePath, [npmPath, 'install', 'electron-chromedriver', 'electron-mksnapshot']);

  npmInstall.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  npmInstall.stderr.on('data', (data) => {
    console.error(`${data}`);
  });

  npmInstall.on('close', (code) => {
    var exitStatus;
    if (code === 0) {
      exitStatus = "success";
    } else {
      exitStatus = "error";
    }

    console.log(`Done re-downloading chromedriver and mksnapshot. Status: ${exitStatus}\n`);
  });

} else {
  console.info('INFO: env var "ELECTRON_CUSTOM_VERSION" was set correctly.\nNo need to reinstall chromedriver and mksnapshot. Skipping.\n');
}
