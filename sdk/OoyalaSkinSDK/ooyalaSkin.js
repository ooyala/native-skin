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
var OOSocialShare = require('NativeModules').OOReactSocialShare;
var StartScreen = require('./StartScreen');
var EndScreen = require('./EndScreen');
var PauseScreen = require('./PauseScreen');
var DiscoveryPanel = require('./discoveryPanel');

var Constants = require('./constants');
var {
  ICONS,
  BUTTON_NAMES,
  SCREEN_TYPES,
  OOSTATES,
} = Constants;
var VideoView = require('./videoView');

// Add customizations
var config = require('./skin-config/skin.json');

var OoyalaSkin = React.createClass({

  // note/todo: some of these are more like props, expected to be over-ridden/updated
  // by the native bridge, and others are used purely on the non-native side.
  // consider using a leading underscore, or something?
  getInitialState() {
    return {
      screenType: SCREEN_TYPES.LOADING_SCREEN,
      title: '',
      description: '',
      promoUrl: '', 
      playhead: 0,
      duration: 1,
      rate: 0,
      fullscreen: false,
      // things which default to null and thus don't have to be stated:
      // rct_closedCaptionsLanguage: null,
      // availableClosedCaptionsLanguages: null,
      // captionJSON: null,
    };
  },


  onSocialButtonPress: function(socialType) {
    OOSocialShare.onSocialButtonPress({
        'socialType': socialType,
        'text':this.state.title,
        'link':'https://www.ooyala.com',
      },
      (results) => {
        console.log(results);
      }
    );
  },

  cchack: function(n) {
    // todo: remove this testing hack and do it right...
    if( n === BUTTON_NAMES.CLOSED_CAPTIONS ) {
      if( this.state.availableClosedCaptionsLanguages ) {
        var ccl = (this.state.rct_closedCaptionsLanguage ? null : this.state.availableClosedCaptionsLanguages[0]);
        this.setState({rct_closedCaptionsLanguage: ccl});
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

  updateClosedCaptions: function() {
    eventBridge.onClosedCaptionUpdateRequested( {language:this.state.rct_closedCaptionsLanguage} );
  },

  onClosedCaptionUpdate: function(e) {
    this.setState( {captionJSON: e} );
  },

  onDiscoveryRow: function(info) {
    eventBridge.onDiscoveryRow(info);
  },

  onTimeChange: function(e) { // todo: naming consistency? playheadUpdate vs. onTimeChange vs. ...
    console.log( "onTimeChange: " + e.rate + ", " + (e.rate>0) );
    if (e.rate > 0) {
      this.setState({screenType: SCREEN_TYPES.VIDEO_SCREEN});
    }
    this.setState({
      playhead: e.playhead,
      duration: e.duration,
      rate: e.rate,
      availableClosedCaptionsLanguages: e.availableClosedCaptionsLanguages,
    });
    this.updateClosedCaptions();
  },

  onAdStarted: function(e) {
    console.log( "onAdStarted");
    this.setState({ad:e});
  },

  onAdCompleted: function(e) {
    console.log( "onAdCompleted ");
    this.setState({ad: null});
  },

  onCurrentItemChange: function(e) {
    console.log("currentItemChangeReceived, promoUrl is " + e.promoUrl);
    this.setState({screenType:SCREEN_TYPES.START_SCREEN, title:e.title, description:e.description, duration:e.duration, promoUrl:e.promoUrl, width:e.width, height:e.height, 
      showWatermark: this.shouldShowLandscape()});
  },

  onFrameChange: function(e) {
    console.log("receive frameChange, frame width is" + e.width + " height is" + e.height);
    this.setState({width:e.width, height:e.height, fullscreen:e.fullscreen});
  },

  onPlayComplete: function(e) {
    this.setState({screenType: SCREEN_TYPES.END_SCREEN});
  },

  onStateChange: function(e) {
    if(e.state == OOSTATES.PAUSED) {
      // this.setState({screenType:SCREEN_TYPES.PAUSE_SCREEN});
    }
  },

  onDiscoveryResult: function(e) {
    console.log("onDiscoveryResult results are:", e.results);
    this.setState({discovery:e.results});
  },

  shouldShowLandscape: function() {
    return this.state.width > this.state.height;
  },

  componentWillMount: function() {
    console.log("componentWillMount");
    this.listeners = [];
    var listenerDefinitions = [
      [ 'timeChanged',              (event) => this.onTimeChange(event) ],
      [ 'currentItemChanged',       (event) => this.onCurrentItemChange(event) ],
      [ 'frameChanged',             (event) => this.onFrameChange(event) ],
      [ 'playCompleted',            (event) => this.onPlayComplete(event) ],
      [ 'stateChanged',             (event) => this.onStateChange(event) ],
      [ 'discoveryResultsReceived', (event) => this.onDiscoveryResult(event) ],
      [ 'onClosedCaptionUpdate',    (event) => this.onClosedCaptionUpdate(event) ],
      [ 'adStarted',                (event) => this.onAdStarted(event) ],
      [ 'adCompleted',              (event) => this.onAdCompleted(event) ],
    ];
    for( var d of listenerDefinitions ) {
      this.listeners.push( DeviceEventEmitter.addListener( d[0], d[1] ) );
    }
  },

  componentWillUnmount: function() {
    for( var l of this.listeners ) {
      l.remove;
    }
    this.listeners = [];
  },

  render: function() {

    switch (this.state.screenType) {
      case SCREEN_TYPES.START_SCREEN: return this._renderStartScreen(); break;
      case SCREEN_TYPES.END_SCREEN:   return this._renderEndScreen();   break;
      case SCREEN_TYPES.LOADING_SCREEN: return this._renderLoadingScreen(); break;
      // case SCREEN_TYPES.PAUSE_SCREEN: return this._renderPauseScreen(); break;
      default:      return this._renderVideoView();   break;
    }
  },

  _renderStartScreen: function() {
    var startScreenConfig = config.startScreen;
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
        onPress={(name) => this.handlePress(name)}
        onSocialButtonPress={(socialType) => this.onSocialButtonPress(socialType)}/>
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
         rate={this.state.rate}
         showPlay={showPlayButton}
         playhead={this.state.playhead}
         duration={this.state.duration}
         discovery={this.state.discovery}
         ad ={this.state.ad}
         width={this.state.width}
         height={this.state.height}
         showWatermark={this.shouldShowLandscape()}
         fullscreen={this.state.fullscreen}
         onPress={(value) => this.handlePress(value)}
         onScrub={(value) => this.handleScrub(value)}
         closedCaptionsLanguage={this.state.rct_closedCaptionsLanguage}
             // todo: change to boolean showCCButton.
         availableClosedCaptionsLanguages={this.state.availableClosedCaptionsLanguages}
         captionJSON={this.state.captionJSON}

         onDiscoveryRow={(info) => this.onDiscoveryRow(info)}
         onSocialButtonPress={(socialType) => this.onSocialButtonPress(socialType)} >
  
       </VideoView>

     );
   },

   _renderLoadingScreen: function() {
    return (
      <ActivityIndicatorIOS
        animating={true}
        style={styles.loading}
        size="large">
      </ActivityIndicatorIOS>)
   }
});

var styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200
  },
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
