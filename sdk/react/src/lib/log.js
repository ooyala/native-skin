import {
  LOG_LEVEL
} from '../constants';

let level = LOG_LEVEL.INFO;

class Log {
  static setLogLevel(l) {
    switch (l) {
      case LOG_LEVEL.VERBOSE:
      case LOG_LEVEL.INFO:
      case LOG_LEVEL.WARN:
      case LOG_LEVEL.ERROR:
      case LOG_LEVEL.NONE:
        level = l;
        break;
      default:
        console.error('Invalid Warning Level: ' + l);
        break;
    }
  }

  static warn(msg) {
    if (level >= LOG_LEVEL.WARN) {
      console.warn(msg);
      return true;
    }
    return false;
  }

  static info(msg) {
    if (level >= LOG_LEVEL.INFO) {
      console.info(msg);
      return true;
    }
    return false;
  }

  static error(msg) {
    if (level >= LOG_LEVEL.ERROR) {
      console.error(msg);
      return true;
    }
    return false;
  }

  static log(msg) {
    if (level >= LOG_LEVEL.INFO) {
      console.log(msg);
      return true;
    }
    return false;
  }

  static verbose(msg) {
    if (level >= LOG_LEVEL.VERBOSE) {
      console.log(msg);
      return true;
    }
    return false;
  }

  static assertTrue(condition, msg) {
    if (condition) {
      error('ASSERT FAILED: ', msg);
    }
  }
};

module.exports = Log;
