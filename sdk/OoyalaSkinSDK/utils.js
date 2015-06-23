/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet
} = React;


var Utils = {
  getStyles: function(specificStyles) {
    var globalStyles = require('./style/styles.json');

    if(specificStyles == undefined) {
      specificStyles = {};
    }

    var styles = {};
    for (var attrname in globalStyles) { styles[attrname] = globalStyles[attrname]; }
    for (var attrname in specificStyles) { styles[attrname] = specificStyles[attrname]; }

    return React.StyleSheet.create(styles);
  },

  isPlaying: function( rate ) {
    return rate > 0;
  },

  isPaused: function( rate ) {
    return rate == 0;
  },

  secondsToString: function(seconds) {
    var  minus = '';
    if (seconds < 0) {
      minus = "-";
      seconds = -seconds;
    }
    var date = new Date(seconds * 1000);
    var hh = date.getUTCHours();
    var mm = date.getUTCMinutes();
    var ss = date.getSeconds();
    if (ss < 10) {
      ss = "0" + ss;
    }
    if (mm == 0) {
      mm = "00";
    } else if (mm < 10) {
      mm = "0" + mm;
    }
    var t = mm + ":" + ss;
    if (hh > 0) {
      t = hh + ":" + t;
    }
    return minus + t;
  }
}

module.exports = Utils;
