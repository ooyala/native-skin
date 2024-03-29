// @flow

import React from 'react';
import {
  Animated, Image, Text, TouchableOpacity, View,
} from 'react-native';

import CastPlayPauseButtons from './CastPlayPauseButtons';
import { BUTTON_NAMES, UI_SIZES, VALUES } from '../../constants';
import responsiveMultiplier from '../../lib/responsiveMultiplier';
import * as Utils from '../../lib/utils';
import BottomOverlay from '../../shared/BottomOverlay';
import type { Config } from '../../types/Config';
import type { Marker } from '../../types/Markers';

import styles from './CastConnectedScreen.styles';

type Props = {
  playhead: number,
  duration: number,
  live: boolean,
  width: number,
  height: number,
  volume: number,
  fullscreen: boolean,
  cuePoints: Array<number>,
  stereoSupported: boolean,
  multiAudioEnabled: boolean,
  playbackSpeedEnabled: boolean,
  selectedPlaybackSpeedRate: string,
  handlers: {
    onSwitch: () => void,
    onPress: () => void,
    onScrub: () => void,
    handleVideoTouchStart: () => void,
    handleVideoTouchMove: () => void,
    handleVideoTouchEnd: () => void,
    handleControlsTouch: () => void,
    handleShowControls: () => void,
    onControlsVisibilityChanged: () => void,
  },
  screenReaderEnabled: boolean,
  availableClosedCaptionsLanguages: Array<{}>,
  config: Config,
  localizableStrings: {},
  locale: string,
  playing: boolean,
  loading: boolean,
  onDisconnect: () => void,
  deviceName: string,
  inCastMode: boolean,
  previewUrl: string,
  markers: Array<Marker>,
  hasNextVideo: boolean,
};

export default class CastConnectedScreen extends React.Component<Props> {
  static renderBorder() {
    return <View style={styles.border} />;
  }

  componentDidMount() {
    const { handlers } = this.props;

    handlers.onControlsVisibilityChanged(true);
  }

  onSeekPressed(skipCountValue) {
    if (skipCountValue === 0) {
      return;
    }

    const { config, playhead, duration } = this.props;
    const { skipForwardTime, skipBackwardTime } = config.castControls;

    let configSeekValue = (skipCountValue > 0) ? skipForwardTime : skipBackwardTime;

    configSeekValue = Utils.restrictSeekValueIfNeeded(configSeekValue);
    const seekValue = configSeekValue * skipCountValue;
    let resultedPlayhead = playhead + seekValue;
    if (resultedPlayhead < 0) {
      resultedPlayhead = 0;
    } else if (resultedPlayhead > duration) {
      resultedPlayhead = duration;
    }
    const resultedPlayheadPercent = duration === 0 ? 0 : resultedPlayhead / duration;

    this.handleScrub(resultedPlayheadPercent);
  }

  onSwitchPressed(isForwardSwitch) {
    const { handlers } = this.props;

    handlers.onSwitch(isForwardSwitch);
  }

  handlePress = (name) => {
    const { handlers } = this.props;
    const { onPress, handleShowControls } = handlers;
    handleShowControls();
    onPress(name);
  };

  handleScrub(value) {
    const { handlers } = this.props;

    handlers.onScrub(value);
  }

  placeholderTapHandler(event) {
    const { handlers, screenReaderEnabled } = this.props;
    const { handleVideoTouchEnd } = handlers;

    if (screenReaderEnabled) {
      this.handlePress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      handleVideoTouchEnd(event);
    }
  }

  generateLiveObject() {
    const {
      live, playhead, duration, locale, localizableStrings,
    } = this.props;
    if (live) {
      const isLive = playhead >= duration * VALUES.LIVE_THRESHOLD;

      return ({
        label: isLive ? Utils.localizedString(locale, 'LIVE', localizableStrings)
          : Utils.localizedString(locale, 'GO LIVE', localizableStrings),
        onGoLive: isLive ? null : this.onGoLive,
      });
    }

    return null;
  }

  renderCastIcon() {
    const { config } = this.props;
    const { fontString, fontFamilyName } = config.icons.play;

    return (
      <Animated.Text
        accessible={false}
        style={[styles.castIcon, {
          icon: fontString,
          fontFamily: fontFamilyName,
        }]}
      >
        {'}'}
      </Animated.Text>
    );
  }

  renderTopPanel() {
    return (
      <View style={styles.topPanel}>
        {this.renderCastIcon()}
        {this.renderDeviceNameLines()}
        {this.renderDisconnectButton()}
      </View>
    );
  }

