// @flow

import * as Log from './log';

const defaultMultipliers = [0.7, 1, 1.2];
const defaultThresholds = [320, 860];

/**
 * Takes the width and the threshold and returns an integer that represents which threshold the player width currently
 * lies in.
 *
 * @param {number} width
 * @param {Array<number>} [thresholds]
 * @returns {number}
 */
const getSize = (width: number, thresholds?: Array<number>): number => {
  const usedThresholds = thresholds || defaultThresholds;

  for (let i = 0; i < usedThresholds.length; i += 1) {
    if (width <= usedThresholds[i]) {
      return parseInt(i, 10);
    }
  }

  return usedThresholds.length;
};

/**
 * Calculates the responsive value by multiplying a constant to the current size of an element based on how big the
 * screen is.
 *
 * @param {number} width
 * @param {number} baseSize
 * @param {Array<number>} [multipliers]
 * @param {Array<number>} [thresholds]
 * @returns {number}
 */
export default (width: number, baseSize: number, multipliers?: Array<number>, thresholds?: Array<number>): number => {
  const size = getSize(width, thresholds);
  const usedMultipliers = multipliers || defaultMultipliers;

  if (typeof baseSize === 'number' && typeof usedMultipliers === 'object' && usedMultipliers.length > 0) {
    if (size >= usedMultipliers.length) {
      Log.warn(`Warning: No multiplier value available for size ${size} in multiplier array `
        + `[${usedMultipliers.join(', ')}], falling back to the largest multiplier value available. Length of `
        + 'multiplier array should be one more than the length of the threshold array.');

      return baseSize * usedMultipliers[usedMultipliers.length - 1];
    }

    return baseSize * usedMultipliers[size];
  }

  if (typeof baseSize !== 'number') {
    Log.warn('Warning: baseSize must be a number.');
  }

  if (typeof usedMultipliers !== 'object' || usedMultipliers.length <= 0) {
    Log.warn('Warning: multiplier must be a non empty array.');
  }

  return 0;
};
