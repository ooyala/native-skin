import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, View } from 'react-native';

import { BUTTON_NAMES } from '../../constants';
import { collapse, collapseForAudioOnly } from '../../lib/collapser';
import * as Log from '../../lib/log';
import RectangularButton from '../../shared/RectangularButton';

import styles from './MoreOptionScreen.styles';

const dismissButtonSize = 20;

export default class MoreOptionScreen extends Component {
  static propTypes = {
    height: PropTypes.number,
    onDismiss: PropTypes.func,
    onOptionButtonPress: PropTypes.func,
    config: PropTypes.object,
    controlBarWidth: PropTypes.number,
    showAudioAndCCButton: PropTypes.bool,
    isAudioOnly: PropTypes.bool,
    selectedPlaybackSpeedRate: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      translateY: new Animated.Value(props.height),
      opacity: new Animated.Value(0),
      buttonOpacity: new Animated.Value(1),
      button: '',
    };
  }

  componentDidMount() {
    const { opacity, translateY } = this.state;

    Animated.parallel([
      Animated.timing(
        translateY,
        {
          toValue: 0,
          duration: 700,
          delay: 0,
        },
      ),
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 500,
          delay: 0,
        },
      ),
    ])
      .start();
  }

  onOptionBtnPressWithPanel = () => {
    const { onOptionButtonPress } = this.props;
    const { button } = this.state;

    onOptionButtonPress(button);
  };

  onOptionPress = (buttonName) => {
    const { onOptionButtonPress } = this.props;
    const { buttonOpacity } = this.state;

    if (BUTTON_NAMES.SHARE === buttonName) {
      onOptionButtonPress(buttonName);
    } else {
      this.setState({
        button: buttonName,
      });
      Animated.timing(
        buttonOpacity,
        {
          toValue: 0,
          duration: 200,
          delay: 0,
        },
      )
        .start(this.onOptionBtnPressWithPanel);
    }
  };

  onDismissBtnPress = () => {
    const { onDismiss } = this.props;

    onDismiss();
  };

  onDismissPress = () => {
    const { opacity } = this.state;

    Animated.timing(
      opacity,
      {
        toValue: 0,
        duration: 500,
        delay: 0,
      },
    )
      .start(this.onDismissBtnPress);
  };

  renderMoreOptionButtons = (moreOptionButtons) => {
    const {
      closedCaptionsEnabled, config, isAudioOnly, multiAudioEnabled, showAudioAndCCButton, stereoSupported,
    } = this.props;

    let itemCollapsingResults;

    if (isAudioOnly) {
      itemCollapsingResults = collapseForAudioOnly(config.buttons);
    } else {
      itemCollapsingResults = collapse(config.controlBarWidth, config.buttons);
    }

    const buttons = itemCollapsingResults.overflow;
    const buttonStyle = [styles.icon, config.moreOptionsScreen.iconStyle.active];

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const buttonIcon = this.renderIcon(button.name);

      // If a color style exists, we remove it as it is applied to a view, which doesn't support
      // text color modification. Color key only applies to Text views.
      // Deleting the color key removes unwanted warnings in the app.
      if (buttonStyle[1].color) {
        delete buttonStyle[1].color;
      }

      // Skip unsupported buttons to avoid crashes. But log that they were unexpected.
      if (buttonIcon === undefined || buttonStyle === undefined) {
        Log.warn(`Warning: skipping unsupported More Options button ${button.name}`);
        continue;
      }

      if (button.name === BUTTON_NAMES.STEREOSCOPIC) {
        if (!stereoSupported) {
          continue;
        }
      } else if (button.name === BUTTON_NAMES.AUDIO_AND_CC) {
        Log.warn(`showAudioAndCCButton:${showAudioAndCCButton}`);
        if (!closedCaptionsEnabled && !multiAudioEnabled && !showAudioAndCCButton) {
          continue;
        }
      } else if (button.name === BUTTON_NAMES.CLOSED_CAPTIONS) {
        if (!closedCaptionsEnabled) {
          continue;
        }
      }

      const onOptionPress = (function (buttonName, f) {
        return function () {
          f(buttonName);
        };
      }(button.name, this.onOptionPress));

      moreOptionButtons.push(
        <RectangularButton
          name={button.name}
          style={buttonStyle}
          icon={buttonIcon.fontString}
          onPress={onOptionPress}
          fontSize={config.moreOptionsScreen.iconSize}
          buttonColor={config.moreOptionsScreen.color}
          fontFamily={buttonIcon.fontFamilyName}
          key={i}
        />,
      );
    }
  };

  renderIcon = (buttonName) => {
    const { config, selectedPlaybackSpeedRate } = this.props;

    let buttonIcon;
    switch (buttonName) {
      case BUTTON_NAMES.DISCOVERY:
        buttonIcon = config.icons.discovery;
        break;
      case BUTTON_NAMES.QUALITY:
        buttonIcon = config.icons.quality;
        break;
      case BUTTON_NAMES.CLOSED_CAPTIONS:
        buttonIcon = config.icons.cc;
        break;
      case BUTTON_NAMES.AUDIO_AND_CC:
        buttonIcon = config.icons.audioAndCC;
        break;
      case BUTTON_NAMES.SHARE:
        buttonIcon = config.icons.share;
        break;
      case BUTTON_NAMES.SETTING: // TODO: this doesn't exist in the skin.json?
        buttonIcon = config.icons.setting;
        break;
      case BUTTON_NAMES.STEREOSCOPIC:
        buttonIcon = config.icons.stereoscopic;
        break;
      case BUTTON_NAMES.FULLSCREEN:
        buttonIcon = config.icons.expand;
        break;
      case BUTTON_NAMES.PLAYBACK_SPEED:
        buttonIcon = {
          fontString: selectedPlaybackSpeedRate,
          fontFamilyName: null,
        };
        break;
      default:
        break;
    }
    return buttonIcon;
  };

  render() {
    const { config, height, width } = this.props;
    const { buttonOpacity, opacity, translateY } = this.state;

    const moreOptionButtons = [];
    this.renderMoreOptionButtons(moreOptionButtons);
    const rowAnimationStyle = {
      transform: [{ translateY }],
      opacity: buttonOpacity,
    };

    const moreOptionRow = (
      <Animated.View
        ref="moreOptionRow"
        style={[styles.rowCenter, rowAnimationStyle]}
      >
        {moreOptionButtons}
      </Animated.View>
    );

    const dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        <RectangularButton
          name={BUTTON_NAMES.DISMISS}
          style={styles.iconDismiss}
          icon={config.icons.dismiss.fontString}
          onPress={this.onDismissPress}
          fontSize={dismissButtonSize}
          buttonColor={config.moreOptionsScreen.color}
          fontFamily={config.icons.dismiss.fontFamilyName}
        />
      </View>
    );

    return (
      <Animated.View style={[styles.fullscreenContainer, { height, opacity, width }]}>
        <Animated.View style={[styles.rowsContainer, { opacity }]}>
          {moreOptionRow}
        </Animated.View>
        {dismissButtonRow}
      </Animated.View>
    );
  }
}
