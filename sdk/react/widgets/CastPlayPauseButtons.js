import PropTypes from 'prop-types';
import React from 'react';
import {
  ActivityIndicator, Animated, TouchableHighlight, View,
} from 'react-native';

import SkipButton from './SkipButton';
import SwitchButton from './SwitchButton';
import { BUTTON_NAMES, VALUES } from '../constants';

const timerForSkipButtons = require('react-native-timer');
const Utils = require('../utils');
const AccessibilityUtils = require('../accessibilityUtils');

// Uses the rectbutton styles
const styles = require('../utils')
  .getStyles(require('./style/RectButtonStyles.json'));

const PLAY = 'play';
const PAUSE = 'pause';
const FORWARD = 'seekForward';
const NEXT = 'next';
const PREVIOUS = 'previous';
const BACKWARD = 'seekBackward';

class CastPlayPauseButtons extends React.Component {
  static propTypes = {
    seekEnabled: PropTypes.bool.isRequired,
    ffActive: PropTypes.bool.isRequired,
    icons: PropTypes.object.isRequired,
    position: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    onSeekPressed: PropTypes.func.isRequired,
    onSwitchPressed: PropTypes.func.isRequired,
    seekForwardValue: PropTypes.number.isRequired,
    seekBackwardValue: PropTypes.number.isRequired,
    opacity: PropTypes.number.isRequired,
    frameWidth: PropTypes.number.isRequired,
    frameHeight: PropTypes.number.isRequired,
    buttonWidth: PropTypes.number.isRequired,
    buttonHeight: PropTypes.number.isRequired,
    buttonColor: PropTypes.string.isRequired,
    buttonStyle: PropTypes.object.isRequired,
    fontSize: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
    showButton: PropTypes.bool.isRequired,
    showSeekButtons: PropTypes.bool.isRequired,
    playing: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    initialPlay: PropTypes.bool.isRequired,
  };

  state = {
    playPause: {
      animationScale: new Animated.Value(1),
      animationOpacity: new Animated.Value(1),
    },
    skipButtons: {
      animationScale: new Animated.Value(1),
      animationOpacity: new Animated.Value(1),
    },
    playing: false,
    skipCount: 0,
  };

  componentWillMount() {
    const { playing } = this.props;
    this.state.playing = playing;
    this.state.skipButtons.animationOpacity.setValue(1);
  }

  componentWillReceiveProps(nextProps) {
    const { playing } = this.props;

    if (nextProps.playing !== playing) {
      this.state.playing = nextProps.playing;
    }
  }

  componentWillUnmount() {
    timerForSkipButtons.clearTimeout(this);
  }

