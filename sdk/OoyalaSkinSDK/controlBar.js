/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  SliderIOS,
  Text,
  TouchableHighlight,
  View
} = React;

var eventBridge = require('NativeModules').OOReactBridge;

var Constants = require('./constants');
var {
  ICONS,
  BUTTON_NAMES
} = Constants;

var ControlBar = React.createClass({
  getInitialState: function() {
    return {
      showVolume: false,
    };
  },

  propTypes: {
    primaryActionButton: React.PropTypes.string,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    onPress: React.PropTypes.func,
    showClosedCaptionsButton: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {playhead: 0, duration: 0};
  },

  onPlayPausePress: function() { 
    this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
  }, 

  onVolumePress: function() {
    this.setState({showVolume:!this.state.showVolume});
  },

  onSocialSharePress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.SOCIAL_SHARE);
  },

  onClosedCaptionsPress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.CLOSED_CAPTIONS);
  },

  onFullscreenPress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.FULLSCREEN);
  },

  onMorePress: function() {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.MORE);
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
    var volumeIcon = this.state.showVolume ? ICONS.VOLUMEUP : ICONS.VOLUMEDOWN;
    var shareIcon = ICONS.SHARE;
    var fullscreenIcon = ICONS.EXPAND;
    var menuIcon = ICONS.ELLIPSIS;
    var closedCaptionsIcon = ICONS.CC;
    var durationString = this.secondsToString(this.props.duration);
    var playheadString = this.secondsToString(this.props.playhead);
    var volumeScrubber;
    if (this.state.showVolume) {
      volumeScrubber = <SliderIOS style={styles.volumeSlider} />;
    }

    var ccButton;
    if( this.props.showClosedCaptionsButton ) {
      ccButton = (<TouchableHighlight onPress={this.onClosedCaptionsPress}>
                    <Text style={styles.icon}>{closedCaptionsIcon}</Text>
                  </TouchableHighlight>);
    }
    
    return (
      <View style={styles.container}>
          <TouchableHighlight onPress={this.onPlayPausePress}>
            <Text style={styles.icon}>{this.props.primaryActionButton}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onVolumePress}>
            <Text style={this.state.showVolume ? [styles.icon, styles.iconHighlighted] : styles.icon}>
              {volumeIcon}
            </Text>
          </TouchableHighlight>
            {volumeScrubber}
          <Text style={styles.label}>{playheadString}/{durationString}</Text>
          <View style={styles.placeholder} />
          <TouchableHighlight onPress={this.onSocialSharePress}>
            <Text style={styles.icon}>{shareIcon}</Text>
          </TouchableHighlight>
          {ccButton}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  icon: {
    fontSize: 20,
    textAlign: 'center',
    color: '#8E8E8E',
    fontFamily: 'fontawesome',
    margin: 10,
    padding: 2,
  },
  label: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    margin: 10,
    padding: 2,
    fontFamily: 'AvenirNext-DemiBold',
  },
  iconHighlighted: {
    color: '#E6E6E6',
  },
  volumeSlider: {
    height: 20,
    width: 100,
    marginLeft: 10,
    alignSelf: 'center',
  },
  placeholder: {
    flex: 1,
  }
});

module.exports = ControlBar;
