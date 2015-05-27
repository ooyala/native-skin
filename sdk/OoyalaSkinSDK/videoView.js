/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
 var React = require('react-native');
 var {
  Text,
  View,
  StyleSheet
} = React;

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var ProgressBar = require('./progressBar');
var ControlBar = require('./controlBar');
var ClosedCaptionsView = require('./closedCaptionsView');
var AnimationExperimental = require('AnimationExperimental');
var ICONS = require('./constants').ICONS;

var VideoView = React.createClass({
  getInitialState: function() {
    return {
      showControls: true,
      ccOverlayBottomMargin: 60,
    };
  },

  propTypes: {
    showPlay: React.PropTypes.bool,
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
    width: React.PropTypes.number,
    onPress: React.PropTypes.func,
    onScrub: React.PropTypes.func,
    closedCaptionsLanguage: React.PropTypes.string,
    availableClosedCaptionsLanguages: React.PropTypes.array,
  },

  handlePress: function(name) {
    this.props.onPress(name);
  },

  handleScrub: function(value) {
    this.props.onScrub(value);
  },

  getDefaultProps: function() {
    return {showPlay: true, playhead: 0, buffered: 0, duration: 1};
  },

  onToggleControlBarAnimationProgress: function( finished ) {
    console.log( "onControlBarVisibilityAnimationDone: " + finished );
    if( finished ) {
      this.setState( {
        ccOverlayBottomMargin:
          this.state.showControls ?
            60 :
            10
        }
      );
    }
  },

  toggleControlBar: function() {
    for (var ref in this.refs) {
      console.log("ref is",ref);
      AnimationExperimental.startAnimation({
        node: this.refs[ref],
        duration: 500,
        property: 'opacity',
        easing: 'easingInOutExpo',
        toValue: this.state.showControls ? 0 : 1,
      },
      this.onToggleControlBarAnimationProgress);
    }
    this.setState({showControls:!this.state.showControls});
  },

  handleTouchEnd: function(event) {
    this.toggleControlBar();
  },

  render: function() {

    var progressBar = (<ProgressBar ref='progressBar'
      playhead={this.props.playhead} 
      duration={this.props.duration}
      width={this.props.width}
      onScrub={(value)=>this.handleScrub(value)} />);

    var shouldShowClosedCaptionsButton = this.props.availableClosedCaptionsLanguages ? true : false;
    var controlBar = (<ControlBar
      ref='controlBar' 
      showPlay={this.props.showPlay} 
      playhead={this.props.playhead} 
      duration={this.props.duration}
      primaryActionButton = {this.props.showPlay? ICONS.PLAY: ICONS.PAUSE}
      onPress={(name) => this.handlePress(name)}
      showClosedCaptionsButton={shouldShowClosedCaptionsButton} />);

    var placeholder = (<View
      style={styles.placeholder}
      onTouchEnd={(event) => this.handleTouchEnd(event)} />);

    var ccOverlayHeight = windowSize.height - this.state.ccOverlayBottomMargin;
    var ccOpacity = this.props.closedCaptionsLanguage ? 1 : 0;
    console.log( "ccOpacity = " + ccOpacity + " <- closedCaptionsLanguage = " + this.props.closedCaptionsLanguage );
    var ccOverlay = ( <ClosedCaptionsView
          style={[{position:'absolute', left:0, top:0, width:windowSize.width, height:ccOverlayHeight, opacity:ccOpacity}]}
          onTouchEnd={(event) => this.handleTouchEnd(event)} /> );

    return (
      <View style={styles.container}>
        {placeholder}
        {progressBar}
        {controlBar}
        {ccOverlay}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(255,0,0,0.25);',
  },
  placeholder : {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,255,0,0.25);',
  },
});

module.exports = VideoView
