import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  Platform,
  TouchableHighlight,
} from 'react-native';

import {
  BUTTON_NAMES,
  UI_SIZES,
  AUTOHIDE_DELAY,
  VALUES,
} from '../../constants';
import BottomOverlay from '../../shared/BottomOverlay';
import UpNext from './UpNext/UpNext';
import VideoViewPlayPause from '../../shared/VideoViewPlayPause/VideoViewPlayPause';
import Log from '../../lib/log';
import Utils from '../../lib/utils';
import ResponsiveDesignManager from '../../lib/responsiveMultiplier';
import VideoWaterMark from './VideoWatermark/VideoWatermark';

import panelStyles from '../styles/view.styles';
import videoViewStyles from './VideoView.styles';

const styles = Utils.getStyles(videoViewStyles);

class VideoView extends Component {
  static propTypes = {
    rate: PropTypes.number,
    playhead: PropTypes.number,
    buffered: PropTypes.number,
    duration: PropTypes.number,
    adOverlay: PropTypes.object,
    live: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    volume: PropTypes.number,
    fullscreen: PropTypes.bool,
    isPipActivated: PropTypes.bool,
    isPipButtonVisible: PropTypes.bool,
    cuePoints: PropTypes.array,
    stereoSupported: PropTypes.bool,
    multiAudioEnabled: PropTypes.bool,
    playbackSpeedEnabled: PropTypes.bool,
    selectedPlaybackSpeedRate: PropTypes.number,
    handlers: PropTypes.shape({
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
    audioTracksTitles: PropTypes.array,
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
    markers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  generateLiveObject = () => {
    const {
      live, playhead, duration, locale, localizableStrings,
    } = this.props;
    if (live) {
      const isLive = playhead >= duration * VALUES.LIVE_THRESHOLD;
      return ({
        label: Utils.localizedString(locale, 'LIVE', localizableStrings),
        isLive,
      });
    }
    return null;
  };


  handlePress = (name) => {
    Log.verbose(`VideoView Handle Press: ${name}`);
    this.props.handlers.showControls();
    this.props.handlers.onPress(name);
  };

  onSeekPressed = (skipCountValue) => {
    if (skipCountValue === 0) { return null; }

    let configSeekValue = (skipCountValue > 0) ? this.props.config.skipControls.skipForwardTime : this.props.config.skipControls.skipBackwardTime;
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

  _placeholderTapHandler = (event) => {
    if (this.props.screenReaderEnabled) {
      this.handlePress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      this.props.handlers.handleVideoTouchEnd(event);
    }
  };

  _createOnIcon = (index, func) => {
    return function () {
      func(index);
    }
  };

  _renderBottomOverlay(show) {
    const {
      audioTracksTitles, availableClosedCaptionsLanguages, config, cuePoints, duration, fullscreen, handlers, height,
      isPipActivated, isPipButtonVisible, markers, multiAudioEnabled, playbackSpeedEnabled, playhead, playing,
      screenReaderEnabled, selectedPlaybackSpeedRate, showWatermark, stereoSupported, volume, width,
    } = this.props;

    const ccEnabled = (availableClosedCaptionsLanguages && availableClosedCaptionsLanguages.length > 0);

    return (
      <BottomOverlay
        width={width}
        height={height}
        primaryButton={playing ? 'pause' : 'play'}
        fullscreen={fullscreen}
        isPipActivated={isPipActivated}
        isPipButtonVisible={isPipButtonVisible}
        cuePoints={cuePoints}
        playhead={playhead}
        duration={duration}
        volume={volume}
        live={this.generateLiveObject()}
        onPress={name => this.handlePress(name)}
        onScrub={value => this.handleScrub(value)}
        handleControlsTouch={() => handlers.handleControlsTouch()}
        showAudioAndCCButton={multiAudioEnabled || ccEnabled}
        showPlaybackSpeedButton={playbackSpeedEnabled}
        showWatermark={showWatermark}
        isShow={show}
        screenReaderEnabled={screenReaderEnabled}
        stereoSupported={stereoSupported}
        config={{
          controlBar: config.controlBar,
          castControls: config.castControls,
          buttons: config.buttons,
          icons: config.icons,
          live: config.live,
          general: config.general,
          selectedPlaybackSpeedRate,
          hasMultiAudioTracks: (audioTracksTitles && audioTracksTitles.length > 1),
        }}
        markers={markers}
      />
    );
  }

  _renderPlaceholder = () => {
    return (
      <View
        reactTag={1}
        accessible={true}
        accessibilityLabel={'Video player. Tap twice to play or pause'}
        style={styles.placeholder}
        importantForAccessibility={'no'}
        onTouchStart={(event) => this.props.handlers.handleVideoTouchStart(event)}
        onTouchMove={(event) => this.props.handlers.handleVideoTouchMove(event)}
        onTouchEnd={(event) => this._placeholderTapHandler(event)}>
      </View>
    );
  };

  _renderBottom = () => {
    const VideoWaterMarkSize = ResponsiveDesignManager.makeResponsiveMultiplier(UI_SIZES.VIDEOWATERMARK, UI_SIZES.VIDEOWATERMARK);
    let waterMarkName = Platform.select({
      ios: this.props.config.general.watermark.imageResource.iosResource,
      android: this.props.config.general.watermark.imageResource.androidResource,
    });

    let watermark;
    if (waterMarkName) {
      watermark = this._renderVideoWaterMark(waterMarkName, VideoWaterMarkSize);
    }

    return (
      <View
        style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end'}}>
        {watermark}
        {this._renderClosedCaptions()}
      </View>
    );
  };

  _renderClosedCaptions = () => {
    const containerPadding = 5;
    let captionWidth = this.props.width - (containerPadding * 4);

    const ccStyle = {
      color: this.props.captionStyles.textColor, fontFamily: this.props.captionStyles.fontName,
      backgroundColor: 'rgba(0,0,0,'+this.props.config.ccBackgroundOpacity+')',
    };
    if (this.props.caption) {
      return (
        <View
          accessible={false}
          importantForAccessibility='no-hide-descendants'
          style={[panelStyles.closedCaptionsContainer, {padding: containerPadding, width: captionWidth, backgroundColor: 'transparent', position: 'absolute'}]}
          onTouchEnd={(event) => this.props.handlers.handleVideoTouchEnd(event)}>
          <Text style={[panelStyles.closedCaptions, ccStyle]}>
            {this.props.caption}
          </Text>
        </View>
      );
    }
    return null;
  };

  _renderUpNext = () => {
    if (this.props.live) {
      return null;
    }

    return (
      <UpNext
        config={{
          upNext: this.props.config.upNext,
          icons: this.props.config.icons,
        }}
        ad={this.props.ad}
        playhead={this.props.playhead}
        duration={this.props.duration}
        nextVideo={this.props.nextVideo}
        upNextDismissed={this.props.upNextDismissed}
        onPress={(value) => this.handlePress(value)}
        width={this.props.width}>
      </UpNext>
    );
  };

  _renderPlayPause = (show) => {
    const iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
    const seekVisible = !this.props.config.live.forceDvrDisabled || !this.props.live;
    const notInLiveRegion = this.props.playhead <= this.props.duration * VALUES.LIVE_THRESHOLD;
    return (
      <VideoViewPlayPause
        icons={{
          play: {
            icon: this.props.config.icons.play.fontString,
            fontFamily: this.props.config.icons.play.fontFamilyName,
          },
          pause: {
            icon: this.props.config.icons.pause.fontString,
            fontFamily: this.props.config.icons.pause.fontFamilyName,
          },
          seekForward: {
            icon: this.props.config.icons.forward.fontString,
            fontFamily: this.props.config.icons.forward.fontFamilyName,
          },
          seekBackward: {
            icon: this.props.config.icons.replay.fontString,
            fontFamily: this.props.config.icons.replay.fontFamilyName,
          },
        }}
        seekEnabled={seekVisible}
        ffActive={this.props.live ? notInLiveRegion : true}
        position={'center'}
        onPress={(name) => this.handlePress(name)}
        onSeekPressed={(isForward) => this.onSeekPressed(isForward)}
        seekForwardValue={this.props.config.skipControls.skipForwardTime}
        seekBackwardValue={this.props.config.skipControls.skipBackwardTime}
        frameWidth={this.props.width}
        frameHeight={this.props.height}
        buttonWidth={iconFontSize}
        buttonHeight={iconFontSize}
        fontSize={iconFontSize}
        showButton={show}
        isLive={this.props.live}
        showSeekButtons={this.props.config.skipControls.enabled && show}
        rate={this.props.rate}
        playing={this.props.playing}
        loading={this.props.loading}
        initialPlay={this.props.initialPlay}>
      </VideoViewPlayPause>
    );
  };

  _renderVideoWaterMark = (waterMarkName, VideoWaterMarkSize) => {
    if (waterMarkName) {
      return (
        <View
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
          <VideoWaterMark
            buttonWidth={VideoWaterMarkSize}
            buttonHeight={VideoWaterMarkSize}
            waterMarkName={waterMarkName}/>
        </View>
      );
    }
  };

  _renderAdOverlay = () => {
    if (!this.props.adOverlay) {
      return null;
    }

    //width and height of the ad overlay
    let width = this.props.adOverlay.width;
    let height = this.props.adOverlay.height;

    //if the width of the ad is larger than the player width
    const sidePadding = 10;
    const maxWidth = this.props.width - 2 * sidePadding;
    if (width > maxWidth) {
      height = height / width * maxWidth;
      width = maxWidth;
    }
    const left = (this.props.width - width) / 2;

    const overlayStyle = {height: height, width: width, backgroundColor: 'transparent'};
    const positionStyle = {left: left, bottom: 10, width: width, height: height, backgroundColor: 'transparent'};
    return (
      <View
        accesible={false}
        style={overlayStyle}>
        <TouchableHighlight
          style={positionStyle}
          onPress={this.handleOverlayClick}>
          <View
            style={styles.container}>
            <Image
              style={overlayStyle}
              source={{uri: this.props.adOverlay.resourceUrl}}
              resizeMode='contain'>
            </Image>
            <TouchableHighlight
              style={panelStyles.dismissOverlay}
              onPress={this.props.handlers.onAdOverlayDismiss}>
              <Text style={panelStyles.dismissIcon}>
                {this.props.config.icons.dismiss.fontString}
              </Text>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  _renderLoading = () => {
    const loadingSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.LOADING_ICON);
    const scaleMultiplier = Platform.OS === 'android' ? 2 : 1;
    const topOffset = Math.round((this.props.height - loadingSize * scaleMultiplier) * 0.5);
    const leftOffset = Math.round((this.props.width - loadingSize * scaleMultiplier) * 0.5);
    const loadingStyle = {
      position: 'absolute',
      top: topOffset,
      left: leftOffset,
      width: loadingSize,
      height: loadingSize,
    };
    if (this.props.loading) {
      return (
        <ActivityIndicator
          style={loadingStyle}
          size='large'>
        </ActivityIndicator>
      );
    }
  };

  handleScrub = (value) => {
    this.props.handlers.onScrub(value);
  };

  handleOverlayClick = () => {
    this.props.handlers.onAdOverlay(this.props.adOverlay.clickUrl);
  };

  render() {
    const isPastAutoHideTime = (new Date).getTime() - this.props.lastPressedTime > AUTOHIDE_DELAY;
    const shouldShowControls = this.props.screenReaderEnabled ? true : !isPastAutoHideTime;

    // for renderPlayPause, if the screen reader is enabled, we want to hide the button
    return (
      <View
        accessible={false}
        style={[styles.container, {'height': this.props.height}, {'width': this.props.width}]}>
        {this._renderPlaceholder()}
        {this._renderBottom()}
        {this._renderAdOverlay()}
        {this._renderPlayPause(shouldShowControls)}
        {this._renderUpNext()}
        {this._renderBottomOverlay(shouldShowControls)}
        {this._renderLoading()}
      </View>
    );
  }
}

module.exports = VideoView;
