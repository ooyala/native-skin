import PropTypes from 'prop-types';
import React from 'react';
import {
  View,
  TouchableHighlight,
  Animated
} from 'react-native';
import SkipButton from './SkipButton'

const Constants = require('../constants');
const Utils = require('../utils');
const AccessibilityUtils = require('../accessibilityUtils');
const {
  BUTTON_NAMES
} = Constants;

// Uses the rectbutton styles
const styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));
const PLAY = "play";
const PAUSE = "pause";
const FORWARD = "seekForward";
const BACKWARD = "seekBackward";

class VideoViewPlayPause extends React.Component {
  static propTypes = {
    icons: PropTypes.object,
    position: PropTypes.string,
    onPress: PropTypes.func,
    onSeekPressed: PropTypes.func,
    seekForwardValue: PropTypes.number,
    seekBackwardValue: PropTypes.number,
    opacity: PropTypes.number,
    frameWidth: PropTypes.number,
    frameHeight: PropTypes.number,
    buttonWidth: PropTypes.number,
    buttonHeight: PropTypes.number,
    buttonColor: PropTypes.string,
    buttonStyle: PropTypes.object,
    fontSize: PropTypes.number,
    style: PropTypes.object,
    showButton: PropTypes.bool,
    showSeekButtons: PropTypes.bool,
    playing: PropTypes.bool,
    loading: PropTypes.bool,
    initialPlay: PropTypes.bool
  };

  state = {
    playPause: {
      animationScale: new Animated.Value(1),
      animationOpacity: new Animated.Value(1)
    },
    skipButtons: {
      animationScale: new Animated.Value(1),
      animationOpacity: new Animated.Value(0)
    },
    playing: false
  };

  componentWillMount() {
    this.state.playing = this.props.playing;
    if (this.props.initialPlay) {
      this.state.skipButtons.animationOpacity.setValue(0);
    } else {
      this.state.skipButtons.animationOpacity.setValue(1);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.playing !== this.props.playing) {
      this.state.playing = nextProps.playing;
    }
  };

  onPress = () => {
    if (this.props.showButton) {
      this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  };

  _renderPlayPauseButton = () => {
    if (this.state.playing) {
      return this._renderButton(PAUSE);
    }
    return this._renderButton(PLAY);
  };

  _renderButton = (name) => {
    const fontStyle = {fontSize: this.props.fontSize, fontFamily: this.props.icons[name].fontFamily};
    const opacity = {opacity: this.state.playPause.animationOpacity};
    const animate = {transform: [{scale: this.state.playPause.animationScale}]};
    const buttonColor = {color: !!this.props.buttonColor ? this.props.buttonColor : "white"};
    const sizeStyle = {width: this.props.buttonWidth * 2, height: this.props.buttonHeight * 2};
    const label = AccessibilityUtils.createAccessibilityForPlayPauseButton(name);

    return (
      <TouchableHighlight
        accessible={true}
        accessibilityLabel={label}
        accessibilityComponentType="button"
        onPress={() => this.onPress()}
        underlayColor="transparent"
        activeOpacity={this.props.opacity}
        importantForAccessibility={'yes'}
        style={[sizeStyle, {justifyContent: 'center', alignItems: 'center'}]}>
        <Animated.Text
          style={[styles.buttonTextStyle, fontStyle, buttonColor, animate, opacity]}>
          {this.props.icons[name].icon}
        </Animated.Text>
      </TouchableHighlight>
    );
  };

  _renderSeekButton = (name, iconScale) => {
    if (!this.props.showSeekButtons) {
      return <View/>
    }
    const fontStyle = {fontSize: this.props.fontSize * iconScale, fontFamily: this.props.icons[name].fontFamily};
    const sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    const opacity = {opacity: this.state.skipButtons.animationOpacity};
    const animate = {transform: [{scale: this.state.skipButtons.animationScale}]};
    const buttonColor = {color: !!this.props.buttonColor ? this.props.buttonColor : "white"};
    const isForward = name === FORWARD;
    let seekValue = isForward ? this.props.seekForwardValue : this.props.seekBackwardValue;
    seekValue = Utils.restrictSeekValueIfNeeded(seekValue);

    return (
      <SkipButton
        isForward={isForward}
        timeValue={seekValue}
        sizeStyle={sizeStyle}
        onSeek={(isForward) => this.props.onSeekPressed(isForward)}
        icon={this.props.icons[name].icon}
        fontStyle={fontStyle}
        opacity={opacity}
        animate={animate}
        buttonColor={buttonColor}
      />
    );
  };

  // Gets the play button based on the current config settings
  render() {
    const seekButtonScale = 0.5;
    const playPauseButton = this._renderPlayPauseButton();
    const backwardButton = this._renderSeekButton(BACKWARD, seekButtonScale);
    const forwardButton = this._renderSeekButton(FORWARD, seekButtonScale);

    const containerStyle = {
      flexDirection: 'row',
      flex: 0,
      justifyContent: 'space-between',
      alignItems: 'center'
    };

    if (!this.props.showButton) {
      return null;
    } else {
      return (
        <View style={[styles.buttonTextContainer]}>
          <Animated.View style={[containerStyle]}>
            {backwardButton}
            {playPauseButton}
            {forwardButton}
          </Animated.View>
        </View>
      );
    }
  }

}

module.exports = VideoViewPlayPause;
