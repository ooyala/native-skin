import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, TouchableHighlight, View } from 'react-native';

import AdBar from './AdBar';
import { AUTOHIDE_DELAY, UI_SIZES, VALUES } from '../../constants';
import * as Log from '../../lib/log';
import responsiveMultiplier from '../../lib/responsiveMultiplier';
import * as Utils from '../../lib/utils';
import BottomOverlay from '../../shared/BottomOverlay';
import VideoViewPlayPause from '../../shared/VideoViewPlayPause';

import styles from './AdPlaybackScreen.styles';

export default class AdPlaybackScreen extends Component {
  static propTypes = {
    rate: PropTypes.number,
    playhead: PropTypes.number,
    buffered: PropTypes.number,
    duration: PropTypes.number,
    ad: PropTypes.object,
    live: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    volume: PropTypes.number,
    fullscreen: PropTypes.bool,
    cuePoints: PropTypes.array,
    handlers: PropTypes.shape({
      onPress: PropTypes.func,
      onIcon: PropTypes.func,
      onScrub: PropTypes.func,
      handleVideoTouch: PropTypes.func,
      handleControlsTouch: PropTypes.func,
    }),
    lastPressedTime: PropTypes.any,
    screenReaderEnabled: PropTypes.bool,
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

  static defaultProps = {
    playhead: 0,
    buffered: 0,
    duration: 1,
  };

  state = {
    showControls: true,
  };

  generateLiveObject = () => {
    const {
      duration, live, locale, localizableStrings, playhead,
    } = this.props;

    if (!live) {
      return null;
    }

    const isLive = playhead >= duration * VALUES.LIVE_THRESHOLD;

    return ({
      label: Utils.localizedString(locale, isLive ? 'LIVE' : 'GO LIVE', localizableStrings),
      onGoLive: isLive ? null : this.onGoLive,
    });
  };

  onGoLive = () => {
    const { handlers } = this.props;

    Log.log('onGoLive');

    if (handlers.onScrub) {
      handlers.onScrub(1);
    }
  };

  handlePress = (name) => {
    const { handlers } = this.props;
    const { showControls } = this.state;

    Log.verbose(`VideoView Handle Press: ${name}`);

    if (showControls) {
      if (name === 'LIVE') {
        handlers.onScrub(1);
      } else {
        handlers.onPress(name);
      }
    } else {
      handlers.onPress(name);
    }
  };

  _createOnIcon = (index, func) => function () {
    func(index);
  };

  _renderBottomOverlay(show) {
    const {
      ad, config, cuePoints, duration, fullscreen, handlers, height, markers, playhead, playing, showWatermark, volume,
      width,
    } = this.props;

    return (
      <BottomOverlay
        width={width}
        height={height}
        primaryButton={playing ? 'pause' : 'play'}
        fullscreen={fullscreen}
        cuePoints={cuePoints}
        playhead={playhead}
        duration={duration}
        ad={ad}
        volume={volume}
        live={this.generateLiveObject()}
        onPress={name => this.handlePress(name)}
        onScrub={value => this.handleScrub(value)}
        handleControlsTouch={() => handlers.handleControlsTouch()}
        showClosedCaptionsButton={false}
        showWatermark={showWatermark}
        isShow={show}
        config={{
          controlBar: config.controlBar,
          buttons: config.buttons,
          icons: config.icons,
          live: config.live,
          general: config.general,
        }}
        showMoreOptionsButton={false}
        showAudioAndCCButton={false}
        showPlaybackSpeedButton={false}
        markers={markers}
      />
    );
  }

  _renderAdBar = () => {
    const {
      ad, duration, locale, localizableStrings, playhead, width,
    } = this.props;

    return (
      <AdBar
        ad={ad}
        playhead={playhead}
        duration={duration}
        onPress={this.handlePress}
        width={width}
        localizableStrings={localizableStrings}
        locale={locale}
      />
    );
  };

  _renderPlaceholder = (adIcons) => {
    const { handlers } = this.props;

    return (
      <View onTouchEnd={event => handlers.handleVideoTouch(event)} style={styles.placeholder}>
        {adIcons}
      </View>
    );
  };

  _renderPlayPause = (show) => {
    const {
      config, height, initialPlay, loading, playing, rate, width,
    } = this.props;

    const iconFontSize = responsiveMultiplier(width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);

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
        position="center"
        onPress={name => this.handlePress(name)}
        frameWidth={width}
        frameHeight={height}
        buttonWidth={iconFontSize}
        buttonHeight={iconFontSize}
        fontSize={iconFontSize}
        showButton={show}
        rate={rate}
        playing={playing}
        loading={loading}
        initialPlay={initialPlay}
      />
    );
  };

  handleScrub = (value) => {
    const { handlers } = this.props;

    handlers.onScrub(value);
  };

  handleTouchEnd = () => {
    const { handlers } = this.props;

    handlers.handleVideoTouch();
  };

  _renderAdIcons = () => {
    const {
      ad, handlers, height, playhead, width,
    } = this.props;

    const iconViews = [];

    for (const index in ad.icons) {
      const icon = ad.icons[index];

      if (playhead < icon.offset || playhead > icon.offset + icon.duration) {
        continue;
      }

      const left = icon.x;
      const top = icon.y;
      const iconStyle = {
        position: 'absolute',
        width: icon.width,
        height: icon.height,
        backgroundColor: 'transparent',
      };

      const leftStyle = (left < width - icon.width) ? { left: icon.left } : { right: 0 };
      const topStyle = (top < height - icon.height) ? { top: icon.top } : { bottom: 0 };
      const clickHandler = this._createOnIcon(index, handlers.onIcon);

      iconViews.push(
        <TouchableHighlight
          key={`iconTouchable${index}`}
          style={[iconStyle, leftStyle, topStyle]}
          onPress={clickHandler}
        >
          <Image
            key={`iconImage${index}`}
            style={{ flex: 1 }}
            source={{ uri: icon.url }}
          />
        </TouchableHighlight>,
      );
    }

    return iconViews;
  };

  render() {
    const {
      ad, config, lastPressedTime, playing, screenReaderEnabled,
    } = this.props;

    const isPastAutoHideTime = (new Date()).getTime() - lastPressedTime > AUTOHIDE_DELAY;
    const doesAdRequireControls = (ad && ad.requireControls);
    // TODO: IMA Ads UI is still not supported - No way to show UI while allowing Learn More in a clean way
    const isContent = !ad;
    const shouldShowControls = (screenReaderEnabled ? true : !isPastAutoHideTime
      && (doesAdRequireControls || isContent));

    let adBar;
    let adIcons;

    if (ad) {
      adBar = (ad.requireAdBar && config.adScreen.showAdMarquee) ? this._renderAdBar() : null;

      if (ad.icons) {
        adIcons = this._renderAdIcons();
      }
    }

    if (config.adScreen.showControlBar) {
      return (
        <View style={styles.adContainer}>
          {adBar}
          {this._renderPlaceholder(adIcons)}
          {this._renderPlayPause(shouldShowControls)}
          {this._renderBottomOverlay(shouldShowControls)}
        </View>
      );
    }

    return (
      <View style={styles.adContainer}>
        {adBar}
        {this._renderPlaceholder(adIcons)}
        {!playing && this._renderPlayPause(shouldShowControls)}
      </View>
    );
  }
}
