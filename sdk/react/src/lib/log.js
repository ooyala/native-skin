// @flow
/* eslint-disable no-console */

import { LOG_LEVEL } from '../constants';

let globalLevel: number = LOG_LEVEL.INFO;

export const setLogLevel = (level: number): void => {
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
};

export const warn = (...msg: Array<any>): boolean => {
  if (globalLevel < LOG_LEVEL.WARN) {
    return false;
  }

  console.warn(...msg);

  return true;
};

export const info = (...msg: Array<any>): boolean => {
  if (globalLevel < LOG_LEVEL.INFO) {
    return false;
  }

  console.info(...msg);

  return true;
};

export const error = (...msg: Array<any>): boolean => {
  if (globalLevel < LOG_LEVEL.ERROR) {
    return false;
  }

  console.error(...msg);

  return true;
};

export const log = (...msg: Array<any>): boolean => {
  if (globalLevel < LOG_LEVEL.INFO) {
    return false;
  }

  console.log(...msg);

  return true;
};

export const verbose = (...msg: Array<any>): boolean => {
  if (globalLevel < LOG_LEVEL.VERBOSE) {
    return false;
  }

  console.log(...msg);

  return true;
};

export const assertTrue = (condition: boolean, ...msg: Array<any>): void => {
  if (condition) {
    error('ASSERT FAILED: ', ...msg);
  }
};
