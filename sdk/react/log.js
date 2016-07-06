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
    if (level >= LOG_LEVEL.WARN) { 
      console.warn(msg);
      return true;
    }
    return false;
  },

  info: function(msg) {
    if (level >= LOG_LEVEL.INFO) { 
      console.info(msg);
      return true;
    }
    return false;
  },

  error: function(msg) {
    if (level >= LOG_LEVEL.ERROR) { 
      console.error(msg);
      return true;
    }
    return false;
  },

  log: function(msg) {
    if (level >= LOG_LEVEL.INFO) { 
      console.log(msg);
      return true;
    }
    return false;
  },
  
  verbose: function(msg) {
    if (level >= LOG_LEVEL.VERBOSE) { 
      console.log(msg);
      return true;
    }
    return false;
  },

};

module.exports = Log;
