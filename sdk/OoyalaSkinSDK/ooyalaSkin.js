/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {
  ActivityIndicatorIOS,
  AppRegistry,
  DeviceEventEmitter,
  SliderIOS,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var eventBridge = require('NativeModules').OOReactBridge;
var StartScreen = require('./StartScreen');

var ICONS = require('./constants').ICONS;

var VideoView = require('./videoView');

var OoyalaSkin = React.createClass({
  getInitialState() {
    return {screenType: 'start', title: 'sample title', description: 'sample description', playhead:0, duration:1, rate:0};
  },

  handlePress: function(name) {
    eventBridge.onPress({name:name});
  },

  handleScrub: function(value) {
    eventBridge.onScrub(value);
  },

  update(e) {
    console.log("update received, new state is " + e);
    if (e.rate > 0) {
      this.setState(screenType: 'video');
    }
    this.setState({playhead:e.playhead, duration:e.duration, rate:e.rate, title:e.title});
  },

  componentWillMount: function() {
    console.log("componentWillMount");
    var subscription = DeviceEventEmitter.addListener(
      'playerState', 
      (reminder) => this.update(reminder)
    );
  },

  componentWillUnmount: function() {
    subscription.remove;
  },

  render: function() {
    if (this.state.screeType == 'start') {
      var startScreenConfig = {mode:'defalut', infoPanel:{visible:true}};
      return (
        <StartScreen 
          config={startScreenConfig}
          title={this.state.title}
          description={this.state.description}
          onPress={(name) => this.handlePress(name)} >
        </StartScreen>
      );
    } else {
      var showPlayButton = this.state.rate > 0 ? false : true;
      return (
        <VideoView 
          showPlay={showPlayButton} 
          playhead={this.state.playhead} 
          duration={this.state.duration} 
          onPress={(name) => this.handlePress(name)}>
        </VideoView>
      );
    }
  }
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);

