'use strict';

const childProcess = require('child_process');

const CONFIG = require('../config');

module.exports = function(ci) {
  verifyNode();
  verifyNpm(ci);
  verifyPython();
};

function verifyNode() {
  const fullVersion = process.versions.node;
  const majorVersion = fullVersion.split('.')[0];
  if (majorVersion >= 6) {
    console.log(`Node:\tv${fullVersion}`);
  } else if (majorVersion >= 4) {
    console.log(`Node:\tv${fullVersion}`);
    console.warn(
      '\tWarning: Building on Node below version 6 is deprecated. Please use Node 6.x+ to build Atom.'
    );
  } else {
    throw new Error(
      `node v4+ is required to build Atom. node v${fullVersion} is installed.`
    );
  }
}

function verifyNpm(ci) {
  const stdout = childProcess.execFileSync(
    CONFIG.getNpmBinPath(ci),
    ['--version'],
    { env: process.env }
  );
  const fullVersion = stdout.toString().trim();
  const majorVersion = fullVersion.split('.')[0];
  const oldestMajorVersionSupported = ci ? 6 : 3;
  if (majorVersion >= oldestMajorVersionSupported) {
    console.log(`Npm:\tv${fullVersion}`);
  } else {
    throw new Error(
      `npm v${oldestMajorVersionSupported}+ is required to build Atom. npm v${fullVersion} was detected.`
    );
  }
}

function verifyPython() {
  const findPythonPath = require.resolve('./node-gyp-find-python');
  const findPython = childProcess.spawnSync('node', [findPythonPath], {
    env: process.env
  });

  const foundPython = findPython.stdout.toString();
  const findPythonMainOutput = findPython.stderr.toString();
  const regExpGetVersion = /[0-9]+.[0-9]+.[0-9]+/;

  // The result line we want is actually printed to stderr for some reason,
  // assuming Python was successfully found.
  // (If Python wasn't found, a genuine error message is printed to stderr.)
  // For a successful find, the absoule "path/to/python" is printed on stdout.
  // (If python was not found, stdout.toString() is an empty string.)
  // So, checking the value of stdout.toString() is still useful.
  if (foundPython) {
    console.log('Python: ' + findPythonMainOutput.match(regExpGetVersion));
  } else {
    let errorMessage = 'Python not found. See error below:';

    const splitErrorOnNewlines = findPythonMainOutput.split(/\r?\n/);
    splitErrorOnNewlines.forEach(element => {
      // The '--python' flag won't work with the boostrap script.
      // So we won't print the suggestion to use it.
      if (
        element.indexOf('--python') === -1 &&
        element.indexOf('accepted by') === -1
      ) {
        errorMessage = `${errorMessage}\n${element}`;
      }
    });
    throw new Error(errorMessage);
  }
}
