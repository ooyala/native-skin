import PropTypes from 'prop-types';

import React from 'react';
import {Animated, Text, TouchableOpacity, View} from 'react-native';
import {BUTTON_NAMES, UI_SIZES, VALUES} from "../../constants";

const Log = require('../../log');
const Utils = require('../../utils');
const styles = Utils.getStyles(require('../style/videoViewStyles.json'));
const CastPlayPauseButtons = require('../../widgets/CastPlayPauseButtons');
const ResponsiveDesignManager = require('../../responsiveDesignManager');

const BottomOverlay = require('../../bottomOverlay');

class CastConnectedScreen extends React.Component {
  static propTypes = {
    playhead: PropTypes.number,
    buffered: PropTypes.number,
    duration: PropTypes.number,
    adOverlay: PropTypes.object,
    live: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    volume: PropTypes.number,
    fullscreen: PropTypes.bool,
    cuePoints: PropTypes.array,
    stereoSupported: PropTypes.bool,
    multiAudioEnabled: PropTypes.bool,
    playbackSpeedEnabled: PropTypes.bool,
    selectedPlaybackSpeedRate: PropTypes.string,
    handlers: PropTypes.shape({
      onSwitch: PropTypes.func,
      onPress: PropTypes.func,
      onAdOverlay: PropTypes.func,
      onAdOverlayDismiss: PropTypes.func,
      onScrub: PropTypes.func,
      handleVideoTouchStart: PropTypes.func,
      handleVideoTouchMove: PropTypes.func,
      handleVideoTouchEnd: PropTypes.func,
      handleControlsTouch: PropTypes.func,
      showControls: PropTypes.func,
    }),
    lastPressedTime: PropTypes.any,
    screenReaderEnabled: PropTypes.bool,
    closedCaptionsLanguage: PropTypes.string,
    availableClosedCaptionsLanguages: PropTypes.array,
    caption: PropTypes.string,
    captionStyles: PropTypes.object,
    showWatermark: PropTypes.bool,
    config: PropTypes.object,
    nextVideo: PropTypes.object,
    upNextDismissed: PropTypes.bool,
    localizableStrings: PropTypes.object,
    locale: PropTypes.string,
    playing: PropTypes.bool,
    loading: PropTypes.bool,
    initialPlay: PropTypes.bool,
    onDisconnect: PropTypes.func,
    deviceName: PropTypes.string,
    inCastMode: PropTypes.bool
  };

  componentWillMount() {
    this.state = {
      translateY: new Animated.Value(this.props.height),
      opacity: new Animated.Value(2),
      selectedID: -1
    };
  }

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

