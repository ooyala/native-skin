// @flow

import { VALUES } from '../constants';
import * as Log from './log';
import type { Localization } from '../types/Localization';

export const shouldShowLandscape = (width: number, height: number): boolean => {
  if (Number.isNaN(width) || Number.isNaN(height) || width === null || height === null || width < 0 || height < 0) {
    return false;
  }

  return width > height;
};

export const formattedPlaybackSpeedRate = (selectedPlaybackSpeedRate: number): string => {
  const selectedPlaybackSpeedRateFloat = parseFloat(parseFloat(String(selectedPlaybackSpeedRate)).toFixed(2));
  const selectedPlaybackSpeedRateString = selectedPlaybackSpeedRateFloat.toString();

  return selectedPlaybackSpeedRateString.concat('x');
};

export const getTimerLabel = (secondsLeft: number): string => {
  const secondsRounded = Math.floor(secondsLeft);
  const minutes = Math.floor(secondsRounded / 60);
  const seconds = secondsRounded - minutes * 60;

  const minutesString = (minutes < 10 ? `0${minutes}` : minutes);
  const secondsString = (seconds < 10 ? `0${seconds}` : seconds);

  return `${minutesString}:${secondsString}`;
};

export const secondsToString = (inputSeconds: number): string => {
  let minus = '';
  let seconds = inputSeconds;

  if (seconds < 0) {
    minus = '-';
    seconds = -seconds;
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  let mm = date.getUTCMinutes();
  let ss = date.getSeconds();

  if (ss < 10) {
    ss = `0${ss}`;
  }

  if (mm === 0) {
    mm = '00';
  } else if (mm < 10) {
    mm = `0${mm}`;
  }

  let t = `${mm}:${ss}`;

  if (hh > 0) {
    t = `${hh}:${t}`;
  }

  return minus + t;
};

export const localizedString = (
  preferredLocale: string, stringId: string, localizableStrings: Localization,
): string => {
  if (typeof stringId !== 'string') {
    return '';
  }

  let locale = preferredLocale;
  let strings = localizableStrings;

  if (typeof locale !== 'string') {
    locale = '';
  }

  if (typeof strings !== 'object' || strings === null) {
    strings = {};
  }

  Log.verbose(`preferredLocale: ${locale}, stringId: ${stringId}, localizableStrings:`);

  const defaultLocale = strings.defaultLanguage || 'en';

  if (locale && strings[locale] && strings[locale][stringId]) {
    return strings[locale][stringId];
  }

  if (strings[defaultLocale] && strings[defaultLocale][stringId]) {
    return strings[defaultLocale][stringId];
  }

  return stringId;
};

export const stringForErrorCode = (errorCode: number): string => {
  switch (errorCode) {
    case 0:
      // Authorization failed
      return 'Authorization failed';

    case 1:
      // Authorization response invalid
      return 'Invalid Authorization Response';

    case 2:
      // Authorization heartbeat failed
      return 'Invalid Heartbeat';

    case 3:
      // Content tree response invalid
      return 'Content Tree Response Invalid';

    case 4:
      // Authorization signature invalid
      return 'The signature of the Authorization Response is invalid';

    case 5:
      // Content tree next failed
      return 'Content Tree Next failed';

    case 6:
      // Playback failed
      return 'Playback Error';

    case 7:
      // The asset is not encoded
      return 'This video is not encoded for your device';

    case 8:
      // Internal error
      return 'An internal error occurred';

    case 9:
      // Metadata response invalid
      return 'Invalid Metadata';

    case 10:
      // Invalid authorization token
      return 'Invalid Player Token';

    case 11:
      // Device limit has been reached
      return 'Authorization Error';

    case 12:
      // Device binding failed
      return 'Device binding failed';

    case 13:
      // Device id too long
      return 'Device ID is too long';

    case 14:
      // General DRM failure
      return 'General error acquiring license';

    case 15:
      // DRM file download failure
      return 'Failed to download a required file during the DRM workflow';

    case 16:
      // DRM personalization failure
      return 'Failed to complete device personalization during the DRM workflow';

    case 17:
      // DRM rights server error
      return 'Failed to get rights for asset during the DRM workflow';

    case 18:
      // Invalid discovery parameter
      return 'The expected discovery parameters are not provided';

    case 19:
      // Discovery network error
      return 'A discovery network error occurred';

    case 20:
      // Discovery response failure
      return 'A discovery response error occurred';

    case 21:
      // No available streams
      return 'No available streams';

    case 22:
      // Pcode mismatch
      return 'The provided PCode does not match the embed code owner';

    case 23:
      // Download error
      return 'A download error occurred';

    case 24:
      // Concurrent streams
      return 'You have exceeded the maximum number of concurrent streams';

    case 25:
      //  Advertising id failure
      return 'Failed to return the advertising ID';

    case 26:
      // Discovery GET failure
      return 'Failed to get discovery results';

    case 27:
      // Discovery POST failure
      return 'Failed to post discovery pins';

    case 28:
      // Player format mismatch
      return 'Player and player content do not correspond';

    case 29:
      // Failed to create VR player
      return 'Failed to create VR player';

    case 30:
      // Unknown error
      return 'An unknown error occurred';

    case 31:
      // GeoBlocking access denied
      return 'Geo access denied';

    default:
      // Default to Unknown error
      return 'An unknown error occurred';
  }
};

export const restrictSeekValueIfNeeded = (seekValue: number): number => (
  Math.min(Math.max(VALUES.MIN_SKIP_VALUE, seekValue), VALUES.MAX_SKIP_VALUE)
);
