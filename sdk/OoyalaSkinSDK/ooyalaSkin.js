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
var PauseScreen = require('./PauseScreen');

var Constants = require('./constants');
var {
  ICONS,
  BUTTON_NAMES
} = Constants;
var VideoView = require('./videoView');

var OoyalaSkin = React.createClass({

  // note/todo: some of these are more like props, expected to be over-ridden/updated
  // by the native bridge, and others are used purely on the non-native side.
  // consider using a leading underscore, or something?
  getInitialState() {
    return {
      screenType: 'start', 
      title: 'video title', 
      description: 'this is the detail of the video', 
      promoUrl: '', 
      playhead: 0,
      duration: 1,
      rate: 0,
      _closedCaptionsLanguage: null,
      availableClosedCaptionsLanguages: null,
      captionJSON: null,
    };
  },

  cchack: function(n) {
    // todo: remove this testing hack and do it right...
    if( n === BUTTON_NAMES.CLOSED_CAPTIONS ) {
      if( this.state.availableClosedCaptionsLanguages ) {
        var ccl = (this.state._closedCaptionsLanguage ? null : this.state.availableClosedCaptionsLanguages[0]);
        this.setState({_closedCaptionsLanguage: ccl});
      }
    }
    // todo: ...remove this testing hack and do it right.
  },

  handlePress: function(n) {
    this.cchack(n); // todo: remove this testing hack and do it right.
    eventBridge.onPress({name:n});
  },

  handleScrub: function(value) {
    eventBridge.onScrub({percentage:value});
  },

  _updateClosedCaptions: function() {
    eventBridge.onClosedCaptionUpdateRequested( {language:this.state._closedCaptionsLanguage} );
  },

  onClosedCaptionUpdate: function(e) {
    this.setState( {captionJSON: e} );
  },

  onTimeChange: function(e) {
    if (e.rate > 0) {
      this.setState({screenType: 'video'});
    }
    this.setState({
      playhead: e.playhead,
      duration: e.duration,
      rate: e.rate,
      availableClosedCaptionsLanguages: e.availableClosedCaptionsLanguages,
    });
    this._updateClosedCaptions();
  },

  onCurrentItemChange: function(e) {
    console.log("currentItemChangeReceived, promoUrl is " + e.promoUrl);
    this.setState({screenType: 'start', title:e.title, description:e.description, duration:e.duration, promoUrl:e.promoUrl, width:e.width});
  },

  onFrameChange: function(e) {
    console.log("receive frameChange, frame width is" + e.width + " height is" + e.height);
    this.setState({width:e.width});
  },

  onPlayComplete: function(e) {
    this.setState({screenType: 'end'});
  },

  onPause: function(e) {
    this.setState({screenType: 'pause'});
  },

  componentWillMount: function() {
    console.log("componentWillMount");
    this.listeners = [];
    this.listeners.push( DeviceEventEmitter.addListener(
      'timeChanged', 
      (event) => this.onTimeChange(event)
    ) );
    this.listeners.push( DeviceEventEmitter.addListener(
      'currentItemChanged',
      (event) => this.onCurrentItemChange(event)
    ) );
    this.listeners.push( DeviceEventEmitter.addListener(
      'frameChanged',
      (event) => this.onFrameChange(event)
    ) );
    this.listeners.push( DeviceEventEmitter.addListener(
      'playCompleted',
      (event) => this.onPlayComplete(event)
    ) );
    this.listeners.push( DeviceEventEmitter.addListener(
      'onPause',
      (event) => this.onPause(event)
    ) );
    this.listeners.push( DeviceEventEmitter.addListener(
      'onClosedCaptionUpdate',
      (event) => this.onClosedCaptionUpdate(event)
    ) );
  },

  componentWillUnmount: function() {
    for( var l of this.listeners ) {
      l.remove;
    }
    this.listeners = [];
  },

  render: function() {
    switch (this.state.screenType) {
      case 'start': return this._renderStartScreen(); break;
      case 'end':   return this._renderEndScreen();   break;
      case 'pause': return this._renderPauseScreen(); break;
      default:      return this._renderVideoView();   break;
    }
  },

  _renderStartScreen: function() {
    var startScreenConfig = {mode:'default', infoPanel:{visible:true}};
    return (
      <StartScreen
        config={startScreenConfig}
        title={this.state.title}
        description={this.state.description}
        promoUrl={this.state.promoUrl}
        onPress={(name) => this.handlePress(name)}/>
    );
  },

  _renderEndScreen: function() {
    var EndScreenConfig = {mode:'default', infoPanel:{visible:true}};
    return (
      <EndScreen
        config={EndScreenConfig}
        title={this.state.title}
        description={this.state.description}
        promoUrl={this.state.promoUrl}
        duration={this.state.duration}
        onPress={(name) => this.handlePress(name)}/>
    );
  },

  _renderPauseScreen: function() {
    var PauseScreenConfig = {mode:'default', infoPanel:{visible:true}};
    return (
      <PauseScreen
        config={PauseScreenConfig}
        title={this.state.title}
        duration={this.state.duration}
        description={this.state.description}
        promoUrl={this.state.promoUrl}
        onPress={(name) => this.handlePress(name)}/>
    );
  },

   _renderVideoView: function() {
     var showPlayButton = this.state.rate > 0 ? false : true;
     return (
       <VideoView
         showPlay={showPlayButton}
         playhead={this.state.playhead}
         duration={this.state.duration}
         width={this.state.width}
         onPress={(value) => this.handlePress(value)}
         onScrub={(value) => this.handleScrub(value)}
         closedCaptionsLanguage={this.state._closedCaptionsLanguage}
         availableClosedCaptionsLanguages={this.state.availableClosedCaptionsLanguages}
         captionJSON={this.state.captionJSON}/>
     );
   }
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);

