// @flow

import { LOG_LEVEL } from '../constants';

let globalLevel = LOG_LEVEL.INFO;

export default class Log {
  /* eslint-disable no-console */

  static setLogLevel(level) {
    switch (level) {
      case LOG_LEVEL.VERBOSE:
      case LOG_LEVEL.INFO:
      case LOG_LEVEL.WARN:
      case LOG_LEVEL.ERROR:
      case LOG_LEVEL.NONE:
        globalLevel = level;
        break;

      default:
        console.error(`Invalid Warning Level: ${level}`);
        break;
    }
  }

  static warn(msg) {
    if (globalLevel >= LOG_LEVEL.WARN) {
      console.warn(msg);

      return true;
    }

    return false;
  }

  static info(msg) {
    if (globalLevel >= LOG_LEVEL.INFO) {
      console.info(msg);

      return true;
    }

    return false;
  }

  static error(msg) {
    if (globalLevel >= LOG_LEVEL.ERROR) {
      console.error(msg);

      return true;
    }

    return false;
  }

  static log(msg) {
    if (globalLevel >= LOG_LEVEL.INFO) {
      console.log(msg);

      return true;
    }

    return false;
  }

  static verbose(msg) {
    if (globalLevel >= LOG_LEVEL.VERBOSE) {
      console.log(msg);

      return true;
    }

    return false;
  }

  static assertTrue(condition, msg) {
    if (condition) {
      this.error('ASSERT FAILED: ', msg);
    }
  }

  /* eslint-enable no-console */
}
