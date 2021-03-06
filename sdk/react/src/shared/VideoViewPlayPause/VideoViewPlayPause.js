// @flow

import React from 'react';
import { Animated, TouchableHighlight, View } from 'react-native';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import timerForSkipButtons from 'react-native-timer';

import { BUTTON_NAMES, VALUES } from '../../constants';
import * as Accessibility from '../../lib/accessibility';
import * as Utils from '../../lib/utils';
import SkipButton from '../SkipButton';

import styles from './VideoViewPlayPause.styles';

const PLAY = 'play';
const PAUSE = 'pause';
const FORWARD = 'seekForward';
const BACKWARD = 'seekBackward';

type Props = {
  seekEnabled?: boolean,
  ffActive?: boolean,
  icons?: {},
  onPress?: () => void,
  onSeekPressed?: () => void,
  seekForwardValue?: number,
  seekBackwardValue?: number,
  opacity?: number,
  frameWidth?: number,
  frameHeight?: number,
  buttonWidth?: number,
  buttonHeight?: number,
  buttonColor?: string,
  fontSize?: number,
  showButton?: boolean,
  showSeekButtons?: boolean,
  playing?: boolean,
  initialPlay?: boolean,
};

type State = {
  playing: boolean,
  playPause: {
    animationOpacity: AnimatedValue,
    animationScale: AnimatedValue,
  },
  skipButtons: {
    animationOpacity: AnimatedValue,
    animationScale: AnimatedValue,
  },
  skipCount: number,
};

export default class VideoViewPlayPause extends React.Component<Props, State> {
  static defaultProps = {
    seekEnabled: undefined,
    ffActive: undefined,
    icons: undefined,
    onPress: undefined,
    onSeekPressed: undefined,
    seekForwardValue: undefined,
    seekBackwardValue: undefined,
    opacity: undefined,
    frameWidth: undefined,
    frameHeight: undefined,
    buttonWidth: undefined,
    buttonHeight: undefined,
    buttonColor: undefined,
    fontSize: undefined,
    showButton: undefined,
    showSeekButtons: undefined,
    playing: undefined,
    initialPlay: undefined,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      playPause: {
        animationScale: new Animated.Value(1),
        animationOpacity: new Animated.Value(1),
      },
      skipButtons: {
        animationScale: new Animated.Value(1),
        animationOpacity: new Animated.Value(props.initialPlay ? 0 : 1),
      },
      playing: props.playing,
      skipCount: 0,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const { playing } = this.props;

    if (nextProps.playing !== playing) {
      // TODO: Does nothing, fix.
      this.state.playing = nextProps.playing;
    }
  }

  componentWillUnmount() {
    timerForSkipButtons.clearTimeout(this);
  }

  onPress = () => {
    const { onPress, showButton } = this.props;

    if (showButton) {
      onPress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  };

  onSkipPress = (isForward) => {
    const { onSeekPressed } = this.props;
    const { skipCount } = this.state;

    timerForSkipButtons.clearTimeout(this);
    const value = skipCount + (isForward ? 1 : -1);
    this.setState({
      skipCount: value,
    }, () => timerForSkipButtons.setTimeout(
      this,
      'sendSummedSkip',
      () => {
        onSeekPressed(value);
        this.setState({
          skipCount: 0,
        });
      },
      VALUES.DELAY_BETWEEN_SKIPS_MS,
    ));
  };

  renderPlayPauseButton = () => {
    const { playing } = this.state;

    if (playing) {
      return this.renderButton(PAUSE);
    }

    return this.renderButton(PLAY);
  };

  renderButton = (name) => {
    const {
      buttonColor, buttonHeight, buttonWidth, fontSize, icons, opacity,
    } = this.props;
    const { playPause } = this.state;

    const label = Accessibility.createAccessibilityForPlayPauseButton(name);

    return (
      <TouchableHighlight
        accessible
        accessibilityLabel={label}
        onPress={this.onPress}
        underlayColor="transparent"
        activeOpacity={opacity}
        importantForAccessibility="yes"
        style={{
          width: buttonWidth * 2,
          height: buttonHeight * 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.Text
          style={[styles.buttonTextStyle, {
            color: buttonColor || 'white',
            fontSize,
            fontFamily: icons[name].fontFamily,
            opacity: playPause.animationOpacity,
            transform: [{ scale: playPause.animationScale }],
          }]}
        >
          {icons[name].icon}
        </Animated.Text>
      </TouchableHighlight>
    );
  };

  renderSeekButton = (name, iconScale, active) => {
    const {
      buttonColor, buttonHeight, buttonWidth, fontSize, icons, seekBackwardValue, seekEnabled, seekForwardValue,
      showSeekButtons,
    } = this.props;
    const { skipButtons } = this.state;

    if (!showSeekButtons || !seekEnabled) {
      return <View />;
    }

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

    const isForward = name === FORWARD;
    let seekValue = isForward ? seekForwardValue : seekBackwardValue;
    seekValue = Utils.restrictSeekValueIfNeeded(seekValue);

    return (
      <SkipButton
        visible
        isForward={isForward}
        timeValue={seekValue}
        sizeStyle={sizeStyle}
        disabled={!active}
        onSeek={this.onSkipPress}
        icon={icons[name].icon}
        fontStyle={fontStyle}
        opacity={opacity}
        animate={animate}
        buttonColor={{ color }}
      />
    );
  };

  // Gets the play button based on the current config settings
  render() {
    const {
      buttonHeight, buttonWidth, ffActive, frameHeight, frameWidth, seekEnabled, showButton, showSeekButtons,
    } = this.props;

    const seekButtonScale = 0.5;
    const playPauseButton = this.renderPlayPauseButton();
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
      widthScaleFactor += 2;
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
            {backwardButton}
            {playPauseButton}
            {forwardButton}
          </Animated.View>
        </View>
      );
    }

    return null;
  }
}
