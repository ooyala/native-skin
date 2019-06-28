// @flow

import React from 'react';
import { NativeModules, Platform, View } from 'react-native';

import { ACCESSIBILITY_ANNOUNCERS, BUTTON_NAMES, UI_SIZES } from '../../../constants';
import { collapse } from '../../../lib/collapser';
import * as Log from '../../../lib/log';
import responsiveMultiplier from '../../../lib/responsiveMultiplier';
import * as Utils from '../../../lib/utils';
import ControlBarWidget from '../../ControlBarWidgets';
import type { Config } from '../../../types/Config';

import styles from './ControlBar.styles';

const { AndroidAccessibility } = NativeModules;

type Props = {
  isAdPlaying: boolean,
  width: number,
  height: number,
  primaryButton: string,
  fullscreen: boolean,
  isPipActivated: boolean,
  isPipButtonVisible?: boolean,
  playhead: number,
  duration: number,
  volume: number,
  onPress: () => void,
  handleControlsTouch: () => void,
  live?: {},
  config: Config,
  stereoSupported?: boolean,
  showMoreOptionsButton?: boolean,
  showAudioAndCCButton?: boolean,
  showPlaybackSpeedButton?: boolean,
  inCastMode?: boolean,
};

type State = {
  showVolume: boolean,
};

