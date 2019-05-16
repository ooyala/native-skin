import PropTypes from 'prop-types';
import React from 'react';
import { Image, TouchableHighlight, View } from 'react-native';

import AdBar from './AdBar';
import { AUTOHIDE_DELAY, UI_SIZES, VALUES } from '../../constants';
import * as Log from '../../lib/log';
import responsiveMultiplier from '../../lib/responsiveMultiplier';
import * as Utils from '../../lib/utils';
import BottomOverlay from '../../shared/BottomOverlay';
import VideoViewPlayPause from '../../shared/VideoViewPlayPause';

import styles from './AdPlaybackScreen.styles';

export default class AdPlaybackScreen extends React.Component {
  static propTypes = {
    rate: PropTypes.number,
    playhead: PropTypes.number,
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
      onControlsVisibilityChanged: PropTypes.func.isRequired,
    }),
    // The following props are used in static `getDerivedStateFromProps` only, that's why they are considered unused by
    // ESLint. Should be fixed by ESLint team.
    lastPressedTime: PropTypes.any, // eslint-disable-line react/no-unused-prop-types
    screenReaderEnabled: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    showWatermark: PropTypes.bool,
    config: PropTypes.object,
    localizableStrings: PropTypes.object,
    locale: PropTypes.string,
    playing: PropTypes.bool,
    loading: PropTypes.bool,
    initialPlay: PropTypes.bool,
    markers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  static defaultProps = {
    playhead: 0,
    duration: 1,
  };

  constructor(props) {
    super(props);

    this.state = {
      shouldShowControls: true,
    };
  }

  static getDerivedStateFromProps(props) {
    const isPastAutoHideTime = (new Date()).getTime() - props.lastPressedTime > AUTOHIDE_DELAY;
    const doesAdRequireControls = props.ad && props.ad.requireControls;
    // TODO: IMA Ads UI is still not supported - No way to show UI while allowing Learn More in a clean way
    const isContent = !props.ad;
    const isVisible = props.screenReaderEnabled ? true : !isPastAutoHideTime && (doesAdRequireControls || isContent);

    return {
      shouldShowControls: isVisible,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { handlers } = this.props;
    const { shouldShowControls } = this.state;

    if (prevState.shouldShowControls !== shouldShowControls) {
      handlers.onControlsVisibilityChanged(shouldShowControls);
    }
  }

  generateLiveObject = () => {
    const {
      duration, live, locale, localizableStrings, playhead,
    } = this.props;

    if (!live) {
      return null;
    }

    const isLive = playhead >= duration * VALUES.LIVE_THRESHOLD;

    return {
      label: Utils.localizedString(locale, isLive ? 'LIVE' : 'GO LIVE', localizableStrings),
      onGoLive: isLive ? null : this.onGoLive,
    };
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

    Log.verbose(`VideoView Handle Press: ${name}`);
    if (name === 'LIVE') {
      handlers.onScrub(1);
    } else {
      handlers.onPress(name);
    }
  };

  handleScrub = (value) => {
    const { handlers } = this.props;

    handlers.onScrub(value);
  };

  handleTouchEnd = () => {
    const { handlers } = this.props;

    handlers.handleVideoTouch();
  };

  createOnIcon = (index, func) => () => {
    func(index);
  };

  renderBottomOverlay() {
    const {
      ad, config, cuePoints, duration, fullscreen, handlers, height, markers, playhead, playing, showWatermark, volume,
      width,
    } = this.props;
    const { shouldShowControls } = this.state;

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
        isShow={shouldShowControls}
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

  renderAdBar = () => {
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

  renderPlaceholder = (adIcons) => {
    const { handlers } = this.props;

    return (
      <View onTouchEnd={event => handlers.handleVideoTouch(event)} style={styles.placeholder}>
        {adIcons}
      </View>
    );
  };

  renderPlayPause = () => {
    const {
      config, height, initialPlay, loading, playing, rate, width,
    } = this.props;
    const { shouldShowControls } = this.state;

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
        showButton={shouldShowControls}
        rate={rate}
        playing={playing}
        loading={loading}
        initialPlay={initialPlay}
      />
    );
  };

  renderAdIcons = () => {
    const {
      ad, handlers, height, playhead, width,
    } = this.props;

    const iconViews = [];

    for (const index in ad.icons) { // eslint-disable-line no-restricted-syntax
      if (Object.prototype.hasOwnProperty.call(ad.icons, index)) {
        const icon = ad.icons[index];

        if (!(playhead < icon.offset || playhead > icon.offset + icon.duration)) {
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
          const clickHandler = this.createOnIcon(index, handlers.onIcon);

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
      }
    }

    return iconViews;
  };

  render() {
    const { ad, config, playing } = this.props;

    let adBar;
    let adIcons;

    if (ad) {
      adBar = (ad.requireAdBar && config.adScreen.showAdMarquee) ? this.renderAdBar() : null;

      if (ad.icons) {
        adIcons = this.renderAdIcons();
      }
    }

    if (config.adScreen.showControlBar) {
      return (
        <View style={styles.adContainer}>
          {adBar}
          {this.renderPlaceholder(adIcons)}
          {this.renderPlayPause()}
          {this.renderBottomOverlay()}
        </View>
      );
    }

    return (
      <View style={styles.adContainer}>
        {adBar}
        {this.renderPlaceholder(adIcons)}
        {!playing && this.renderPlayPause()}
      </View>
    );
  }
}
