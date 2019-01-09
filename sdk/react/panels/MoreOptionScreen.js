'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  Animated,
  View,
} from 'react-native';

import {
  BUTTON_NAMES,
} from '../constants';

import Log from '../log';
import CollapsingBarUtils from '../collapsingBarUtils';

const Utils = require('../utils');
const styles = Utils.getStyles(require('./style/moreOptionScreenStyles.json'));

const dismissButtonSize = 20;

class MoreOptionScreen extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    onDismiss: PropTypes.func,
    onOptionButtonPress: PropTypes.func,
    config: PropTypes.object,
    controlBarWidth: PropTypes.number,
    showAudioAndCCButton: PropTypes.bool,
    isAudioOnly: PropTypes.bool,
    selectedPlaybackSpeedRate: PropTypes.string
  };

  state = {
    translateY: new Animated.Value(this.props.height),
    opacity: new Animated.Value(0),
    buttonOpacity: new Animated.Value(1),
    button: '',
  };

  componentDidMount() {
    this.state.translateY.setValue(this.props.height);
    this.state.opacity.setValue(0);
    Animated.parallel([
      Animated.timing(
        this.state.translateY,
        {
          toValue: 0,
          duration: 700,
          delay: 0
        }),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: 500,
          delay: 0
        }),
    ]).start();
  }

  onOptionBtnPressWithPanel = () => {
    this.props.onOptionButtonPress(this.state.button);
  };

  onOptionPress = (buttonName) => {
    if (BUTTON_NAMES.SHARE === buttonName) {
      this.props.onOptionButtonPress(buttonName);
    } else {
      this.setState({button: buttonName});
      Animated.timing(
        this.state.buttonOpacity,
        {
          toValue: 0,
          duration: 200,
          delay: 0
        }
      ).start(this.onOptionBtnPressWithPanel);
    }
  };

  onDismissBtnPress = () => {
    this.props.onDismiss();
  };

  onDismissPress = () => {
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0,
        duration: 500,
        delay: 0
      }
    ).start(this.onDismissBtnPress);
  };

  _renderMoreOptionButtons = (moreOptionButtons) => {
    let itemCollapsingResults;

    if (this.props.isAudioOnly) {
      itemCollapsingResults = CollapsingBarUtils.collapseForAudioOnly(this.props.config.buttons)
    } else {
      itemCollapsingResults = CollapsingBarUtils.collapse(this.props.config.controlBarWidth, this.props.config.buttons);
    }

    const buttons = itemCollapsingResults.overflow;
    const buttonStyle = [styles.icon, this.props.config.moreOptionsScreen.iconStyle.active];

    for (var i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      let buttonIcon = this._renderIcon(button.name);
      let moreOptionButton;

      // If a color style exists, we remove it as it is applied to a view, which doesn't support
      // text color modification. Color key only applies to Text views.
      // Deleting the color key removes unwanted warnings in the app.
      if (buttonStyle[1].color) {
        delete buttonStyle[1].color;
      }

      // Skip unsupported buttons to avoid crashes. But log that they were unexpected.
      if (buttonIcon === undefined || buttonStyle === undefined) {
        Log.warn('Warning: skipping unsupported More Options button ' + button.name);
        continue;
      }

      if (button.name === BUTTON_NAMES.STEREOSCOPIC) {
        if (!this.props.stereoSupported) {
          continue;
        }
      } else if (button.name === BUTTON_NAMES.AUDIO_AND_CC) {
        Log.warn('showAudioAndCCButton:' + this.props.showAudioAndCCButton);
        if (!this.props.сlosedCaptionsEnabled && !this.props.multiAudioEnabled && !this.props.showAudioAndCCButton) {
          continue;
        }
      } else if (button.name === BUTTON_NAMES.CLOSED_CAPTIONS) {
        if (!this.props.сlosedCaptionsEnabled) {
          continue;
        }
      }

      const onOptionPress = function(buttonName, f) {
        return function() {
          f(buttonName);
        };
      } (button.name, this.onOptionPress);

      moreOptionButton = Utils.renderRectButton(button.name,
                                                buttonStyle,
                                                buttonIcon.fontString,
                                                onOptionPress,
                                                this.props.config.moreOptionsScreen.iconSize,
                                                this.props.config.moreOptionsScreen.color,
                                                buttonIcon.fontFamilyName,
                                                i);

      moreOptionButtons.push(moreOptionButton);
    }
  };

  _renderIcon = (buttonName) => {
    let buttonIcon;
    switch(buttonName){
      case BUTTON_NAMES.DISCOVERY:
        buttonIcon = this.props.config.icons.discovery;
        break;
      case BUTTON_NAMES.QUALITY:
        buttonIcon = this.props.config.icons.quality;
        break;
      case BUTTON_NAMES.CLOSED_CAPTIONS:
        buttonIcon = this.props.config.icons.cc;
        break;
      case BUTTON_NAMES.AUDIO_AND_CC:
        buttonIcon = this.props.config.icons.audioAndCC;
        break;
      case BUTTON_NAMES.SHARE:
        buttonIcon = this.props.config.icons.share;
        break;
      case BUTTON_NAMES.SETTING: // TODO: this doesn't exist in the skin.json?
        buttonIcon = this.props.config.icons.setting;
        break;
      case BUTTON_NAMES.STEREOSCOPIC:
        buttonIcon = this.props.config.icons.stereoscopic;
        break;
      case BUTTON_NAMES.FULLSCREEN:
        buttonIcon = this.props.config.icons.expand;
        break;
      case BUTTON_NAMES.PLAYBACK_SPEED:
        const fontStr = this.props.selectedPlaybackSpeedRate;
        buttonIcon = {
          fontString: fontStr,
          fontFamilyName: null
        };
        break;
      default:
        break;
    }
    return buttonIcon;
  };

  render() {
    let moreOptionButtons = [];
    this._renderMoreOptionButtons(moreOptionButtons);
    const dismissButton = Utils.renderRectButton(BUTTON_NAMES.DISMISS,
                                                 styles.iconDismiss,
                                                 this.props.config.icons.dismiss.fontString,
                                                 this.onDismissPress, dismissButtonSize,
                                                 this.props.config.moreOptionsScreen.color,
                                                 this.props.config.icons.dismiss.fontFamilyName);
    const rowAnimationStyle = {transform:[{translateY:this.state.translateY}], opacity: this.state.buttonOpacity};

    const moreOptionRow = (
      <Animated.View
        ref='moreOptionRow'
        style={[styles.rowCenter, rowAnimationStyle]}>
          {moreOptionButtons}
      </Animated.View>
    );

    const dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );
    const animationStyle = {opacity:this.state.opacity};
    const moreOptionScreen = (
      <Animated.View style={[styles.fullscreenContainer, animationStyle, {height: this.props.height, width: this.props.width}]}>
        <Animated.View style={[styles.rowsContainer, animationStyle]}>
          {moreOptionRow}
        </Animated.View>
        {dismissButtonRow}
      </Animated.View>
    );
    return moreOptionScreen;
  }

}

module.exports = MoreOptionScreen;
