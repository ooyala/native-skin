/**
 * Created by dkao on 8/18/15.
 */

'use strict';

var ResponsiveDesignManager = {

  /**
   * makeResponsive takes an object that has the width and height of the
   * player and returns an object that has it's current state, a rendered
   * style, and other data for responsiveness.
   *
   * Priority:
   *  values,
   *  threshold,
   *
   * @param args: {
   *  width,
   *  height,
   *  baseSize,
   *  threshold[],
   *  multiplier[],
   *  values[],
   *  style
   * }
   */
  makeResponsive: function(args) {
    // Between which two array threshold elemnts is the current size?
    var size = 0;
    for(var i in args.threshold) {
      if(args.width > args.threshold[i]) {
        size = parseInt(i) + 1;
      }
    }

    var responsive = {};

    if(args.multiplier) {
      responsive.value = args.baseSize * args.multiplier[size];
    }
    else if(args.values) {
      responsive.value = args.values[size];
    }

    if(args.style && responsive.value) {
      responsive.style = {};
      responsive.style[args.style] = responsive.value;
    }

    return responsive;
  }

};

module.exports = ResponsiveDesignManager;