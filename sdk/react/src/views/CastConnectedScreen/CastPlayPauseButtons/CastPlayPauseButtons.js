// @flow

import PropTypes from 'prop-types';
import React from 'react';
import {
  ActivityIndicator, Animated, TouchableHighlight, View,
} from 'react-native';
import timerForSkipButtons from 'react-native-timer';

import { BUTTON_NAMES, VALUES } from '../../../constants';
import * as Accessibility from '../../../lib/accessibility';
import * as Utils from '../../../lib/utils';
import SkipButton from '../../../shared/SkipButton';
import SwitchButton from './SwitchButton';

import styles from './CastPlayPauseButtons.styles';

const PLAY = 'play';
const PAUSE = 'pause';
const FORWARD = 'seekForward';
const NEXT = 'next';
const PREVIOUS = 'previous';
const BACKWARD = 'seekBackward';

export default class CastPlayPauseButtons extends React.Component {
  static propTypes = {
    icons: PropTypes.shape({}).isRequired,
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
    fontSize: PropTypes.number.isRequired,
    showButton: PropTypes.bool.isRequired,
    playing: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    config: PropTypes.shape({}).isRequired,
    hasNextVideo: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      playPause: {
        animationScale: new Animated.Value(1),
        animationOpacity: new Animated.Value(1),
      },
      skipButtons: {
        animationScale: new Animated.Value(1),
        animationOpacity: new Animated.Value(1),
      },
      skipCount: 0,
    };
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

  /**
   * This method allows to seek video back or forward.
   * To avoid several separate skipping for each tap, we added timer
   * with calculating count of taps on button during VALUES.DELAY_BETWEEN_SKIPS_MS.
   * This method sum up all touches during this time and pass one command for
   * skipping with count of total touches.
   * @param isForward direction of seeking
   */
  onSkipPress(isForward) {
    const { skipCount } = this.state;

    const { onSeekPressed } = this.props;
    timerForSkipButtons.clearTimeout(this);
    const value = skipCount + (isForward ? 1 : -1);
    this.setState({ skipCount: value }, () => timerForSkipButtons.setTimeout(
      this,
      'sendSummedSkip',
      () => {
        onSeekPressed(value);
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

    if (loading === true) {
      return this.renderLoadingButton();
    }

    return playing ? this.renderButton(PAUSE) : this.renderButton(PLAY);
  }

  renderLoadingButton() {
    const { buttonWidth, buttonHeight, opacity } = this.props;
    const sizeStyle = {
      width: buttonWidth * 2,
      height: buttonHeight * 2,
    };

    return (
      <TouchableHighlight
        accessible
        underlayColor="transparent"
        activeOpacity={opacity}
        importantForAccessibility="yes"
        style={[sizeStyle, {
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        <ActivityIndicator
          size="small"
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

    const fontStyle = {
      fontSize,
      fontFamily: icons[name].fontFamily,
    };
    const finalOpacity = { opacity: animationOpacity };
    const animate = { transform: [{ scale: animationScale }] };
    const finalButtonColor = { color: buttonColor || 'white' };
    const sizeStyle = {
      width: buttonWidth * 2,
      height: buttonHeight * 2,
    };
    const label = Accessibility.createAccessibilityForPlayPauseButton(name);

    return (
      <TouchableHighlight
        accessible
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
      color = buttonColor || 'white';
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
        visible={active}
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
      color = buttonColor || 'white';
    }

    const isForward = name === NEXT;

    return (
      <SwitchButton
        visible={active}
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
      frameHeight, buttonHeight, frameWidth, buttonWidth, showButton, config, hasNextVideo,
    } = this.props;
    const {
      previousVideo, nextVideo, skipBackward, skipForward,
    } = config.castControls.buttons;
    const seekButtonScale = 0.5;
    const playPauseButton = this.renderPlayPauseButton();
    const previousButton = this.renderSwitchButton(PREVIOUS, seekButtonScale, previousVideo.enabled);
    const nextButton = this.renderSwitchButton(NEXT, seekButtonScale, nextVideo.enabled && hasNextVideo);
    const backwardButton = this.renderSeekButton(BACKWARD, seekButtonScale, skipBackward.enabled);
    const forwardButton = this.renderSeekButton(FORWARD, seekButtonScale, skipForward.enabled);

    const containerStyle = {
      flexDirection: 'row',
      flex: 0,
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    const heightScaleFactor = 2;
    let widthScaleFactor = 2;
    if (previousVideo.enabled) {
      widthScaleFactor += 1;
    }
    if (nextVideo.enabled) {
      widthScaleFactor += 1;
    }
    if (skipBackward.enabled) {
      widthScaleFactor += 1;
    }
    if (skipForward.enabled) {
      widthScaleFactor += 1;
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
