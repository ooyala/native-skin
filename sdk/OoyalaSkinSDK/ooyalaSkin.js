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
    return {
      screenType: 'start', 
      title: 'video title', 
      description: 'this is the detail of the video', 
      promoUrl: '', 
      playhead:0, 
      duration:1, 
      rate:0};
  },

  handlePress: function(n) {
    eventBridge.onPress({name:n});
  },

  handleScrub: function(value) {
    eventBridge.onScrub({percentage:value});
  },

  onTimeChange: function(e) {
    if (e.rate > 0) {
      this.setState({screenType: 'video'});
    }
    this.setState({playhead:e.playhead, duration:e.duration, rate:e.rate, title:e.title});
  },

  onCurrentItemChange: function(e) {
    console.log("currentItemChangeReceived, promoUrl is " + e.promoUrl);
    this.setState({screenType: 'start', title:e.title, description:e.description, duration:e.duration, promoUrl:e.promoUrl});
  },

  componentWillMount: function() {
    console.log("componentWillMount");
    var timeChangeListener = DeviceEventEmitter.addListener(
      'timeChanged', 
      (reminder) => this.onTimeChange(reminder)
    );
    var itemChangeListener = DeviceEventEmitter.addListener(
      'currentItemChanged', 
      (reminder) => this.onCurrentItemChange(reminder)
    );
  },

  componentWillUnmount: function() {
    timeChangeListener.remove;
    itemChangeListener.remove;
  },

  render: function() {
    if (this.state.screenType == 'start') {
      var startScreenConfig = {mode:'default', infoPanel:{visible:true}};
      return (
        <StartScreen 
          config={startScreenConfig}
          title={this.state.title}
          description={this.state.description}
          promoUrl={this.state.promoUrl}
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
          onPress={(value) => this.handlePress(value)}
          onScrub={(value) => this.handleScrub(value)}>
        </VideoView>
      );
    }
  }
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);

