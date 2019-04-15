import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NativeModules, Platform, View } from 'react-native';

import { ACCESSIBILITY_ANNOUNCERS, BUTTON_NAMES, UI_SIZES } from '../../../constants';
import { collapse } from '../../../lib/collapser';
import * as Log from '../../../lib/log';
import responsiveMultiplier from '../../../lib/responsiveMultiplier';
import * as Utils from '../../../lib/utils';
import ControlBarWidget from '../../ControlBarWidgets';

import styles from './ControlBar.styles';

const { AndroidAccessibility } = NativeModules;

export default class ControlBar extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    primaryButton: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    isPipActivated: PropTypes.bool.isRequired,
    isPipButtonVisible: PropTypes.bool,
    playhead: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    volume: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
    handleControlsTouch: PropTypes.func.isRequired,
    live: PropTypes.object,
    config: PropTypes.object.isRequired,
    stereoSupported: PropTypes.bool,
    showMoreOptionsButton: PropTypes.bool,
    showAudioAndCCButton: PropTypes.bool,
    showPlaybackSpeedButton: PropTypes.bool,
    inCastMode: PropTypes.bool,
  };

  static defaultProps = {
    playhead: 0,
    duration: 0,
  };

  state = {
    showVolume: false,
  };

  getPlayHeadTimeString = () => {
    const {
      live, playhead,
    } = this.props;
    if (live) {
      return live.label;
    }
    return (`${Utils.secondsToString(playhead)} - `);
  };

  getDurationString = () => {
    const {
      live, duration, playhead,
    } = this.props;
    if (live) {
      if (live.isLive) {
        return null;
      }
      return (` -${Utils.secondsToString(duration - playhead)}`);
    }
    return Utils.secondsToString(duration);
  };

  getSelectedPlaybackSpeedRate = () => Utils.formattedPlaybackSpeedRate(this.props.config.selectedPlaybackSpeedRate);

  getVolumeControlColor = () => {
    if (this.props.config.general.accentColor) {
      return this.props.config.general.accentColor;
    }
    if (this.props.config.controlBar.volumeControl.color) {
      return this.props.config.controlBar.volumeControl.color;
    }
    Log.error(
      'controlBar.volumeControl.color and general.accentColor are not defined in your skin.json.  Please update your skin.json file to the latest provided file, or add these to your skin.json',
    );
    return '#4389FF';
  };

  onPlayPausePress = () => {
    this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
  };

  onVolumePress = () => {
    this.setState({
      showVolume: !this.state.showVolume,
    });
  };

  onSocialSharePress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.SHARE);
  };

  onDiscoveryPress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.DISCOVERY);
  };

  onFullscreenPress = () => {
    if (Platform.OS === 'android') {
      AndroidAccessibility.announce(ACCESSIBILITY_ANNOUNCERS.SCREEN_MODE_CHANGED);
    }
    this.props.onPress && this.props.onPress(BUTTON_NAMES.FULLSCREEN);
  };

  onPipButtonPress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.PIP);
  };

  onMorePress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.MORE);
  };

  onCastPress = () => {
    if (Platform.OS === 'android') {
      this.props.onPress && this.props.onPress(BUTTON_NAMES.CAST);
    } else {
      this.props.onPress && this.props.onPress(BUTTON_NAMES.CAST_AIRPLAY);
    }
  };

  onRewindPress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.REWIND);
  };

  onStereoscopicPress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.STEREOSCOPIC);
  };

  onAudioAndCCPress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.AUDIO_AND_CC);
  };

  onPlaybackSpeedPress = () => {
    this.props.onPress && this.props.onPress(BUTTON_NAMES.PLAYBACK_SPEED);
  };

  render() {
    const {
      config, live, width, height, showAudioAndCCButton,
    } = this.props;
    const iconFontSize = responsiveMultiplier(width, UI_SIZES.CONTROLBAR_ICONSIZE);
    const labelFontSize = responsiveMultiplier(width, UI_SIZES.CONTROLBAR_LABELSIZE);
    const waterMarkName = Platform.select({
      ios: config.controlBar.logo.imageResource.iosResource,
      android: config.controlBar.logo.imageResource.androidResource,
    });
    let liveCircle;
    if (live) {
      liveCircle = live.isLive ? styles.liveCircleActive : styles.liveCircleNonActive;
    } else {
      liveCircle = null;
    }
    const castEnabled = config.castControls.enabled;
    const color = this.props.inCastMode ? config.castControls.iconStyle.active.color
      : config.castControls.iconStyle.inactive.color;
    const castIcon = this.props.inCastMode ? config.icons['chromecast-connected']
      : config.icons['chromecast-disconnected'];
    const controlBarWidgets = [];


    const widgetOptions = {
      playPause: {
        onPress: this.onPlayPausePress,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        playIcon: config.icons.play,
        pauseIcon: config.icons.pause,
        replayIcon: config.icons.replay,
        primaryActionButton: this.props.primaryButton,
      },
      volume: {
        onPress: this.onVolumePress,
        style: this.state.showVolume ? [styles.icon,
          { fontSize: iconFontSize },
          styles.iconHighlighted,
          config.controlBar.iconStyle.active] : [styles.icon,
          { fontSize: iconFontSize },
          this.props.config.controlBar.iconStyle.active],
        iconOn: config.icons.volume,
        iconOff: config.icons.volumeOff,
        iconTouchableStyle: styles.iconTouchable,
        showVolume: this.state.showVolume,
        volume: this.props.volume,
        scrubberStyle: styles.volumeSlider,
        volumeControlColor: this.getVolumeControlColor(),
      },
      timeDuration: {
        playHeadTimeStyle: [styles.playheadLabel, { fontSize: labelFontSize }],
        durationStyle: [styles.durationLabel, { fontSize: labelFontSize }],
        completeTimeStyle: [styles.completeTimeStyle],
        playHeadTimeString: this.getPlayHeadTimeString(),
        iconTouchableStyle: styles.iconTouchable,
        liveCircle,
        durationString: this.getDurationString(),
      },
      fullscreen: {
        onPress: this.onFullscreenPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        icon: this.props.fullscreen ? config.icons.compress : config.icons.expand,
        fullscreen: this.props.fullscreen, // do we want to do this way ??
      },
      pipButton: {
        onPress: this.onPipButtonPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        icon: this.props.isPipActivated ? config.icons.pipInButton : config.icons.pipOutButton,
        isActive: this.props.isPipActivated,
        enabled: this.props.isPipButtonVisible,
      },
      rewind: {
        onPress: this.onRewindPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        icon: config.icons.rewind,
      },
      moreOptions: {
        onPress: this.onMorePress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        icon: config.icons.ellipsis,
      },
      chromecast: {
        onPress: this.onCastPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active, { color }],
        icon: castIcon,
        enabled: castEnabled,
      },
      discovery: {
        onPress: this.onDiscoveryPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        icon: config.icons.discovery,
      },
      share: {
        onPress: this.onSocialSharePress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        icon: config.icons.share,
      },
      watermark: {
        shouldShow: Utils.shouldShowLandscape(width, height),
        style: styles.waterMarkImage,
        icon: waterMarkName,
        resizeMode: 'contain',
      },
      stereoscopic: {
        onPress: this.onStereoscopicPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        icon: config.icons.stereoscopic,
      },
      audioAndCC: {
        onPress: this.onAudioAndCCPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        icon: config.hasMultiAudioTracks ? config.icons.audioAndCC : config.icons.cc,
        enabled: showAudioAndCCButton,
      },
      playbackSpeed: {
        onPress: this.onPlaybackSpeedPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, { fontSize: labelFontSize }, config.controlBar.iconStyle.active],
        selectedPlaybackSpeedRate: this.getSelectedPlaybackSpeedRate(),
        enabled: this.props.showPlaybackSpeedButton,
      },
    };

    function _isVisible(item) {
      let visible = true;
      switch (item.name) {
        case BUTTON_NAMES.MORE:
          visible = this.props.showMoreOptionsButton;
          break;
        case BUTTON_NAMES.AUDIO_AND_CC:
          visible = this.props.showAudioAndCCButton;
          break;
        case BUTTON_NAMES.PLAYBACK_SPEED:
          visible = this.props.showPlaybackSpeedButton;
          break;
        case BUTTON_NAMES.STEREOSCOPIC:
          visible = this.props.stereoSupported;
          break;
        default:
          visible = Object.keys(widgetOptions)
            .includes(item.name);
      }
      item.isVisible = visible;
    }

    this.props.config.buttons.forEach(_isVisible, this);

    const itemCollapsingResults = collapse(this.props.width, this.props.config.buttons);

    function pushControl(item) {
      controlBarWidgets.push(item);
    }

    for (let i = 0; i < itemCollapsingResults.fit.length; i++) {
      const widget = itemCollapsingResults.fit[i];
      const item = (
        <ControlBarWidget
          key={i}
          widgetType={widget}
          options={widgetOptions}
        />
      );

      if (widget.name === BUTTON_NAMES.STEREOSCOPIC) {
        if (this.props.stereoSupported) {
          pushControl(item);
        }
      } else if (widget.name === BUTTON_NAMES.AUDIO_AND_CC) {
        if (this.props.showAudioAndCCButton) {
          pushControl(item);
        }
      } else {
        pushControl(item);
      }
    }
    const widthStyle = { width: this.props.width };
    return (
      <View style={[styles.controlBarContainer, widthStyle]} onTouchEnd={this.props.handleControlsTouch}>
        {controlBarWidgets}
      </View>
    );
  }
}
