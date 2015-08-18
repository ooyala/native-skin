#!/usr/bin/env node

// Adds endsWith function to string
if ( typeof String.prototype.endsWith != 'function' ) {
  String.prototype.endsWith = function( str ) {
    return str.length > 0 && this.substring( this.length - str.length, this.length ) === str;
  }
};

// Runs every node repl test in each javascript file
var testFolder = function(dir) {
  var fs = fs || require('fs');
  var files = fs.readdirSync(dir);

  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory() && file != 'node_modules' && file != 'build') {
      testFolder(dir + file + '/');
    }
    else if(file.endsWith('.js')) {
      var testFile;
      try {
        testFile = require(dir + file.substring(0, file.indexOf('.js')));
      }
      catch(error) {
        // do nothing
      }
      if(testFile) {
        console.log('Running tests in ' + dir + file);
        testFile.TestSuite.Run();
      }
    }
  });
};

testFolder('./sdk/OoyalaSkinSDK/');