  renderDisconnectButton() {
    const { onDisconnect, config } = this.props;
    const { color } = config.castControls.iconStyle.active;

    return (
      <View style={styles.disconnectView}>
        <TouchableOpacity onPress={() => onDisconnect()}>
          <Text style={[styles.disconnectText, { backgroundColor: color }]} numberOfLines={1}>
            {'Disconnect'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderDeviceNameLines() {
    const { deviceName } = this.props;

    return (
      <View style={[styles.deviceNamesView]}>
        <Text style={[styles.connectedToText]}>
          {'Connected to'}
        </Text>
        <Text style={[styles.deviceNameText]}>
          {deviceName}
        </Text>
      </View>
    );
  }

  renderPlaceholder() {
    const { handlers, previewUrl } = this.props;
    const { handleVideoTouchStart, handleVideoTouchMove } = handlers;

    return (
      <View
        reactTag={1}
        accessibilityLabel="Video player. Tap twice to play or pause"
        style={styles.placeholder}
        importantForAccessibility="no"
        onTouchStart={event => handleVideoTouchStart(event)}
        onTouchMove={event => handleVideoTouchMove(event)}
        onTouchEnd={event => this.placeholderTapHandler(event)}
      >
        <Image
          style={styles.imagePreview}
          blurRadius={5}
          source={{ uri: previewUrl }}
        />
      </View>
    );
  }

  renderBottomOverlay() {
    const {
      width, height, playing, fullscreen, cuePoints, playhead, duration, volume, availableClosedCaptionsLanguages,
      handlers, multiAudioEnabled, playbackSpeedEnabled, screenReaderEnabled, stereoSupported, config,
      selectedPlaybackSpeedRate, inCastMode, markers,
    } = this.props;
    const { handleControlsTouch } = handlers;

    const {
      controlBar, castControls, buttons, icons, live, general,
    } = config;


    const ccEnabled = availableClosedCaptionsLanguages && availableClosedCaptionsLanguages.length > 0;

    return (
      <BottomOverlay
        width={width}
        height={height}
        primaryButton={playing ? 'pause' : 'play'}
        fullscreen={fullscreen}
        cuePoints={cuePoints}
        playhead={playhead}
        duration={duration}
        volume={volume}
        live={this.generateLiveObject()}
        onPress={this.handlePress}
        onScrub={value => this.handleScrub(value)}
        handleControlsTouch={() => handleControlsTouch()}
        showAudioAndCCButton={multiAudioEnabled || ccEnabled}
        showPlaybackSpeedButton={playbackSpeedEnabled}
        isShow
        screenReaderEnabled={screenReaderEnabled}
        stereoSupported={stereoSupported}
        config={{
          controlBar,
          castControls,
          buttons,
          icons,
          live,
          general,
          selectedPlaybackSpeedRate,
        }}
        inCastMode={inCastMode}
        markers={markers}
      />
    );
  }

  renderCastPlayPause() {
    const {
      width, height, config, live, playhead, duration, playing, loading, hasNextVideo,
    } = this.props;
    const {
      play, previous, next, pause, forward, replay,
    } = config.icons;

    const iconFontSize = responsiveMultiplier(width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
    const seekVisible = !config.live.forceDvrDisabled || !live;
    const notInLiveRegion = playhead <= duration * VALUES.LIVE_THRESHOLD;
    const icons = {
      play: {
        icon: play.fontString,
        fontFamily: play.fontFamilyName,
      },
      previous: {
        icon: previous.fontString,
        fontFamily: previous.fontFamilyName,
      },
      next: {
        icon: next.fontString,
        fontFamily: next.fontFamilyName,
      },
      pause: {
        icon: pause.fontString,
        fontFamily: pause.fontFamilyName,
      },
      seekForward: {
        icon: forward.fontString,
        fontFamily: forward.fontFamilyName,
      },
      seekBackward: {
        icon: replay.fontString,
        fontFamily: replay.fontFamilyName,
      },
    };

    const showButtons = true;
    const showSeekButtons = true;

    return (
      <CastPlayPauseButtons
        icons={icons}
        seekEnabled={seekVisible}
        config={config}
        ffActive={live ? notInLiveRegion : true}
        onPress={name => this.handlePress(name)}
        onSeekPressed={isForward => this.onSeekPressed(isForward)}
        onSwitchPressed={isForward => this.onSwitchPressed(isForward)}
        seekForwardValue={config.castControls.skipForwardTime}
        seekBackwardValue={config.castControls.skipBackwardTime}
        frameWidth={width}
        frameHeight={height}
        buttonWidth={iconFontSize}
        buttonHeight={iconFontSize}
        fontSize={iconFontSize}
        showButton={showButtons}
        isLive={live}
        showSeekButtons={showSeekButtons}
        playing={playing}
        loading={loading}
        hasNextVideo={hasNextVideo}
      />
    );
  }

  render() {
    const { height, width } = this.props;

    return (
      <View
        accessible={false}
        style={[styles.castConnectedScreen, {
          width,
          height,
        }]}
      >
        {this.renderTopPanel()}
        {CastConnectedScreen.renderBorder()}
        {this.renderPlaceholder()}
        {this.renderCastPlayPause()}
        {this.renderBottomOverlay()}
      </View>
    );
  }
}
