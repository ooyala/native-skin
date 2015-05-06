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
    played: React.PropTypes.number,
    buffered: React.PropTypes.number,
  },

  getDefaultProps: function() {
    return {played: 0, buffered: 0};
  },

  render: function() {
    var unbuffered = 1 - this.props.played - this.props.buffered;
    var ps = {backgroundColor: 'blue', flex: this.props.played};
    var bs = {backgroundColor: 'green', flex: this.props.buffered};
    var us = {backgroundColor: 'grey', flex: unbuffered};
    var styles = StyleSheet.create({played:ps, buffered:bs, unbuffered:us});

    return (
      <View style={{flexDirection: 'row', height: 10}}>
        <View style={styles.played} />
        <View style={styles.buffered} />
        <View style={styles.unbuffered} />
      </View>
    );
  }
});

module.exports = ProgressBar;
