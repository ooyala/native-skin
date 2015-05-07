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

var ICONS = require('./constants').ICONS;

var VideoView = require('./videoView');

var OoyalaSkin = React.createClass({
  getInitialState() {
    return {title:"Bunny", playhead:0, duration:0, rate:0};
  },

  handlePress: function(name) {
    eventBridge.onPress({name:name});
  },

  handleScrub: function(value) {
    eventBridge.onScrub(value);
  },

  update: function(e) {
    console.log("update received, new state is %o", e);
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
    var showPlayButton = this.state.rate > 0 ? false : true;
    
    return (
      <VideoView showPlay={showPlayButton} playhead={this.state.playhead} duration={this.state.duration} onPress={(name) => this.handlePress(name)}/>
    );
  }
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
