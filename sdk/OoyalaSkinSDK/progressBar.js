/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  LayoutAnimation
} = React;

var Utils = require('./utils');
var styles = Utils.getStyles(require('./style/progressBarStyles.json'));

var ProgressBar = React.createClass({
  propTypes: {
    percent: React.PropTypes.number
  },

  render: function() {
    var playedPercent = this.props.percent;
    var bufferedPercent = 0;
    var unbufferedPercent = 1 - playedPercent - bufferedPercent;
    
    var playedStyle = {backgroundColor: '#4389FF', flex: playedPercent};
    var bufferedStyle = {backgroundColor: '#7F7F7F', flex: bufferedPercent};
    var unbufferedStyle = {backgroundColor: '#AFAFAF', flex: unbufferedPercent};
    
    var progressStyles = StyleSheet.create({played:playedStyle, buffered:bufferedStyle, unbuffered:unbufferedStyle});
    return (
      <View style={styles.container}>
        <View style={progressStyles.played} />
        <View style={progressStyles.buffered} />
        <View style={progressStyles.unbuffered} />
      </View>
    );
  }
});

module.exports = ProgressBar;
