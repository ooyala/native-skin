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
   * makeResponsive takes an object that has the width of the player and
   * returns an object that has it's current state, a rendered style,
   * and other data for responsiveness.
   *
   * Priority:
   *  values,
   *  multiplier,
   *
   * @param args: {
   *  width,
   *  baseSize,
   *  threshold[],
   *  multiplier[],
   *  values[],
   *  style
   * }
   *
   * return: {
   *  value: the responsive value based on the size of the width,
   *  style: the style object that can be rendered in jsx
   * }
   */
  makeResponsive: function(args) {
    var responsive = {};

    // If the method of responsive manipulation uses specific values between each threshold.
    if(args.values) {
      responsive.value = this.makeResponsiveValues(args.width, args.threshold, args.values)
    }
    // If the method of responsive manipulation uses a multiplier on the baseSize between each threshold.
    else if(args.baseSize) {
      responsive.value = this.makeResponsiveMultiplier(args.width, args.threshold, args.multiplier, args.baseSize);
    }
    // If no values or multipliers are given
    else {
      return;
    }

    // If a style is specified to return.
    if(args.style && responsive.value) {
      responsive.style = {};
      responsive.style[args.style] = responsive.value;
    }

    return responsive;
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
  makeResponsiveMultiplier: function(width, threshold, multiplier, baseSize) {
    var size = this.getSize(width, threshold);
    var multiple = (multiplier) ? multiplier : this.multiplier;

    return baseSize * multiple[size];
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
  makeResponsiveValues: function(width, threshold, values) {
    var size = this.getSize(width, threshold);

    return values[size];
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
      var responsiveArgs = {
        width: 500,
        baseSize: 100,
        threshold: [200, 800],
        multiplier: [1, 2, 3]
      };
      var responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals(responsive.value, 200, responsive);
    },

    TestResponsive_multiplier_medium_default: function() {
      var responsiveArgs = {
        width: 500,
        baseSize: 100
      };
      var responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals(responsive.value, 100, responsive);
    },

    TestResponsive_multiplier_small: function() {
      var responsiveArgs = {
        width: 100,
        baseSize: 100,
        threshold: [200, 800],
        multiplier: [1, 2, 3]
      };
      var responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals(responsive.value, 100, responsive);
    },

    TestResponsive_multiplier_small_border: function() {
      var responsiveArgs = {
        width: 200,
        baseSize: 100,
        threshold: [200, 800],
        multiplier: [1, 2, 3]
      };
      var responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals(responsive.value, 100, responsive);
    },

    TestResponsive_multiplier_large_border: function() {
      var responsiveArgs = {
        width: 800,
        baseSize: 100,
        threshold: [200, 800],
        multiplier: [1, 2, 3]
      };
      var responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals(responsive.value, 200, responsive);
    },

    TestResponsive_multiplier_large: function() {
      var responsiveArgs = {
        width: 900,
        baseSize: 100,
        threshold: [200, 800],
        multiplier: [1, 2, 3]
      };
      var responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals(responsive.value, 300, responsive);
    },

    TestResponsive_values_medium: function() {
      var responsiveArgs = {
        width: 500,
        baseSize: 100,
        threshold: [200, 800],
        values: [200,300,400]
      };
      var responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals( responsive.value, 300, responsive );
    },

    TestResponsive_values_undefined: function() {
      var responsiveArgs = {
        width: 500,
        baseSize: 100,
        threshold: [200, 800],
        values: [200]
      };
      var responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals( responsive.value, undefined, responsive );
    },

    TestResponsive_undefined: function() {
      var responsiveArgs = {
        width: 500
      };
      var responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals( responsive, undefined, responsive );
    },

    TestResponsive_style: function() {
      var responsiveArgs = {
        width: 500,
        baseSize: 100,
        threshold: [200, 800],
        multiplier: [1, 2, 3],
        style: 'opacity'
      };
      var responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals( responsive.style.opacity, 200, responsive );
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