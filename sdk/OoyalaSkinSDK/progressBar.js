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
    width: React.PropTypes.number,
    percent: React.PropTypes.number,
    onScrub: React.PropTypes.func
  },

  handleTouchStart: function(event) {
    this.setState({showSlider:true, sliderX:event.nativeEvent.pageX});
  },

  handleTouchMove: function(event) {
    this.setState({sliderX:event.nativeEvent.pageX});   
  },

  handleTouchEnd: function(event) {
    if (this.props.onScrub) {
      this.props.onScrub(event.nativeEvent.pageX / this.props.width);
    }
    this.setState({showSlider:false});
  },

  _renderScrubber: function() {

  },

  render: function() {
    var playedPercent = this.props.percent;
    var bufferedPercent = 0
    var unbufferedPercent = 1 - playedPercent - bufferedPercent;
    
    var playedStyle = {backgroundColor: '#4389FF', flex: playedPercent};
    var bufferedStyle = {backgroundColor: '#7F7F7F', flex: bufferedPercent};
    var unbufferedStyle = {backgroundColor: '#AFAFAF', flex: unbufferedPercent};
    
    var progressStyles = StyleSheet.create({played:playedStyle, buffered:bufferedStyle, unbuffered:unbufferedStyle});
    return (
      <View 
        style={styles.container} 
        onTouchStart={(event) => this.handleTouchStart(event)}
        onTouchMove={(event) => this.handleTouchMove(event)}
        onTouchEnd={(event) => this.handleTouchEnd(event)}>
        <View style={progressStyles.played} />
        <View style={progressStyles.buffered} />
        <View style={progressStyles.unbuffered} />
        {this._renderScrubber()}
      </View>
    );
  }
});

module.exports = ProgressBar;
