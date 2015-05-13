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
var EndScreen = require('./EndScreen');

var ICONS = require('./constants').ICONS;

var VideoView = require('./videoView');

var OoyalaSkin = React.createClass({
  getInitialState() {
    return {
      screenType: 'end', 
      title: 'video title', 
      description: 'this is the detail of the video', 
      promoUrl: '', 
      playhead:0, 
      duration:1, 
      rate:0};
  },

  handlePress: function(name) {
    eventBridge.onPress({name:name});
  },

  handleScrub: function(value) {
    eventBridge.onScrub(value);
  },

  onTimeChange: function(e) {
    if (e.rate == 0 && e.playhead == 0 && e.duration != 0) {
      this.setState({screenType: 'end'});
    }

    if (e.rate > 0) {
      this.setState({screenType: 'video'});
    }
    this.setState({playhead:e.playhead, duration:e.duration, rate:e.rate, title:e.title});
  },

  onCurrentItemChange: function(e) {
    console.log("currentItemChangeReceived, promoUrl is " + e.promoUrl);
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
    } else if (this.state.screenType == 'end'){
      var EndScreenConfig = {mode:'default', infoPanel:{visible:true}};
      return (
        <EndScreen
          config={EndScreenConfig}
          title={"Intersteller"}
          description={"This is the Intersteller"}
          promoUrl={"http://cdn.zmescience.com/wp-content/uploads/2015/02/maxresdefault.jpg"} >
        </EndScreen>
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

