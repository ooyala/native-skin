/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  DeviceEventEmitter,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} = React;

var eventBridge = require('NativeModules').OOReactBridge;

var ICONS = require('./constants').ICONS;

var ControlBar = React.createClass({
  getInitialState() {
    return {playhead:0, duration:0, rate:0};
  },

  update(e) {
    this.setState({playhead:e.playhead, duration:e.duration, rate:e.rate});
  },

  onPlayPausePress: function() { 
    eventBridge.onPress('PlayPause');
  }, 

  onVolumePress: function() {
    eventBridge.onPress('Volume');
  },

  onFullscreenPress: function() {
    eventBridge.onPress('FullScreen');
  },

  onMorePress: function() {
    eventBridge.onPress('More');
  },
  
  componentWillMount: function() {
    var subscription = DeviceEventEmitter.addListener(
      'playerState', 
      (reminder) => this.update(reminder)
    );
  },

  componentWillUnmount: function() {
    subscription.remove;
  },

  secondsToString: function(seconds) {
    var  minus = '';
    if (seconds < 0) {
      minus = "-";
      seconds = -seconds;
    }
    var date = new Date(seconds * 1000);
    var hh = date.getUTCHours();
    var mm = date.getUTCMinutes();
    var ss = date.getSeconds();
    if (ss < 10) {
      ss = "0" + ss;
    }
    if (mm == 0) {
      mm = "00";
    } else if (mm < 10) {
      mm = "0" + mm;
    }
    var t = mm + ":" + ss;
    if (hh > 0) {
      t = hh + ":" + t;
    }
    return minus + t;
  },

  render: function() {
    var playPauseIcon = this.state.rate > 0 ? ICONS.PLAY : ICONS.PAUSE;
    var volumeIcon = ICONS.VOLUMEUP;
    var fullscreenIcon = ICONS.EXPAND;
    var menuIcon = ICONS.ELLIPSIS;
    var durationString = this.secondsToString(this.state.duration);
    var playheadString = this.secondsToString(this.state.playhead);

    return (
      <View style={styles.container}>
          <TouchableHighlight onPress={this.onPlayPausePress}>
            <Text style={styles.icon}>{playPauseIcon}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onVolumePress}>
            <Text style={styles.icon}>{volumeIcon}</Text>
          </TouchableHighlight>
           
          <Text style={styles.label}>{playheadString}/{durationString}</Text>
        
          <TouchableHighlight onPress={this.onFullscreenPress}>
            <Text style={styles.icon}>{fullscreenIcon}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onMorePress}>
            <Text style={styles.icon}>{menuIcon}</Text>
          </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,0,0,0.5)',
  },
  playControls: {
    flexDirection: 'row',
    // justifyContent: 'flex-start'
  },
  screenControls: {
    justifyContent: 'flex-end'
  },
  label: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'AvenirNext-DemiBold',
  },
  icon: {
    fontSize: 20,
    textAlign: 'center',
    color: 'green',
    fontFamily: 'fontawesome',
  },
});

module.exports = ControlBar;
