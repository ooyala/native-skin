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
  View,
} = React;

var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var LayoutController = require('NativeModules').OoyalaSkinLayoutController;

var OoyalaSkin = React.createClass({
  componentWillMount: function() {
    RCTDeviceEventEmitter.addListener('stateChanged',this.onStateChanged);
  },

  getInitialState: function() {
    return {
      playerState: 'None'
    };
  },

  onStateChanged: function(e: Event) {
    this.setState({playerState:e.playerState});
  },

  play: function() {
    LayoutController.play();
  },

  render: function() {
    var text = "State :" + this.state.playerState + " Touch to play";
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={this.play}>
        <Text style={styles.welcome}>
          {text}
        </Text>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 20,
    fontFamily: 'roboto-regular',
    textAlign: 'center',
    margin: 10,
  }
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
