import PropTypes from 'prop-types';
import React from 'react';
import {
  ActivityIndicator, Image, Platform, Text, TouchableHighlight, View,
} from 'react-native';

import {
  AUTOHIDE_DELAY, BUTTON_NAMES, UI_SIZES, VALUES,
} from '../../constants';
import * as Log from '../../lib/log';
import responsiveMultiplier from '../../lib/responsiveMultiplier';
import * as Utils from '../../lib/utils';
import BottomOverlay from '../../shared/BottomOverlay';
import VideoViewPlayPause from '../../shared/VideoViewPlayPause';
import UpNext from './UpNext';
import VideoWaterMark from './VideoWatermark';

import styles from './VideoView.styles';

export default class VideoView extends React.Component {
  static propTypes = {
    rate: PropTypes.number,
    playhead: PropTypes.number,
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
      onControlsVisibilityChanged: PropTypes.func.isRequired,
    }),
    // The following prop is used in static `getDerivedStateFromProps` only, that's why it is considered unused by
    // ESLint. Should be fixed by ESLint team.
    lastPressedTime: PropTypes.any, // eslint-disable-line react/no-unused-prop-types
    screenReaderEnabled: PropTypes.bool,
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

  constructor(props) {
    super(props);

    this.state = {
      shouldShowControls: true,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { handlers } = this.props;
    const { shouldShowControls } = this.state;

    if (prevState.shouldShowControls !== shouldShowControls) {
      handlers.onControlsVisibilityChanged(shouldShowControls);
    }
  }

  static getDerivedStateFromProps(props) {
    const isPastAutoHideTime = (new Date()).getTime() - props.lastPressedTime > AUTOHIDE_DELAY;
    const isVisible = props.screenReaderEnabled ? true : !isPastAutoHideTime;

    return {
      shouldShowControls: isVisible,
    };
  }

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
    const { handlers } = this.props;

    Log.verbose(`VideoView Handle Press: ${name}`);

    handlers.showControls();
    handlers.onPress(name);
  };

  onSeekPressed = (skipCountValue) => {
    const { config, duration, playhead } = this.props;

    if (skipCountValue === 0) {
      return;
    }

    let configSeekValue = (skipCountValue > 0) ? config.skipControls.skipForwardTime
      : config.skipControls.skipBackwardTime;
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
  };

  handleScrub = (value) => {
    const { handlers } = this.props;

    handlers.onScrub(value);
  };

  handleOverlayClick = () => {
    const { adOverlay, handlers } = this.props;

    handlers.onAdOverlay(adOverlay.clickUrl);
  };

  placeholderTapHandler = (event) => {
    const { handlers, screenReaderEnabled } = this.props;

    if (screenReaderEnabled) {
      this.handlePress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      handlers.handleVideoTouchEnd(event);
    }
  };

  renderBottomOverlay() {
    const {
      audioTracksTitles, availableClosedCaptionsLanguages, config, cuePoints, duration, fullscreen, handlers, height,
      isPipActivated, isPipButtonVisible, markers, multiAudioEnabled, playbackSpeedEnabled, playhead, playing,
      screenReaderEnabled, selectedPlaybackSpeedRate, showWatermark, stereoSupported, volume, width,
    } = this.props;
    const { shouldShowControls } = this.state;

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
        isShow={shouldShowControls}
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

  renderPlaceholder = () => {
    const { handlers } = this.props;

    return (
      <View
        reactTag={1}
        accessible
        accessibilityLabel="Video player. Tap twice to play or pause"
        style={styles.placeholder}
        importantForAccessibility="no"
        onTouchStart={event => handlers.handleVideoTouchStart(event)}
        onTouchMove={event => handlers.handleVideoTouchMove(event)}
        onTouchEnd={event => this.placeholderTapHandler(event)}
      />
    );
  };

  renderBottom = () => {
    const { config } = this.props;

    const VideoWaterMarkSize = responsiveMultiplier(UI_SIZES.VIDEOWATERMARK, UI_SIZES.VIDEOWATERMARK);
    const waterMarkName = Platform.select({
      ios: config.general.watermark.imageResource.iosResource,
      android: config.general.watermark.imageResource.androidResource,
    });

    let watermark = null;
    if (waterMarkName) {
      watermark = this.renderVideoWaterMark(waterMarkName, VideoWaterMarkSize);
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        {watermark}
        {this.renderClosedCaptions()}
      </View>
    );
  };

  renderClosedCaptions = () => {
    const {
      caption, captionStyles, config, handlers, width,
    } = this.props;

    const containerPadding = 5;
    const captionWidth = width - (containerPadding * 4);

    const ccStyle = {
      color: captionStyles.textColor,
      fontFamily: captionStyles.fontName,
      backgroundColor: `rgba(0,0,0,${config.ccBackgroundOpacity})`,
    };

    if (caption) {
      return (
        <View
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          style={[styles.closedCaptionsContainer,
            {
              padding: containerPadding,
              width: captionWidth,
              backgroundColor: 'transparent',
              position: 'absolute',
            }]}
          onTouchEnd={event => handlers.handleVideoTouchEnd(event)}
        >
          <Text style={[styles.closedCaptions, ccStyle]}>
            {caption}
          </Text>
        </View>
      );
    }

    return null;
  };

  renderUpNext = () => {
    const {
      config, duration, live, nextVideo, playhead, upNextDismissed, width,
    } = this.props;

    if (live) {
      return null;
    }

    return (
      <UpNext
        config={{
          upNext: config.upNext,
          icons: config.icons,
        }}
        playhead={playhead}
        duration={duration}
        nextVideo={nextVideo}
        upNextDismissed={upNextDismissed}
        onPress={value => this.handlePress(value)}
        width={width}
      />
    );
  };

  renderPlayPause = () => {
    const {
      config, duration, height, initialPlay, live, loading, playhead, playing, rate, width,
    } = this.props;
    const { shouldShowControls } = this.state;

    const iconFontSize = responsiveMultiplier(width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
    const seekVisible = !config.live.forceDvrDisabled || !live;
    const notInLiveRegion = playhead <= duration * VALUES.LIVE_THRESHOLD;

    return (
      <VideoViewPlayPause
        icons={{
          play: {
            icon: config.icons.play.fontString,
            fontFamily: config.icons.play.fontFamilyName,
          },
          pause: {
            icon: config.icons.pause.fontString,
            fontFamily: config.icons.pause.fontFamilyName,
          },
          seekForward: {
            icon: config.icons.forward.fontString,
            fontFamily: config.icons.forward.fontFamilyName,
          },
          seekBackward: {
            icon: config.icons.replay.fontString,
            fontFamily: config.icons.replay.fontFamilyName,
          },
        }}
        seekEnabled={seekVisible}
        ffActive={live ? notInLiveRegion : true}
        position="center"
        onPress={name => this.handlePress(name)}
        onSeekPressed={isForward => this.onSeekPressed(isForward)}
        seekForwardValue={config.skipControls.skipForwardTime}
        seekBackwardValue={config.skipControls.skipBackwardTime}
        frameWidth={width}
        frameHeight={height}
        buttonWidth={iconFontSize}
        buttonHeight={iconFontSize}
        fontSize={iconFontSize}
        showButton={shouldShowControls}
        isLive={live}
        showSeekButtons={config.skipControls.enabled && shouldShowControls}
        rate={rate}
        playing={playing}
        loading={loading}
        initialPlay={initialPlay}
      />
    );
  };

  renderVideoWaterMark = (waterMarkName, VideoWaterMarkSize) => {
    if (!waterMarkName) {
      return null;
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
      >
        <VideoWaterMark
          buttonWidth={VideoWaterMarkSize}
          buttonHeight={VideoWaterMarkSize}
          waterMarkName={waterMarkName}
        />
      </View>
    );
  };

  renderAdOverlay = () => {
    const {
      adOverlay, config, handlers, width: propsWidth,
    } = this.props;

    if (!adOverlay) {
      return null;
    }

    // width and height of the ad overlay
    let { width } = adOverlay;
    let { height } = adOverlay;

    // if the width of the ad is larger than the player width
    const sidePadding = 10;
    const maxWidth = propsWidth - 2 * sidePadding;
    if (width > maxWidth) {
      height = height / width * maxWidth;
      width = maxWidth;
    }
    const left = (propsWidth - width) / 2;

    const overlayStyle = {
      height,
      width,
      backgroundColor: 'transparent',
    };

    const positionStyle = {
      left,
      bottom: 10,
      width,
      height,
      backgroundColor: 'transparent',
    };

    return (
      <View
        accesible={false}
        style={overlayStyle}
      >
        <TouchableHighlight
          style={positionStyle}
          onPress={this.handleOverlayClick}
        >
          <View
            style={styles.container}
          >
            <Image
              style={overlayStyle}
              source={{ uri: adOverlay.resourceUrl }}
              resizeMode="contain"
            />
            <TouchableHighlight
              style={styles.dismissOverlay}
              onPress={handlers.onAdOverlayDismiss}
            >
              <Text style={styles.dismissIcon}>
                {config.icons.dismiss.fontString}
              </Text>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  renderLoading = () => {
    const { height, loading, width } = this.props;

    const loadingSize = responsiveMultiplier(width, UI_SIZES.LOADING_ICON);
    const scaleMultiplier = Platform.OS === 'android' ? 2 : 1;
    const topOffset = Math.round((height - loadingSize * scaleMultiplier) * 0.5);
    const leftOffset = Math.round((width - loadingSize * scaleMultiplier) * 0.5);
    const loadingStyle = {
      position: 'absolute',
      top: topOffset,
      left: leftOffset,
      width: loadingSize,
      height: loadingSize,
    };

    if (loading) {
      return (
        <ActivityIndicator
          style={loadingStyle}
          size="large"
        />
      );
    }

    return null;
  };

  render() {
    const { height, width } = this.props;

    // for renderPlayPause, if the screen reader is enabled, we want to hide the button
    return (
      <View
        accessible={false}
        style={[styles.container, { height, width }]}
      >
        {this.renderPlaceholder()}
        {this.renderBottom()}
        {this.renderAdOverlay()}
        {this.renderPlayPause()}
        {this.renderUpNext()}
        {this.renderBottomOverlay()}
        {this.renderLoading()}
      </View>
    );
  }
}
