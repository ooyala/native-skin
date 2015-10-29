/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  ProgressBarAndroid,
  View,
} = React;

var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var LayoutController = require('NativeModules').OoyalaSkinLayoutController;
var IconTextView = require('./androidNative/iconTextView');
var Constants = require('./constants');
var {
  BUTTON_NAMES,
  SCREEN_TYPES,
  OOSTATES,
} = Constants;
var ProgressBar = require('ProgressBarAndroid');

var OoyalaSkin = React.createClass({
  componentWillMount: function() {
    RCTDeviceEventEmitter.addListener('stateChanged',this.onStateChanged);
  },

  getInitialState: function() {
    return {
      // states from react
      screenType: SCREEN_TYPES.LOADING_SCREEN,
      // states from native
      title: '',
      description: '',
      promoUrl: '',
      hostedAtUrl: '',
      playhead: 0,
      duration: 1,
      rate: 0,
      fullscreen: false,
      lastPressedTime: (new Date).getTime(),
      upNextDismissed: false,
      showPlayButton: true,
      // things which default to null and thus don't have to be stated:
      // selectedLanguage: null,
      // availableClosedCaptionsLanguages: null,
      // captionJSON: null,
      buttonSelected: "None",
      alertTitle: '',
      alertMessage: '',
      error: null,
      playerState: 'None'
    };
  },

  onStateChanged: function(e: Event) {
    this.setState({playerState:e.playerState});
 
  },

  play: function() {
    LayoutController.play();
  },
  _renderLoadingScreen: function() {
     return (
       <View style={styles.loading}>
         <ProgressBar styleAttr="Small"/>
      </View>
    );     
},
  render: function() {
    var iconText = "loading inside else loop";
    var fontFamily = "alice";
    var fontSize = 32;
    switch (this.state.screenType) {
      // case SCREEN_TYPES.START_SCREEN: return this._renderStartScreen(); break;
      // case SCREEN_TYPES.END_SCREEN:   return this._renderEndScreen();   break;
      case SCREEN_TYPES.LOADING_SCREEN: return this._renderLoadingScreen(); break;
      // case SCREEN_TYPES.MOREOPTION_SCREEN:  return this._renderMoreOptionScreen();  break;
      // case SCREEN_TYPES.ERROR_SCREEN: return this._renderErrorScreen(); break;
      default:      return (
      <View style={styles.container}>
          <Text>{this.state.playerState}</Text>
      </View>
      );  break;
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200
  },
  welcome: {
    fontSize: 20,
    fontFamily: 'roboto-regular',
    textAlign: 'center',
    margin: 10,
  }
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
