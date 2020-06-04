findPython = require('npm/node_modules/node-gyp/lib/find-python');

findPython(null, function(err, found){
  if (found) {
    // This logs the "/absolute/path/to/python".
    console.log(found);
  }
});
