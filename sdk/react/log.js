/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var Constants = require('./constants');
var {
  LOG_LEVEL,
} = Constants;

var level = LOG_LEVEL.INFO;

var Log = {
  setLogLevel: function(l){
    switch (l) {
      case LOG_LEVEL.VERBOSE:
      case LOG_LEVEL.INFO:
      case LOG_LEVEL.WARN:
      case LOG_LEVEL.ERROR:
      case LOG_LEVEL.NONE:
      level = l;
      break;
      default:
      console.error("Invalid Warning Level: " + l);
      break;
    }
  },
  
  warn: function(msg) {
    if (level >= LOG_LEVEL.WARN) console.warn(msg);
  },

  info: function(msg) {
    if (level >= LOG_LEVEL.INFO)  console.info(msg);
  },

  error: function(msg) {
    if (level >= LOG_LEVEL.ERROR) console.error(msg);
  },

  log: function(msg) {
    if (level >= LOG_LEVEL.INFO) console.log(msg);
  },
  
  verbose: function(msg) {
    if (level >= LOG_LEVEL.VERBOSE)  console.log(msg);
  },

};

module.exports = Log;
