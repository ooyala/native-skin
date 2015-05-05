/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
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
  }

  onFullscreenPress: function() {
    eventBridge.onPress('FullScreen');
  }

  onMorePress: function() {
    eventBridge.onPress('More');
  }
  
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
    if (h > 0) {
      t = h + ":" + t;
    }
    return minus + t;
  }

  render: function(): ReactElement {
    var playPauseIcon = this.state.rate > 0 ? ICONS.PLAY : ICONS:PAUSE;
    var volumeIcon = ICONS.VOLUMNDOWN;
    var fullscreenIcon = ICONS.EXPAND;
    var menuIcon = ICONS.ELLIPSIS;
    var durationString = this.secondsToString(this.state.duration);
    var playheadString = this.secondsToString(this.state.playhead);

    return (
      <View style={styles.container}>
        <View style={styles.playControls}>
          <TouchableHighlight onPress={this.onPlayPausePress}>
            <Text>{playPauseIcon}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onVolumePress}>
            <Text>{volumeIcon}</Text>
          </TouchableHighlight>
          <Text>{playheadString}/{durationString}</Text>
        </View>
        
        <View stype={styles.screenControls}>
          <TouchableHighlight onPress={this.onFullscreenPress}>
            <Text>{fullscreenIcon}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onMorePress}>
            <Text>{menuIcon}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'center',
  },
  playControls: {
    justifyContent: 'flex-start'
  },
  screenControls: {
    justifyContent: 'flext-end'
  }
});

module.exports = ControlBar;
