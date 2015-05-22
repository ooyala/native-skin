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

var ProgressBar = require('./progressBar');
var ControlBar = require('./controlBar');
var ClosedCaptionsView = require('./closedCaptionsView');
var AnimationExperimental = require('AnimationExperimental');
var ICONS = require('./constants').ICONS;

var VideoView = React.createClass({
  getInitialState: function() {
    return {showControls:true};
  },

  propTypes: {
    showPlay: React.PropTypes.bool,
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
    width: React.PropTypes.number,
    onPress: React.PropTypes.func,
    onScrub: React.PropTypes.func,
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

  toggleControlBar: function() {
    for (var ref in this.refs) {
      console.log("ref is",ref);
      AnimationExperimental.startAnimation({
        node: this.refs[ref],
        duration: 500,
        property: 'opacity',
        easing: 'easingInOutExpo',
        toValue: this.state.showControls ? 0 : 1,
      });
    }
    this.setState({showControls:!this.state.showControls});
  },

  handleTouchEnd: function(event) {
    this.toggleControlBar();
  },

  render: function() {
    var progressBar;
    var controlBar;
    
    progressBar = (<ProgressBar ref='progressBar' 
      playhead={this.props.playhead} 
      duration={this.props.duration}
      width={this.props.width} 
      onScrub={(value)=>this.handleScrub(value)} />);

    controlBar = (<ControlBar 
      ref='controlBar' 
      showPlay={this.props.showPlay} 
      playhead={this.props.playhead} 
      duration={this.props.duration} 
      primaryActionButton = {this.props.showPlay? ICONS.PLAY: ICONS.PAUSE}
      onPress={(name) => this.handlePress(name)} />);
    
    return (
      <View style={styles.container}>
      <View 
      style={styles.placeholder}
      onTouchEnd={(event) => this.handleTouchEnd(event)}>  
      </View>
            <ClosedCaptionsView style={styles.cc}></ClosedCaptionsView>
      {progressBar}
      {controlBar}
      </View>
      );
  }
});

var styles = StyleSheet.create({
                               cc : { width:100, height:50 },
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
