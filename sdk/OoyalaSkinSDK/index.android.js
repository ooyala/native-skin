/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} = React;

var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var eventBridge = require('NativeModules').OoyalaSkinLayoutController;
var Constants = require('./constants');
var {
  SCREEN_TYPES,
} = Constants;
var IconTextView = require('./androidNative/iconTextView');
var OoyalaSkinCore = require('./ooyalaSkinCore');
var OoyalaSkinCoreInstance;
var OoyalaSkin = React.createClass({
  // note/todo: some of these are more like props, expected to be over-ridden/updated
  // by the native bridge, and others are used purely on the non-native side.
  // consider using a leading underscore, or something?
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
      error: null
    };
  },

  componentWillMount: function() {
    console.log("componentWillMount");
    OoyalaSkinCoreInstance = new OoyalaSkinCore(this, eventBridge);
    OoyalaSkinCoreInstance.mount(RCTDeviceEventEmitter);
  },

  componentDidMount: function() {
    // eventBridge.queryState();
  },

  componentWillUnmount: function() {
    console.log("componentWillUnmount");
    OoyalaSkinCoreInstance.unmount();
  },

  onPress: function() {
    eventBridge.onPress({"name":"Play"});
  },

  renderLoadingScreen: function() {
     return (
       <View style={styles.loading}>
         <ProgressBarAndroid styleAttr="Small"/>
      </View>
    );     
  },

  renderVideoView: function() {
    return (
      <View style={styles.container}>
          <Text>{this.state.playerState}</Text>
      </View>); 
  },

  renderStartScreen: function() {
    var icon = "play";
    var fontSize = 32.0;
    var fontFamily = "fontawesome";
    return (
      <View style={styles.container}>
      <Text>{this.state.title}</Text>
      <TouchableHighlight  
          onPress={() => this.onPress()}
          underlayColor="transparent">
          <IconTextView 
            fontFamily={fontFamily}
            fontSize={fontSize}>
            {icon}
          </IconTextView>
        </TouchableHighlight>
      </View>);
  },

  render: function() {
    var iconText = "loading inside else loop";
    var fontFamily = "alice";
    var fontSize = 32;
    switch (this.state.screenType) {
      case SCREEN_TYPES.START_SCREEN: 
          return OoyalaSkinCoreInstance.renderStartScreen(); 
        //this.renderStartScreen(); 
        break;
      // case SCREEN_TYPES.END_SCREEN:   return this._renderEndScreen();   break;
      case SCREEN_TYPES.LOADING_SCREEN: 
        return this.renderLoadingScreen(); 
        break;
      // case SCREEN_TYPES.MOREOPTION_SCREEN:  return this._renderMoreOptionScreen();  break;
      // case SCREEN_TYPES.ERROR_SCREEN: return this._renderErrorScreen(); break;
      default: 
        return this.renderVideoView();     
         break;
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
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
