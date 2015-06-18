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
    isShow: React.PropTypes.bool,
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
    width: React.PropTypes.number,
    onScrub: React.PropTypes.func,
  },

  getInitialState: function() {
    return {showSlider:false, sliderX: 0};
  },

  getDefaultProps: function() {
    return {playhead: 0, buffered: 0, duration: 1};
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

  positionToPercent:function(position) {
    var percent = position / this.props.duration;
    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }
    return percent;
  },

  render: function() {
    var playedPercent = this.positionToPercent(this.props.playhead);
    var bufferedPercent = this.positionToPercent(this.props.buffered - this.props.playhead);
    var unbufferedPercent = 1 - playedPercent - bufferedPercent;
    
    var playedStyle = {backgroundColor: '#488DFB', flex: playedPercent};
    var bufferedStyle = {backgroundColor: '#808080', flex: bufferedPercent};
    var unbufferedStyle = {backgroundColor: '#B0B0B0', flex: unbufferedPercent};
    
    var progressStyles = StyleSheet.create({played:playedStyle, buffered:bufferedStyle, unbuffered:unbufferedStyle});
    var slider;
    if (this.props.showSlider) {
      slider = (<View style={{backgroundColor: 'white', position: 'absolute', left: this.state.sliderX, width: 10, height:10}} />);
    }

    var displayStyle;
    if(this.props.isShow) {
      displayStyle = styles.container;
    }
    else {
      displayStyle = styles.containerHidden;
    }
    return (
      <View 
        style={displayStyle} 
        onTouchStart={(event) => this.handleTouchStart(event)}
        onTouchMove={(event) => this.handleTouchMove(event)}
        onTouchEnd={(event) => this.handleTouchEnd(event)}>
        <View style={progressStyles.played} />
        <View style={progressStyles.buffered} />
        <View style={progressStyles.unbuffered} />
        {slider}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    height: 10
  },
  containerHidden: {
    flexDirection: 'row', 
    height: 10,
    top: 46
  },
});

module.exports = ProgressBar;
