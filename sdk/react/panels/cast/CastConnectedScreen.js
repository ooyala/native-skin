import PropTypes from 'prop-types';

import React from 'react';
import {
  Animated, Text, TouchableOpacity, View, Image,
} from 'react-native';
import { BUTTON_NAMES, UI_SIZES, VALUES } from '../../constants';

const Utils = require('../../utils');
const styles = Utils.getStyles(require('../style/CastConnectedStyles.json'));
const CastPlayPauseButtons = require('../../widgets/CastPlayPauseButtons');
const ResponsiveDesignManager = require('../../responsiveDesignManager');

const BottomOverlay = require('../../bottomOverlay');

class CastConnectedScreen extends React.Component {
  static propTypes = {
    playhead: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    live: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    volume: PropTypes.number.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    cuePoints: PropTypes.arrayOf(PropTypes.double).isRequired,
    stereoSupported: PropTypes.bool.isRequired,
    multiAudioEnabled: PropTypes.bool.isRequired,
    playbackSpeedEnabled: PropTypes.bool.isRequired,
    selectedPlaybackSpeedRate: PropTypes.string.isRequired,
    handlers: PropTypes.shape({
      onSwitch: PropTypes.func,
      onPress: PropTypes.func,
      onScrub: PropTypes.func,
      handleVideoTouchStart: PropTypes.func,
      handleVideoTouchMove: PropTypes.func,
      handleVideoTouchEnd: PropTypes.func,
      handleControlsTouch: PropTypes.func,
      handleShowControls: PropTypes.func,
    }).isRequired,
    screenReaderEnabled: PropTypes.bool.isRequired,
    availableClosedCaptionsLanguages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    config: PropTypes.object.isRequired,
    localizableStrings: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    playing: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    initialPlay: PropTypes.bool.isRequired,
    onDisconnect: PropTypes.func.isRequired,
    deviceName: PropTypes.string.isRequired,
    inCastMode: PropTypes.bool.isRequired,
    previewUrl: PropTypes.string.isRequired,
  };

  componentWillMount() {
    const { height } = this.props;

    this.state = {
      translateY: new Animated.Value(height),
      opacity: new Animated.Value(2),
      selectedID: -1,
    };
  }

  componentDidMount() {
    const { height } = this.props;
    const { translateY, opacity } = this.state;

    translateY.setValue(height);
    opacity.setValue(0);

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

  onSeekPressed(skipCountValue) {
    if (skipCountValue === 0) {
      return;
    }
    const { props } = this;
    const { playhead, duration } = props;
    const { skipForwardTime, skipBackwardTime } = props.config.castControls;

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
    const { props } = this;
    const { onSwitch } = props.handlers;
    onSwitch(isForwardSwitch);
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

  placeholderTapHandler(event) {
    const { props } = this;
    const { screenReaderEnabled } = props;
    const { handleVideoTouchEnd } = props.handlers;

    if (screenReaderEnabled) {
      this.handlePress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      handleVideoTouchEnd(event);
    }
  }

  handleScrub(value) {
    const { props } = this;
    const { onScrub } = props.handlers;
    onScrub(value);
  }

  handlePress(name) {
    const { showControls } = this.state;
    const { props } = this;
    const { onScrub, onPress, handleShowControls } = props.handlers;

    if (showControls) {
      if (name === 'LIVE') {
        onScrub(1);
      } else {
        onPress(name);
      }
    } else {
      handleShowControls();
      onPress(name);
    }
  }

  renderCastIcon() {
    const { props } = this;
    const { fontString, fontFamilyName } = props.config.icons.play;

    return (
      <Animated.Text
        accessible={false}
        style={{
          top: 5,
          marginLeft: 40,
          marginRight: 10,
          fontSize: 40,
          color: 'white',
          icon: fontString,
          fontFamily: fontFamilyName,
        }}
      >
        {'}'}
      </Animated.Text>
    );
  }

  renderTopPanel() {
    return (
      <View style={{
        backgroundColor: 'transparent',
        flexDirection: 'row',
        paddingTop: 20,
        height: 90,
      }}
      >
        {this.renderCastIcon()}
        {this.renderDeviceNameLines()}
        {this.renderDisconnectButton()}
      </View>
    );
  }

  renderDisconnectButton() {
    const { onDisconnect } = this.props;

    return (
      <View style={{
        flexDirection: 'column',
        width: 150,
        height: 50,
        flex: 1,
        marginEnd: 40,
        justifyContent: 'center',
      }}
      >
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              onDisconnect();
            }}
          >
            <Text
              style={{
                borderWidth: 1,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10,
                borderRadius: 4,
                color: 'white',
                fontWeight: 'bold',
                borderColor: 'black',
                backgroundColor: '#3FB5F7',
              }}
              numberOfLines={1}
            >
              {'Disconnect'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  static renderBorder() {
    return (
      <View
        style={{
          borderBottomColor: '#5c5c5c',
          borderBottomWidth: 0.5,
        }}
      />
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
    const accessible = false;
    const { props } = this;
    const { handleVideoTouchStart, handleVideoTouchMove } = props.handlers;

    return (
      <View
        reactTag={1}
        accessible={accessible}
        accessibilityLabel="Video player. Tap twice to play or pause"
        style={{
          flex: 1,
          alignItems: 'stretch',
          backgroundColor: 'transparent',
        }}
        importantForAccessibility="no"
        onTouchStart={event => handleVideoTouchStart(event)}
        onTouchMove={event => handleVideoTouchMove(event)}
        onTouchEnd={event => this.placeholderTapHandler(event)}
      >
        <Image
          style={{
            flex: 1,
            alignItems: 'stretch',
            resizeMode: 'contain',
          }}
          blurRadius={5}
          source={{ uri: props.previewUrl }}
        />
      </View>
    );
  }

  renderBottomOverlay() {
    const { props } = this;
    const {
      width, height, playing, fullscreen, cuePoints, playhead, duration, volume, availableClosedCaptionsLanguages,
      handlers, multiAudioEnabled, playbackSpeedEnabled, screenReaderEnabled, stereoSupported, config,
      selectedPlaybackSpeedRate, inCastMode,
    } = props;
    const { handleControlsTouch } = handlers;

    const {
      controlBar, castControls, castDevicesScreen, buttons, icons, live, general,
    } = config;


    const ccEnabled = availableClosedCaptionsLanguages && availableClosedCaptionsLanguages.length > 0;
    const isShown = true;

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
        onPress={name => this.handlePress(name)}
        onScrub={value => this.handleScrub(value)}
        handleControlsTouch={() => handleControlsTouch()}
        showAudioAndCCButton={multiAudioEnabled || ccEnabled}
        showPlaybackSpeedButton={playbackSpeedEnabled}
        isShow={isShown}
        screenReaderEnabled={screenReaderEnabled}
        stereoSupported={stereoSupported}
        config={{
          controlBar,
          castControls,
          castDevicesScreen,
          buttons,
          icons,
          live,
          general,
          selectedPlaybackSpeedRate,
        }}
        inCastMode={inCastMode}
      />
    );
  }

  renderCastPlayPause() {
    const { props } = this;
    const {
      width, height, config, live, playhead, duration, rate, playing, loading,
    } = props;
    const {
      play, previous, next, pause, forward, replay,
    } = config.icons;

    const iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
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
        rate={rate}
        playing={playing}
        loading={loading}
      />
    );
  }

  render() {
    const { height, width } = this.props;

    return (
      <View
        accessible={false}
        style={{
          width,
          height,
          flex: 0,
          flexDirection: 'column',
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
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

module.exports = CastConnectedScreen;