  onPress() {
    const { showButton, onPress } = this.props;
    if (showButton) {
      onPress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  }

  onSkipPress(isForward) {
    const { onSeekPressed } = this.props;
    timerForSkipButtons.clearTimeout(this);
    const value = this.state.skipCount + (isForward ? 1 : -1);
    this.setState({ skipCount: value }, () => timerForSkipButtons.setTimeout(
      this,
      'sendSummedSkip',
      () => {
        onSeekPressed(this.state.skipCount);
        this.setState({ skipCount: 0 });
      },
      VALUES.DELAY_BETWEEN_SKIPS_MS,
    ));
  }

  onSwitchPressed(isForward) {
    const { onSwitchPressed } = this.props;

    onSwitchPressed(isForward);
  }

  renderPlayPauseButton() {
    const { loading, playing } = this.props;

    let renderButton = null;
    if (loading === true) {
      renderButton = this.renderLoadingButton();
    } else {
      renderButton = playing ? this.renderButton(PAUSE) : this.renderButton(PLAY);
    }
    return renderButton;
  }

  renderLoadingButton() {
    const { buttonWidth, buttonHeight, opacity } = this.props;
    const accessible = true;
    const sizeStyle = {
      width: buttonWidth * 2,
      height: buttonHeight * 2,
    };

    return (
      <TouchableHighlight
        accessible={accessible}
        underlayColor="transparent"
        activeOpacity={opacity}
        importantForAccessibility="yes"
        style={[sizeStyle, {
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        <ActivityIndicator
          size={60}
          color="white"
          style={[sizeStyle, {
            justifyContent: 'center',
            alignItems: 'center',
          }]}
        />
      </TouchableHighlight>
    );
  }

  renderButton(name) {
    const {
      fontSize, icons, buttonColor, opacity, buttonWidth, buttonHeight,
    } = this.props;
    const { playPause } = this.state;
    const { animationOpacity, animationScale } = playPause;

    const accessible = true;

    const fontStyle = {
      fontSize,
      fontFamily: icons[name].fontFamily,
    };
    const finalOpacity = { opacity: animationOpacity };
    const animate = { transform: [{ scale: animationScale }] };
    const finalButtonColor = { color: !!buttonColor ? buttonColor : 'white' };
    const sizeStyle = {
      width: buttonWidth * 2,
      height: buttonHeight * 2,
    };
    const label = AccessibilityUtils.createAccessibilityForPlayPauseButton(name);

    return (
      <TouchableHighlight
        accessible={accessible}
        accessibilityLabel={label}
        onPress={() => this.onPress()}
        underlayColor="transparent"
        activeOpacity={opacity}
        importantForAccessibility="yes"
        style={[sizeStyle, {
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        <Animated.Text style={[styles.buttonTextStyle, fontStyle, finalButtonColor, animate, finalOpacity]}>
          {icons[name].icon}
        </Animated.Text>
      </TouchableHighlight>
    );
  }

  renderSeekButton(name, iconScale, active) {
    const {
      fontSize, icons, buttonWidth, buttonHeight, seekForwardValue, seekBackwardValue, buttonColor,
    } = this.props;
    const { skipButtons } = this.state;
    const { animationOpacity, animationScale } = skipButtons;
    const fontStyle = {
      fontSize: fontSize * iconScale,
      fontFamily: icons[name].fontFamily,
    };
    const sizeStyle = {
      width: buttonWidth,
      height: buttonHeight,
    };
    const opacity = { opacity: animationOpacity };
    const animate = { transform: [{ scale: animationScale }] };

    let color = 'gray';
    if (active) {
      color = !!buttonColor ? buttonColor : 'white';
    }
    const isForward = name === FORWARD;

    let seekValue;
    if (name === NEXT || name === PREVIOUS) {
      seekValue = '';
    } else {
      seekValue = isForward ? seekForwardValue : seekBackwardValue;
      seekValue = Utils.restrictSeekValueIfNeeded(seekValue);
    }

    return (
      <SkipButton
        isForward={isForward}
        timeValue={seekValue}
        sizeStyle={sizeStyle}
        disabled={!active}
        onSeek={forward => this.onSkipPress(forward)}
        icon={icons[name].icon}
        fontStyle={fontStyle}
        opacity={opacity}
        animate={animate}
        buttonColor={{ color }}
      />
    );
  }

  renderSwitchButton(name, iconScale, active) {
    const {
      fontSize, icons, buttonWidth, buttonHeight, buttonColor,
    } = this.props;
    const { skipButtons } = this.state;
    const fontStyle = {
      fontSize: fontSize * iconScale,
      fontFamily: icons[name].fontFamily,
    };
    const sizeStyle = {
      width: buttonWidth,
      height: buttonHeight,
    };
    const opacity = { opacity: skipButtons.animationOpacity };
    const animate = { transform: [{ scale: skipButtons.animationScale }] };

    let color = 'gray';
    if (active) {
      color = !!buttonColor ? buttonColor : 'white';
    }

    const isForward = name === NEXT;

    return (
      <SwitchButton
        isForward={isForward}
        sizeStyle={sizeStyle}
        disabled={!active}
        onSwitch={forward => this.onSwitchPressed(forward)}
        icon={icons[name].icon}
        fontStyle={fontStyle}
        opacity={opacity}
        animate={animate}
        buttonColor={{ color }}
      />
    );
  }

  // Gets the play button based on the current config settings
  render() {
    const {
      ffActive, showSeekButtons, seekEnabled, frameHeight, buttonHeight, frameWidth, buttonWidth, showButton,
    } = this.props;
    const seekButtonScale = 0.5;
    const playPauseButton = this.renderPlayPauseButton();
    const previousButton = this.renderSwitchButton(PREVIOUS, seekButtonScale, true);
    const nextButton = this.renderSwitchButton(NEXT, seekButtonScale, true);
    const backwardButton = this.renderSeekButton(BACKWARD, seekButtonScale, true);
    const forwardButton = this.renderSeekButton(FORWARD, seekButtonScale, ffActive);

    const containerStyle = {
      flexDirection: 'row',
      flex: 0,
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    const heightScaleFactor = 2;
    let widthScaleFactor = 2;
    if (!!showSeekButtons && !!seekEnabled) {
      // we add 2 per each skip button.
      // If you wanted to add more buttons horizontally, this value would change.
      // TODO: Know which button is enabled only.
      // It should be possible to show only one of the skip buttons that
      // is not implemented yet. When implemented we need to take that into account here.
      widthScaleFactor += 4;
    }

    const topOffset = Math.round((frameHeight - buttonHeight * heightScaleFactor) * 0.5);
    const leftOffset = Math.round((frameWidth - buttonWidth * widthScaleFactor) * 0.5);

    // positionStyle is for the view that acts as the container of the buttons.
    // We want it to be centered in the player area and it is dynamic because we have different buttons
    const positionStyle = {
      position: 'absolute',
      top: topOffset,
      left: leftOffset,
    };

    if (showButton) {
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
    return null;
  }
}

module.exports = CastPlayPauseButtons;
