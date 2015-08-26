/**
 * Created by dkao on 8/18/15.
 */

'use strict';

var ResponsiveDesignManager = {

  // Default threshold and multiplier
  threshold: [320, 860],
  multiplier: [0.8, 1, 1.2],

  /**
   * getSize takes the width and the threshold and returns an integer
   * that represents which threshold the player width currently lies in.
   *
   * @param width
   * @param threshold
   * @returns {number}
   */
  getSize: function(width, threshold) {
    var threshold = (threshold) ? threshold : this.threshold;
    for(var i = 0; i < threshold.length; i++) {
      if(width <= threshold[i]) {
        return parseInt(i);
      }
    }
    return threshold.length;
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
  makeResponsiveMultiplier: function(width, baseSize, multiplier, threshold) {
    var size = this.getSize(width, threshold);
    var multipliers = (multiplier) ? multiplier : this.multiplier;

    if(typeof baseSize === "number" && typeof multipliers === "object" && multipliers.length > 0) {
      if(size >= multipliers.length) {
        console.log("Warning: No multiplier value available for size " + size + " in multiplier array [" + multipliers + "], falling back to the largest multiplier value available. Length of multiplier array should be one more than the length of the threshold array.");
        return baseSize * multipliers[multipliers.length - 1];
      }
      return baseSize * multipliers[size];
    }
    if(typeof baseSize !== "number") {
      console.log("Warning: baseSize must be a number.");
    }
    if(typeof multipliers !== "object" || multipliers.length <= 0) {
      console.log("Warning: multiplier must be a non empty array.");
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
  makeResponsiveValues: function(width, values, threshold) {
    var size = this.getSize(width, threshold);

    if(typeof values === "object" && values.length > 0) {
      if(size >= values.length) {
        console.log("Warning: No value available for size " + size + " in values array [" + values + "], falling back to the largest value available. Length of values array should be one more than the length of the threshold array.");
        return values[values.length - 1];
      }
      return values[size];
    }
    console.log("Warning: values must be a non empty array.");
    return 0;
  },

  /**
   * Contains testcases
   */
  TestSuite: {

    Assert: function() {
      var b = arguments[0];
      if( ! b ) {
        throw new Error( 'ASSERTION FAILED: ' + JSON.stringify(arguments) );
      }
    },
    AssertStrictEquals: function() {
      var o1 = arguments[0];
      var o2 = arguments[1];
      if( o1 !== o2 ) {
        var errorMessage = 'ASSERTION FAILED: ' + JSON.stringify(o1) + ' !== ' + JSON.stringify(o2);
        if( arguments.length > 2 ) {
          errorMessage += " (" + JSON.stringify(Array.prototype.slice.call(arguments, 2)) + ")";
        }
        throw new Error( errorMessage );
      }
    },

    TestResponsive_multiplier_medium: function() {
      var responsive = ResponsiveDesignManager.makeResponsiveMultiplier(500, 100, [1, 2, 3], [200, 800]);
      this.AssertStrictEquals(responsive, 200, responsive);
    },

    TestResponsive_multiplier_medium_default: function() {
      var responsive = ResponsiveDesignManager.makeResponsiveMultiplier(500, 100);
      this.AssertStrictEquals(responsive, 100, responsive);
    },

    TestResponsive_multiplier_small: function() {
      var responsive = ResponsiveDesignManager.makeResponsiveMultiplier(100, 100, [1, 2, 3], [200, 800]);
      this.AssertStrictEquals(responsive, 100, responsive);
    },

    TestResponsive_multiplier_small_border: function() {
      var responsive = ResponsiveDesignManager.makeResponsiveMultiplier(200, 100, [1, 2, 3], [200, 800]);
      this.AssertStrictEquals(responsive, 100, responsive);
    },

    TestResponsive_multiplier_large_border: function() {
      var responsive = ResponsiveDesignManager.makeResponsiveMultiplier(800, 100, [1, 2, 3], [200, 800]);
      this.AssertStrictEquals(responsive, 200, responsive);
    },

    TestResponsive_multiplier_large: function() {
      var responsive = ResponsiveDesignManager.makeResponsiveMultiplier(900, 100, [1, 2, 3], [200, 800]);
      this.AssertStrictEquals(responsive, 300, responsive);
    },

    TestResponsive_multiplier_overflow: function() {
      var responsive = ResponsiveDesignManager.makeResponsiveMultiplier(900, 100, [1], [200, 800]);
      this.AssertStrictEquals(responsive, 100, responsive);
    },

    TestResponsive_values_medium: function() {
      var responsive = ResponsiveDesignManager.makeResponsiveValues(500, [200, 300, 400], [200, 800]);
      this.AssertStrictEquals( responsive, 300, responsive );
    },

    TestResponsive_values_overflow: function() {
      var responsive = ResponsiveDesignManager.makeResponsiveValues(500, [200], [200, 800]);
      this.AssertStrictEquals( responsive, 200, responsive );
    },

    TestResponsive_values_empty_array: function() {
      var responsive = ResponsiveDesignManager.makeResponsiveValues(500, [], [200, 800]);
      this.AssertStrictEquals( responsive, 0, responsive );
    },

    Run: function() {
      var keys = Object.keys( this ).sort();
      for( var i = 0; i < keys.length; ++i ) {
        var k = keys[i];
        var isFunction = typeof(this[k]) == "function";
        var isTest = k.indexOf("Test") == 0;
        if( isFunction && isTest ) {
          console.log( "+++", k );
          this[k]();
          console.log( "---",  k, "PASS!" );
        }
      }
      console.log( "ran", keys.length, "tests." );
    }
  }

};

module.exports = ResponsiveDesignManager;