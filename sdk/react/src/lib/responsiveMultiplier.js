import Log from './log';

export default {

  // Default threshold and multiplier
  default_threshold: [320, 860],
  default_multiplier: [0.7, 1, 1.2],

  /**
   * getSize takes the width and the threshold and returns an integer
   * that represents which threshold the player width currently lies in.
   *
   * @param width
   * @param threshold
   * @returns {number}
   */
  getSize(width, threshold) {
    const used_threshold = threshold || this.default_threshold;
    for (let i = 0; i < used_threshold.length; i++) {
      if (width <= used_threshold[i]) {
        return parseInt(i);
      }
    }
    return used_threshold.length;
  },

  /**
   * makeResponsiveMultiplier calculates the responsive value by multiplying a
   * constant to the current size of an element based on how big the screen is.
   *
   * @param width
   * @param threshold
   * @param multiplier
   * @param baseSize
   * @returns {number}
   */
  makeResponsiveMultiplier(width, baseSize, multiplier, threshold) {
    const size = this.getSize(width, threshold);
    const multipliers = multiplier || this.default_multiplier;

    if (typeof baseSize === 'number'
      && typeof multipliers === 'object'
      && multipliers.length > 0) {
      if (size >= multipliers.length) {
        Log.warn(`Warning: No multiplier value available for size ${size} in multiplier array [${multipliers}], falling back to the largest multiplier value available. Length of multiplier array should be one more than the length of the threshold array.`);
        return baseSize * multipliers[multipliers.length - 1];
      }
      return baseSize * multipliers[size];
    }
    if (typeof baseSize !== 'number') {
      Log.warn('Warning: baseSize must be a number.');
    }
    if (typeof multipliers !== 'object' || multipliers.length <= 0) {
      Log.warn('Warning: multiplier must be a non empty array.');
    }
    return 0;
  },

  /**
   * makeResponsiveValues calculates the responsive value by taking the value from
   * an array that specifies specific values at each threshold.
   *
   * @param width
   * @param threshold
   * @param values
   * @returns {number}
   */
  makeResponsiveValues(width, values, threshold) {
    const size = this.getSize(width, threshold);

    if (typeof values === 'object' && values.length > 0) {
      if (size >= values.length) {
        Log.warn(`Warning: No value available for size ${size} in values array [${values}], falling back to the largest value available. Length of values array should be one more than the length of the threshold array.`);
        return values[values.length - 1];
      }
      return values[size];
    }
    Log.warn('Warning: values must be a non empty array.');
    return 0;
  },

  /**
   * Contains testcases
   */
  TestSuite: {

    Assert() {
      const b = arguments[0];
      if (!b) {
        throw new Error(`ASSERTION FAILED: ${JSON.stringify(arguments)}`);
      }
    },
    AssertStrictEquals() {
      const o1 = arguments[0];
      const o2 = arguments[1];
      if (o1 !== o2) {
        let errorMessage = `ASSERTION FAILED: ${JSON.stringify(o1)} !== ${JSON.stringify(o2)}`;
        if (arguments.length > 2) {
          errorMessage += ` (${JSON.stringify(Array.prototype.slice.call(arguments, 2))})`;
        }
        throw new Error(errorMessage);
      }
    },

    TestResponsive_multiplier_medium() {
      const responsive = ResponsiveMultiplier.makeResponsiveMultiplier(500, 100, [1, 2, 3], [200, 800]);
      this.AssertStrictEquals(responsive, 200, responsive);
    },

    TestResponsive_multiplier_medium_default() {
      const responsive = ResponsiveMultiplier.makeResponsiveMultiplier(500, 100);
      this.AssertStrictEquals(responsive, 100, responsive);
    },

    TestResponsive_multiplier_small() {
      const responsive = ResponsiveMultiplier.makeResponsiveMultiplier(100, 100, [1, 2, 3], [200, 800]);
      this.AssertStrictEquals(responsive, 100, responsive);
    },

    TestResponsive_multiplier_small_border() {
      const responsive = ResponsiveMultiplier.makeResponsiveMultiplier(200, 100, [1, 2, 3], [200, 800]);
      this.AssertStrictEquals(responsive, 100, responsive);
    },

    TestResponsive_multiplier_large_border() {
      const responsive = ResponsiveMultiplier.makeResponsiveMultiplier(800, 100, [1, 2, 3], [200, 800]);
      this.AssertStrictEquals(responsive, 200, responsive);
    },

    TestResponsive_multiplier_large() {
      const responsive = ResponsiveMultiplier.makeResponsiveMultiplier(900, 100, [1, 2, 3], [200, 800]);
      this.AssertStrictEquals(responsive, 300, responsive);
    },

    TestResponsive_multiplier_overflow() {
      const responsive = ResponsiveMultiplier.makeResponsiveMultiplier(900, 100, [1], [200, 800]);
      this.AssertStrictEquals(responsive, 100, responsive);
    },

    TestResponsive_values_medium() {
      const responsive = ResponsiveMultiplier.makeResponsiveValues(500, [200, 300, 400], [200, 800]);
      this.AssertStrictEquals(responsive, 300, responsive);
    },

    TestResponsive_values_overflow() {
      const responsive = ResponsiveMultiplier.makeResponsiveValues(500, [200], [200, 800]);
      this.AssertStrictEquals(responsive, 200, responsive);
    },

    TestResponsive_values_empty_array() {
      const responsive = ResponsiveMultiplier.makeResponsiveValues(500, [], [200, 800]);
      this.AssertStrictEquals(responsive, 0, responsive);
    },

    Run() {
      const keys = Object.keys(this)
        .sort();
      for (const key of keys) {
        const isFunction = typeof (this[key]) === 'function';
        const isTest = key.indexOf('Test') == 0;
        if (isFunction && isTest) {
          Log.log('+++', key);
          this[key]();
          Log.log('---', key, 'PASS!');
        }
      }
      Log.log('ran', keys.length, 'tests.');
    },
  },
};
