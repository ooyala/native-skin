// @flow

import { LOG_LEVEL } from '../constants';
import * as Log from './log';

describe('Log', () => {
  it('logs everything except verbose by default', () => {
    expect(Log.verbose('test')).toBe(false);
    expect(Log.log('test')).toBe(true);
    expect(Log.info('test')).toBe(true);
    expect(Log.warn('test')).toBe(true);
    expect(Log.error('test')).toBe(true);
  });

  it('logs everything when VERBOSE level set', () => {
    Log.setLogLevel(LOG_LEVEL.VERBOSE);

    expect(Log.verbose('test')).toBe(true);
    expect(Log.log('test')).toBe(true);
    expect(Log.info('test')).toBe(true);
    expect(Log.warn('test')).toBe(true);
    expect(Log.error('test')).toBe(true);
  });

  it('logs only errors when ERROR level set', () => {
    Log.setLogLevel(LOG_LEVEL.ERROR);

    expect(Log.verbose('test')).toBe(false);
    expect(Log.log('test')).toBe(false);
    expect(Log.info('test')).toBe(false);
    expect(Log.warn('test')).toBe(false);
    expect(Log.error('test')).toBe(true);
  });

  it('logs nothing when NONE level set', () => {
    Log.setLogLevel(LOG_LEVEL.NONE);

    expect(Log.verbose('test')).toBe(false);
    expect(Log.log('test')).toBe(false);
    expect(Log.info('test')).toBe(false);
    expect(Log.warn('test')).toBe(false);
    expect(Log.error('test')).toBe(false);
  });
});