  render() {
    return (
      <View
        accessible={false}
        style={[styles.container, {"height": this.props.height}, {backgroundColor: "transparent"}, {"width": this.props.width}]}>
        <View style={{backgroundColor: "transparent", flexDirection: 'row', paddingTop: 20, height: 90}}>
          <Animated.Text
            accessible={false}
            style={{
              top: 5,
              marginLeft: 40,
              marginRight: 10,
              fontSize: 40,
              color: "white",
              icon: this.props.config.icons.play.fontString,
              fontFamily: this.props.config.icons.play.fontFamilyName
            }}>
            {'}'}
          </Animated.Text>

          <View style={{flex: 1, height: 50, justifyContent: 'center',}}>
            <Text style={{color: "white"}}> {"Connected to"} </Text>
            <Text style={{color: "white", fontWeight: "bold"}}> {this.props.deviceName} </Text>
          </View>

          <View style={{
            flexDirection: 'column',
            width: 150,
            height: 50,
            flex: 1,
            marginEnd: 40,
            justifyContent: 'center',
          }}>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  this.props.onDisconnect();
                }}>
                <Text style={{
                  borderWidth: 1,
                  paddingLeft: 25,
                  paddingRight: 25,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderRadius: 4,
                  color: "white",
                  fontWeight: "bold",
                  borderColor: 'black',
                  backgroundColor: '#3FB5F7'
                }}>
                  {"Disconnect"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#5c5c5c',
            borderBottomWidth: 0.5,
          }}
        />
        {this._renderPlaceholder()}
        {this._renderPlayPause(true)}
        {this._renderBottomOverlay(true)}
      </View>
    );
  }

  _renderPlaceholder = () => {
    return (
      <View
        reactTag={1}
        accessible={true}
        accessibilityLabel={"Video player. Tap twice to play or pause"}
        style={styles.placeholder}
        importantForAccessibility={'no'}
        onTouchStart={(event) => this.props.handlers.handleVideoTouchStart(event)}
        onTouchMove={(event) => this.props.handlers.handleVideoTouchMove(event)}
        onTouchEnd={(event) => this._placeholderTapHandler(event)}>
      </View>);
  };

  _placeholderTapHandler = (event) => {
    if (this.props.screenReaderEnabled) {
      this.handlePress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      this.props.handlers.handleVideoTouchEnd(event);
    }
  };

  _renderBottomOverlay = (show) => {
    const ccEnabled =
      this.props.availableClosedCaptionsLanguages &&
      this.props.availableClosedCaptionsLanguages.length > 0;

    return (<BottomOverlay
      width={this.props.width}
      height={this.props.height}
      primaryButton={this.props.playing ? "pause" : "play"}
      fullscreen={this.props.fullscreen}
      cuePoints={this.props.cuePoints}
      playhead={this.props.playhead}
      duration={this.props.duration}
      volume={this.props.volume}
      live={this.generateLiveObject()}
      onPress={(name) => this.handlePress(name)}
      onScrub={(value) => this.handleScrub(value)}
      handleControlsTouch={() => this.props.handlers.handleControlsTouch()}
      showAudioAndCCButton={this.props.multiAudioEnabled || ccEnabled}
      showPlaybackSpeedButton={this.props.playbackSpeedEnabled}
      showWatermark={this.props.showWatermark}
      isShow={show}
      screenReaderEnabled={this.props.screenReaderEnabled}
      stereoSupported={this.props.stereoSupported}
      config={{
        controlBar: this.props.config.controlBar,
        buttons: this.props.config.buttons,
        icons: this.props.config.icons,
        live: this.props.config.live,
        general: this.props.config.general,
        selectedPlaybackSpeedRate: this.props.selectedPlaybackSpeedRate
      }}
      inCastMode={this.props.inCastMode}
    />);
  };

  generateLiveObject = () => {
    if (this.props.live) {
      const isLive = this.props.playhead >= this.props.duration * VALUES.LIVE_THRESHOLD;
      return ({
        label:
          isLive ? Utils.localizedString(this.props.locale, "LIVE", this.props.localizableStrings) :
            Utils.localizedString(this.props.locale, "GO LIVE", this.props.localizableStrings),
        onGoLive: isLive ? null : this.onGoLive
      });
    } else {
      return null;
    }
  };

  _renderPlayPause = (show) => {

    const iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
    const seekVisible = !this.props.config.live.forceDvrDisabled || !this.props.live;
    const notInLiveRegion = this.props.playhead <= this.props.duration * VALUES.LIVE_THRESHOLD;
    return (
      <CastPlayPauseButtons
        icons={{
          play: {
            icon: this.props.config.icons.play.fontString,
            fontFamily: this.props.config.icons.play.fontFamilyName
          },
          previous: {
            icon: this.props.config.icons.previous.fontString,
            fontFamily: this.props.config.icons.previous.fontFamilyName
          },
          next: {
            icon: this.props.config.icons.next.fontString,
            fontFamily: this.props.config.icons.next.fontFamilyName
          },
          pause: {
            icon: this.props.config.icons.pause.fontString,
            fontFamily: this.props.config.icons.pause.fontFamilyName
          },
          seekForward: {
            icon: this.props.config.icons.forward.fontString,
            fontFamily: this.props.config.icons.forward.fontFamilyName
          },
          seekBackward: {
            icon: this.props.config.icons.replay.fontString,
            fontFamily: this.props.config.icons.replay.fontFamilyName
          }
        }}
        seekEnabled={seekVisible}
        ffActive={this.props.live ? notInLiveRegion : true}
        position={"center"}
        onPress={(name) => this.handlePress(name)}
        onSeekPressed={(isForward) => this.onSeekPressed(isForward)}
        onSwitchPressed={(isForward) => this.onSwitchPressed(isForward)}
        seekForwardValue={this.props.config.castControls.skipForwardTime}
        seekBackwardValue={this.props.config.castControls.skipBackwardTime}
        frameWidth={this.props.width}
        frameHeight={this.props.height}
        buttonWidth={iconFontSize}
        buttonHeight={iconFontSize}
        fontSize={iconFontSize}
        showButton={show}
        isLive={this.props.live}
        showSeekButtons={true}
        rate={this.props.rate}
        playing={this.props.playing}
        loading={this.props.loading}
        initialPlay={this.props.initialPlay}/>
    );
  };

  onSeekPressed = (skipCountValue) => {
    if (skipCountValue == 0) {
      return null;
    }

    let configSeekValue = (skipCountValue > 0) ? this.props.config.castControls.skipForwardTime : this.props.config.castControls.skipBackwardTime;

    configSeekValue = Utils.restrictSeekValueIfNeeded(configSeekValue);
    const seekValue = configSeekValue * skipCountValue;
    const currentPlayhead = this.props.playhead;
    let resultedPlayhead = currentPlayhead + seekValue;
    if (resultedPlayhead < 0) {
      resultedPlayhead = 0;
    } else if (resultedPlayhead > this.props.duration) {
      resultedPlayhead = this.props.duration;
    }
    const resultedPlayheadPercent = this.props.duration === 0 ? 0 : resultedPlayhead / this.props.duration;
    this.handleScrub(resultedPlayheadPercent);
  };

  onSwitchPressed = (isForwardSwitch) => {
    this.props.handlers.onSwitch(isForwardSwitch);
  };

  handleScrub = (value) => {
    this.props.handlers.onScrub(value);
  };

  handlePress = (name) => {
    Log.verbose("VideoView Handle Press: " + name);
    if (this.state.showControls) {
      if (name === "LIVE") {
        this.props.handlers.onScrub(1);
      } else {
        this.props.handlers.onPress(name);
      }
    } else {
      this.props.handlers.showControls();
      this.props.handlers.onPress(name);
    }
  };
}

module.exports = CastConnectedScreen;