export default class ControlBar extends React.Component<Props, State> {
  static defaultProps = {
    isPipButtonVisible: undefined,
    live: undefined,
    stereoSupported: undefined,
    showMoreOptionsButton: undefined,
    showAudioAndCCButton: undefined,
    showPlaybackSpeedButton: undefined,
    inCastMode: undefined,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      showVolume: false,
    };
  }

  getPlayHeadTimeString = () => {
    const {
      isAdPlaying, live, playhead,
    } = this.props;

    if (live && !isAdPlaying) {
      return live.label;
    }

    return (`${Utils.secondsToString(playhead)} - `);
  };

  getDurationString = () => {
    const {
      isAdPlaying, live, duration, playhead,
    } = this.props;

    if (live && !isAdPlaying) {
      if (live.isLive) {
        return null;
      }

      return (` -${Utils.secondsToString(duration - playhead)}`);
    }

    return Utils.secondsToString(duration);
  };

  getSelectedPlaybackSpeedRate = () => {
    const { config } = this.props;

    return Utils.formattedPlaybackSpeedRate(config.selectedPlaybackSpeedRate);
  };

  getVolumeControlColor = () => {
    const { config } = this.props;

    if (config.general.accentColor) {
      return config.general.accentColor;
    }
    if (config.controlBar.volumeControl.color) {
      return config.controlBar.volumeControl.color;
    }
    Log.error('controlBar.volumeControl.color and general.accentColor are not defined in your skin.json.  Please '
      + 'update your skin.json file to the latest provided file, or add these to your skin.json');

    return '#4389FF';
  };

  onPlayPausePress = () => {
    const { onPress } = this.props;

    if (onPress) {
      onPress(BUTTON_NAMES.PLAY_PAUSE);
    }
  };

  onVolumePress = () => {
    const { showVolume } = this.state;

    this.setState({
      showVolume: !showVolume,
    });
  };

  onSocialSharePress = () => {
    const { onPress } = this.props;

    if (onPress) {
      onPress(BUTTON_NAMES.SHARE);
    }
  };

  onDiscoveryPress = () => {
    const { onPress } = this.props;

    if (onPress) {
      onPress(BUTTON_NAMES.DISCOVERY);
    }
  };

  onFullscreenPress = () => {
    const { onPress } = this.props;

    if (Platform.OS === 'android') {
      AndroidAccessibility.announce(ACCESSIBILITY_ANNOUNCERS.SCREEN_MODE_CHANGED);
    }

    if (onPress) {
      onPress(BUTTON_NAMES.FULLSCREEN);
    }
  };

  onPipButtonPress = () => {
    const { onPress } = this.props;

    if (onPress) {
      onPress(BUTTON_NAMES.PIP);
    }
  };

  onMorePress = () => {
    const { onPress } = this.props;

    if (onPress) {
      onPress(BUTTON_NAMES.MORE);
    }
  };

  onCastPress = () => {
    const { onPress } = this.props;

    if (onPress) {
      if (Platform.OS === 'android') {
        onPress(BUTTON_NAMES.CAST);
      } else {
        onPress(BUTTON_NAMES.CAST_AIRPLAY);
      }
    }
  };

  onRewindPress = () => {
    const { onPress } = this.props;

    if (onPress) {
      onPress(BUTTON_NAMES.REWIND);
    }
  };

  onStereoscopicPress = () => {
    const { onPress } = this.props;

    if (onPress) {
      onPress(BUTTON_NAMES.STEREOSCOPIC);
    }
  };

  onAudioAndCCPress = () => {
    const { onPress } = this.props;

    if (onPress) {
      onPress(BUTTON_NAMES.AUDIO_AND_CC);
    }
  };

  onPlaybackSpeedPress = () => {
    const { onPress } = this.props;

    if (onPress) {
      onPress(BUTTON_NAMES.PLAYBACK_SPEED);
    }
  };

  render() {
    const {
      config, fullscreen, handleControlsTouch, height, inCastMode, isAdPlaying, isPipActivated, isPipButtonVisible,
      live, primaryButton, showAudioAndCCButton, showMoreOptionsButton, showPlaybackSpeedButton, stereoSupported,
      volume, width,
    } = this.props;
    const { showVolume } = this.state;

    const iconFontSize = responsiveMultiplier(width, UI_SIZES.CONTROLBAR_ICONSIZE);
    const labelFontSize = responsiveMultiplier(width, UI_SIZES.CONTROLBAR_LABELSIZE);
    const waterMarkName = Platform.select({
      ios: config.controlBar.logo.imageResource.iosResource,
      android: config.controlBar.logo.imageResource.androidResource,
    });

    let liveCircle;

    if (live && !isAdPlaying) {
      liveCircle = live.isLive ? styles.liveCircleActive : styles.liveCircleNonActive;
    } else {
      liveCircle = null;
    }

    const controlBarWidgets = [];

    const widgetOptions = {
      playPause: {
        onPress: this.onPlayPausePress,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        playIcon: config.icons.play,
        pauseIcon: config.icons.pause,
        replayIcon: config.icons.replay,
        primaryActionButton: primaryButton,
      },
      volume: {
        onPress: this.onVolumePress,
        style: (showVolume ? [
          styles.icon,
          { fontSize: iconFontSize },
          styles.iconHighlighted,
          config.controlBar.iconStyle.active,
        ] : [
          styles.icon,
          { fontSize: iconFontSize },
          config.controlBar.iconStyle.active,
        ]),
        iconOn: config.icons.volume,
        iconOff: config.icons.volumeOff,
        iconTouchableStyle: styles.iconTouchable,
        showVolume,
        volume,
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
        icon: fullscreen ? config.icons.compress : config.icons.expand,
        fullscreen, // do we want to do this way ??
      },
      pipButton: {
        onPress: this.onPipButtonPress,
        iconTouchableStyle: styles.iconTouchable,
        style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active],
        icon: isPipActivated ? config.icons.pipInButton : config.icons.pipOutButton,
        isActive: isPipActivated,
        enabled: isPipButtonVisible,
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
        enabled: showPlaybackSpeedButton,
      },
    };

    // Adding castControls validation because we don't use chromecast in admode
    // When instantiated from BottomOverlay/AdPlaybackScreen castControls object is not available
    if (config.castControls) {
      const castEnabled = config.castControls.enabled;
      const color = inCastMode ? config.castControls.iconStyle.active.color
        : config.castControls.iconStyle.inactive.color;
      const castIcon = config.icons[inCastMode ? 'chromecast-connected' : 'chromecast-disconnected'];

      Object.assign(widgetOptions, {
        chromecast: {
          onPress: this.onCastPress,
          iconTouchableStyle: styles.iconTouchable,
          style: [styles.icon, { fontSize: iconFontSize }, config.controlBar.iconStyle.active, { color }],
          icon: castIcon,
          enabled: castEnabled,
        },
      });
    }

    function isVisible(item) {
      let visible = true;

      switch (item.name) {
        case BUTTON_NAMES.MORE:
          visible = showMoreOptionsButton;
          break;
        case BUTTON_NAMES.AUDIO_AND_CC:
          visible = showAudioAndCCButton;
          break;
        case BUTTON_NAMES.PLAYBACK_SPEED:
          visible = showPlaybackSpeedButton;
          break;
        case BUTTON_NAMES.STEREOSCOPIC:
          visible = stereoSupported;
          break;
        default:
          visible = Object.keys(widgetOptions).includes(item.name);
      }

      item.isVisible = visible; // eslint-disable-line no-param-reassign
    }

    config.buttons.forEach(isVisible, this);

    const itemCollapsingResults = collapse(width, config.buttons);

    function pushControl(item) {
      controlBarWidgets.push(item);
    }

    for (let i = 0; i < itemCollapsingResults.fit.length; i += 1) {
      const widget = itemCollapsingResults.fit[i];
      const item = <ControlBarWidget key={i} options={widgetOptions} widgetType={widget} />;

      if (widget.name === BUTTON_NAMES.STEREOSCOPIC) {
        if (stereoSupported) {
          pushControl(item);
        }
      } else if (widget.name === BUTTON_NAMES.AUDIO_AND_CC) {
        if (showAudioAndCCButton) {
          pushControl(item);
        }
      } else {
        pushControl(item);
      }
    }

    return (
      <View style={[styles.controlBarContainer, { width }]} onTouchEnd={handleControlsTouch}>
        {controlBarWidgets}
      </View>
    );
  }
}
