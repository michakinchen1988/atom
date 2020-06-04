const findPython = require('npm/node_modules/node-gyp/lib/find-python');

findPython(null, function(err, found) {
  if (err) {
    // The error we actually want gets printed anyway. Do nothing here.
  }
  if (found) {
    // This logs the "/absolute/path/to/python".
    console.log(found);
  }
});
