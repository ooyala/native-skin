/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet
} = React;

var eventBridge = require('NativeModules').OOReactBridge;

var ICONS = require('./constants').ICONS;

var ProgressBar = React.createClass({
  propTypes: {
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
  },

  getDefaultProps: function() {
    return {playhead: 0, buffered: 0, duration: 1};
  },

  render: function() {
    var unbuffered = this.props.duration - this.props.playhead - this.props.buffered;
    if (unbuffered < 0) {
      unbuffered = 0;
    }
    var cs = {flexDirection: 'row', height: 8};
    var ps = {backgroundColor: '#488DFB', flex: this.props.playhead};
    var bs = {backgroundColor: '#808080', flex: this.props.buffered};
    var us = {backgroundColor: '#B0B0B0', flex: unbuffered};
    var styles = StyleSheet.create({container:cs, played:ps, buffered:bs, unbuffered:us});

    return (
      <View style={styles.container}>
        <View style={styles.played} />
        <View style={styles.buffered} />
        <View style={styles.unbuffered} />
      </View>
    );
  }
});

module.exports = ProgressBar;
