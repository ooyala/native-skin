import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  View,
  TouchableHighlight
} from 'react-native';

import {
  UI_SIZES,
  AUTOHIDE_DELAY,
  VALUES
} from '../../constants';
import Log from '../../lib/log';
import BottomOverlay from '../../shared/BottomOverlay';
import AdBar from './AdBar';
import VideoViewPlayPause from '../../shared/VideoViewPlayPause';
import * as Utils from '../../lib/utils';
import ResponsiveDesignManager from '../../lib/responsiveMultiplier';

import videoViewStyles from '../VideoView/VideoView.styles';
const styles = Utils.getStyles(videoViewStyles);

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
    handlers:  PropTypes.shape({
      onPress: PropTypes.func,
      onIcon: PropTypes.func,
      onScrub: PropTypes.func,
      handleVideoTouch: PropTypes.func,
      handleControlsTouch: PropTypes.func,
      onControlsVisibilityChanged: PropTypes.func.isRequired,
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

  state = {
    shouldShowControls: true
  };

  static defaultProps = {
    playhead: 0,
    buffered: 0,
    duration: 1
  };

  generateLiveObject = () => {
    if (this.props.live) {
      const isLive = this.props.playhead >= this.props.duration * VALUES.LIVE_THRESHOLD;
      return ({
        label:
          isLive ? Utils.localizedString(this.props.locale, 'LIVE', this.props.localizableStrings) :
          Utils.localizedString(this.props.locale, 'GO LIVE', this.props.localizableStrings),
        onGoLive: isLive? null : this.onGoLive});
    }
    return null;
  };

  onGoLive = () => {
    Log.log('onGoLive');
    if (this.props.handlers.onScrub) {
      this.props.handlers.onScrub(1);
    }
  };

  handlePress = (name) => {
    Log.verbose('VideoView Handle Press: ' + name);
    if (name == 'LIVE') {
      this.props.handlers.onScrub(1);
    } else {
      this.props.handlers.onPress(name);
    }
  };

  _createOnIcon = (index, func) => {
    return function() {
      func(index);
    }
  };

  _renderBottomOverlay() {
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
        isShow={this.state.shouldShowControls}
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
    return (
      <AdBar
        ad={this.props.ad}
        playhead={this.props.playhead}
        duration={this.props.duration}
        onPress={this.handlePress}
        width={this.props.width}
        localizableStrings={this.props.localizableStrings}
        locale={this.props.locale}>
      </AdBar>
    );
  };

  _renderPlaceholder = (adIcons) => {
    return (
      <View
        style={styles.placeholder}
        onTouchEnd={(event) => this.props.handlers.handleVideoTouch(event)}>
        {adIcons}
      </View>
    );
  };

  _renderPlayPause = () => {
    const iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
    return (
      <VideoViewPlayPause
        icons={{
          play: {
            icon: this.props.config.icons.play.fontString,
            fontFamily: this.props.config.icons.play.fontFamilyName
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
        position={'center'}
        onPress={(name) => this.handlePress(name)}
        frameWidth={this.props.width}
        frameHeight={this.props.height}
        buttonWidth={iconFontSize}
        buttonHeight={iconFontSize}
        fontSize={iconFontSize}
        showButton={this.state.shouldShowControls}
        rate={this.props.rate}
        playing={this.props.playing}
        loading={this.props.loading}
        initialPlay={this.props.initialPlay}>
      </VideoViewPlayPause>
    );
  };

  handleScrub = (value) => {
    this.props.handlers.onScrub(value);
  };

  handleTouchEnd = (event) => {
    this.props.handlers.handleVideoTouch();
  };

  _renderAdIcons = () => {
    let iconViews = [];
    for (let index in this.props.ad.icons) {
      const icon = this.props.ad.icons[index];
      if (this.props.playhead < icon.offset ||
          this.props.playhead > icon.offset + icon.duration) {
        continue;
      }
      const left = icon.x;
      const top = icon.y;
      const iconStyle = {position: 'absolute', width: icon.width, height: icon.height, backgroundColor: 'transparent'};

      const leftStyle = (left < this.props.width - icon.width) ? {left: icon.left} : {right: 0};
      const topStyle = (top < this.props.height - icon.height) ? {top: icon.top} : {bottom: 0};
      const clickHandler = this._createOnIcon(index, this.props.handlers.onIcon);

      iconViews.push(
        <TouchableHighlight
          key={'iconTouchable' + index}
          style={[iconStyle, leftStyle, topStyle]}
          onPress={clickHandler}>
            <Image
              key={'iconImage' + index}
              style={{flex: 1}}
              source={{uri: icon.url}}>
            </Image>
        </TouchableHighlight>
      );
    }
    return iconViews;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.shouldShowControls !== this.state.shouldShowControls) {
      this.props.handlers.onControlsVisibilityChanged(this.state.shouldShowControls);
    }
  }

  static getDerivedStateFromProps(props, state) {
    const isPastAutoHideTime = (new Date()).getTime() - props.lastPressedTime > AUTOHIDE_DELAY;
    const doesAdRequireControls = props.ad && props.ad.requireControls;
    // TODO: IMA Ads UI is still not supported - No way to show UI while allowing Learn More in a clean way
    const isContent = !props.ad;
    const isVisible = props.screenReaderEnabled ? true : !isPastAutoHideTime && (doesAdRequireControls || isContent);

    return ({
      shouldShowControls: isVisible
    });
  }

  render() {
    let adBar, adIcons;

    if (this.props.ad) {
      adBar = (this.props.ad.requireAdBar && this.props.config.adScreen.showAdMarquee) ? this._renderAdBar() : null;
      if (this.props.ad.icons) {
        adIcons = this._renderAdIcons();
      }
    }

    if (this.props.config.adScreen.showControlBar) {
      return (
        <View style={styles.adContainer}>
          {adBar}
          {this._renderPlaceholder(adIcons)}
          {this._renderPlayPause()}
          {this._renderBottomOverlay()}
        </View>
      );
    }

    return (
      <View style={styles.adContainer}>
        {adBar}
        {this._renderPlaceholder(adIcons)}
        {!this.props.playing && this._renderPlayPause()}
      </View>
    );
  }

}
