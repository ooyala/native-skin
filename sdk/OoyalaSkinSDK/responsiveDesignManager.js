/**
 * Created by dkao on 8/18/15.
 */

'use strict';

var ResponsiveDesignManager = {

  // Default threshold
  threshold: [320, 860],

  /**
   * makeResponsive takes an object that has the width and height of the
   * player and returns an object that has it's current state, a rendered
   * style, and other data for responsiveness.
   *
   * Priority:
   *  multiplier,
   *  values,
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
    // Between which two array threshold elements is the current size?
    var size = 0;
    var threshold;

    // See if threshold is provided or not
    if(args.threshold) {
      threshold = args.threshold;
    }
    else {
      threshold = this.threshold;
    }

    for(var i in threshold) {
      if(args.width > threshold[i]) {
        size = parseInt(i) + 1;
      }
    }

    var responsive = {};
    // If the responsive using a multiplier at each size.
    if(args.multiplier) {
      // Throw an error if the threshold and values are not provided correctly.
      if(args.multiplier.length != args.threshold.length + 1) {
        throw new Error("Multiplier array needs to be one element greater than threshold array.");
      }
      if(!args.baseSize) {
        throw new Error("baseSize must me given when using multiplier");
      }
      responsive.value = args.baseSize * args.multiplier[size];
    }
    // If the responsive using specific values at each size.
    else if(args.values) {
      // Throw an error if the threshold and values are not provided correctly.
      if(args.values.length != args.threshold.length + 1) {
        throw new Error("Values array needs to be one element greater than threshold array.");
      }
      responsive.value = args.values[size];
    }
    // If no values or multipliers are given
    else {
      throw new Error("No responsive methods given.");
    }

    // If a style is specified to return.
    if(args.style && responsive.value) {
      responsive.style = {};
      responsive.style[args.style] = responsive.value;
    }

    return responsive;
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

    TestResponsive_sizing: function() {
      var responsiveArgs = {
        width: 500,
        baseSize: 100,
        threshold: [200, 800],
        multiplier: [1, 2, 3]
      };
      var responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals( responsive.value, 200, responsive );

      responsiveArgs.width = 100;
      responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals( responsive.value, 100, responsive );

      responsiveArgs.width = 200;
      responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals( responsive.value, 100, responsive );

      responsiveArgs.width = 800;
      responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals( responsive.value, 200, responsive );

      responsiveArgs.width = 900;
      responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals( responsive.value, 300, responsive );

      responsiveArgs.width = 500;
      responsiveArgs.multiplier = null;
      responsiveArgs.values = [200,300,400];
      responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
      this.AssertStrictEquals( responsive.value, 300, responsive );
    },

    TestResponsive_invalid: function() {
      var responsiveArgs = {
        width: 500,
        baseSize: 100,
        threshold: [200, 800],
        multiplier: [1]
      };
      var responsive = {};

      try {
        responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
        this.Assert(false);
      }
      catch (error) {
        this.Assert(true);
      }

      responsiveArgs.baseSize = null;
      try {
        responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
        this.Assert(false);
      }
      catch (error) {
        this.Assert(true);
      }

      responsiveArgs.baseSize = 100;
      responsiveArgs.threshold = null;
      try {
        responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
        this.Assert(false);
      }
      catch (error) {
        this.Assert(true);
      }

      responsiveArgs.multiplier = [1,2,3,4,5];
      try {
        responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
        this.Assert(false);
      }
      catch (error) {
        this.Assert(true);
      }

      responsiveArgs.multiplier = null;
      try {
        responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
        this.Assert(false);
      }
      catch (error) {
        this.Assert(true);
      }

      responsiveArgs.multiplier = 1;
      try {
        responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
        this.Assert(false);
      }
      catch (error) {
        this.Assert(true);
      }

      responsiveArgs.threshold = [200, 800];
      responsiveArgs.values = [200,500];
      try {
        responsive = ResponsiveDesignManager.makeResponsive(responsiveArgs);
        this.Assert(false);
      }
      catch (error) {
        this.Assert(true);
      }
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