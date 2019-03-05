import PropTypes from 'prop-types';
import React from 'react';
import {ActivityIndicator, Animated, TouchableHighlight, View} from 'react-native';

import SkipButton from './SkipButton'
import SwitchButton from './SwitchButton'
import {BUTTON_NAMES, VALUES} from '../constants';

const Log = require('../log');
const Utils = require('../utils');
const AccessibilityUtils = require('../accessibilityUtils');
const timerForSkipButtons = require('react-native-timer');

// Uses the rectbutton styles
const styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));
const PLAY = "play";
const PAUSE = "pause";
const LOADING = "loading";
const FORWARD = "seekForward";
const NEXT = "next";
const PREVIOUS = "previous";
const BACKWARD = "seekBackward";

class CastPlayPauseButtons extends React.Component {
  static propTypes = {
    seekEnabled: PropTypes.bool,
    ffActive: PropTypes.bool,
    icons: PropTypes.object,
    position: PropTypes.string,
    onPress: PropTypes.func,
    onSeekPressed: PropTypes.func,
    onSwitchPressed: PropTypes.func,
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
      animationOpacity: new Animated.Value(1)
    },
    playing: false,
    skipCount: 0
  };

  componentWillMount() {
    this.state.playing = this.props.playing;
    this.state.skipButtons.animationOpacity.setValue(1);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.playing !== this.props.playing) {
      this.state.playing = nextProps.playing;
    }
  };

  componentWillUnmount() {
    timerForSkipButtons.clearTimeout(this);
  }

  onPress = () => {
    if (this.props.showButton) {
      this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  };

  onSkipPress = (isForward) => {
    timerForSkipButtons.clearTimeout(this);
    const value = this.state.skipCount + (isForward ? 1 : -1);
    this.setState({skipCount: value}, () => timerForSkipButtons.setTimeout(
      this,
      'sendSummedSkip',
      () => {
        this.props.onSeekPressed(this.state.skipCount);
        this.setState({skipCount: 0});
      },
      VALUES.DELAY_BETWEEN_SKIPS_MS
    ));
  };

  onSwitchPressed = (isForward) => {
    this.props.onSwitchPressed(isForward);
  };

  _renderPlayPauseButton = () => {
    if (this.props.loading === true) {
      return this._renderLoadingButton();
    } else {
      if (this.props.playing) {
        return this._renderButton(PAUSE);
      }
      if (this.props.playing) {
        return this._renderButton(PAUSE);
      }

      return this._renderButton(PLAY);
    }
  };

  _renderLoadingButton() {
    const sizeStyle = {width: this.props.buttonWidth * 2, height: this.props.buttonHeight * 2};

    return <TouchableHighlight
      accessible={true}
      underlayColor="transparent"
      activeOpacity={this.props.opacity}
      importantForAccessibility={'yes'}
      style={[sizeStyle, {justifyContent: 'center', alignItems: 'center'}]}>
      <ActivityIndicator
        size={60}
        color='white'
        style={[sizeStyle, {
          justifyContent: 'center',
          alignItems: 'center',
        }]}/>
    </TouchableHighlight>;
  }

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

  _renderSeekButton = (name, iconScale, active) => {
    const fontStyle = {fontSize: this.props.fontSize * iconScale, fontFamily: this.props.icons[name].fontFamily};
    const sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    const opacity = {opacity: this.state.skipButtons.animationOpacity};
    const animate = {transform: [{scale: this.state.skipButtons.animationScale}]};

    let color = "gray";
    if (active) {
      color = !!this.props.buttonColor ? this.props.buttonColor : "white";
    }
    const buttonColor = {color: color};

    const isForward = name === FORWARD;
    let seekValue;
    if (name === NEXT || name === PREVIOUS) {
      seekValue = "";
    } else {
      seekValue = isForward ? this.props.seekForwardValue : this.props.seekBackwardValue;
      seekValue = Utils.restrictSeekValueIfNeeded(seekValue);
    }

    return (
      <SkipButton
        isForward={isForward}
        timeValue={seekValue}
        sizeStyle={sizeStyle}
        disabled={!active}
        onSeek={(isForward) => this.onSkipPress(isForward)}
        icon={this.props.icons[name].icon}
        fontStyle={fontStyle}
        opacity={opacity}
        animate={animate}
        buttonColor={buttonColor}
      />
    );
  };


  _renderSwitchButton = (name, iconScale, active) => {
    const fontStyle = {fontSize: this.props.fontSize * iconScale, fontFamily: this.props.icons[name].fontFamily};
    const sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    const opacity = {opacity: this.state.skipButtons.animationOpacity};
    const animate = {transform: [{scale: this.state.skipButtons.animationScale}]};

    let color = "gray";
    if (active) {
      color = !!this.props.buttonColor ? this.props.buttonColor : "white";
    }
    const buttonColor = {color: color};

    const isForward = name === NEXT;

    return (
      <SwitchButton
        isForward={isForward}
        sizeStyle={sizeStyle}
        disabled={!active}
        onSwitch={(isForward) => this.onSwitchPressed(isForward)}
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
    const previousButton = this._renderSwitchButton(PREVIOUS, seekButtonScale, true);
    const nextButton = this._renderSwitchButton(NEXT, seekButtonScale, true);
    const backwardButton = this._renderSeekButton(BACKWARD, seekButtonScale, true);
    const forwardButton = this._renderSeekButton(FORWARD, seekButtonScale, this.props.ffActive);

    const containerStyle = {
      flexDirection: 'row',
      flex: 0,
      justifyContent: 'space-between',
      alignItems: 'center'
    };

    const heightScaleFactor = 2;
    let widthScaleFactor = 2;
    if (!!this.props.showSeekButtons && !!this.props.seekEnabled) {
      // we add 2 per each skip button.
      // If you wanted to add more buttons horizontally, this value would change.
      // TODO: Know which button is enabled only.
      // It should be possible to show only one of the skip buttons that
      // is not implemented yet. When implemented we need to take that into account here.
      widthScaleFactor += 4;
    }

    const topOffset = Math.round((this.props.frameHeight - this.props.buttonHeight * heightScaleFactor) * 0.5);
    const leftOffset = Math.round((this.props.frameWidth - this.props.buttonWidth * widthScaleFactor) * 0.5);

    // positionStyle is for the view that acts as the container of the buttons.
    // We want it to be centered in the player area and it is dynamic because we have different buttons
    const positionStyle = {
      position: 'absolute',
      top: topOffset,
      left: leftOffset
    };

    if (!this.props.showButton) {
      return null;
    } else {
      return (
        <View style={[positionStyle]}>
          <Animated.View style={[containerStyle]}>
            {previousButton}
            {backwardButton}
            {playPauseButton}
            {forwardButton}
            {nextButton}
          </Animated.View>
        </View>
      );
    }
  }
}

module.exports = CastPlayPauseButtons;
