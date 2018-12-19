'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  Image,
  View,
  TouchableHighlight
} from 'react-native';

import {
  UI_SIZES,
  AUTOHIDE_DELAY,
  VALUES
} from '../constants';

import Log from '../log';

const BottomOverlay = require('../bottomOverlay');
const AdBar = require('../adBar');
const VideoViewPlayPause = require('../widgets/VideoViewPlayPause');
const Utils = require('../utils');
const styles = Utils.getStyles(require('./style/videoViewStyles.json'));
const ResponsiveDesignManager = require('../responsiveDesignManager');

class AdPlaybackScreen extends React.Component {
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
  };

  state = {
    showControls:true,
  };

  static defaultProps = {playhead: 0, buffered: 0, duration: 1};

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
    if (this.state.showControls) {
      if (name == 'LIVE') {
        this.props.handlers.onScrub(1);
      } else {
        this.props.handlers.onPress(name);
      }
    } else {
      this.props.handlers.onPress(name);
    }
  };

  _createOnIcon = (index, func) => {
    return function() {
      func(index);
    }
  };

  _renderBottomOverlay = (show) => {
    return (
      <BottomOverlay
        width={this.props.width}
        height={this.props.height}
        primaryButton={!this.props.playing ? 'play' : 'pause'}
        fullscreen = {this.props.fullscreen}
        cuePoints = {this.props.cuePoints}
        playhead={this.props.playhead}
        duration={this.props.duration}
        ad={this.props.ad}
        volume={this.props.volume}
        live={this.generateLiveObject()}
        onPress={(name) => this.handlePress(name)}
        onScrub={(value)=>this.handleScrub(value)}
        handleControlsTouch={() => this.props.handlers.handleControlsTouch()}
        showClosedCaptionsButton={false}
        showWatermark={this.props.showWatermark}
        isShow={show}
        config={{
          controlBar: this.props.config.controlBar,
          buttons: this.props.config.buttons,
          icons: this.props.config.icons,
          live: this.props.config.live,
          general: this.props.config.general
        }}
        showMoreOptionsButton={false}
        showAudioAndCCButton={false}
        showPlaybackSpeedButton={false}>
      </BottomOverlay>
    );
  };

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

  _renderPlayPause = (show) => {
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
        showButton={show}
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
    for (const index in this.props.ad.icons) {
      const icon = this.props.ad.icons[index];
      if ((this.props.playhead < icon.offset) || (this.props.playhead > (icon.offset + icon.duration))) {
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

  render() {
    const isPastAutoHideTime = (new Date).getTime() - this.props.lastPressedTime > AUTOHIDE_DELAY;
    const doesAdRequireControls = this.props.ad && this.props.ad.requireControls;
    // TODO: IMA Ads UI is still not supported - No way to show UI while allowing Learn More in a clean way
    // var isAdPaused = this.props.ad && !this.props.playing;
    const isContent = !this.props.ad;
    const shouldShowControls = this.props.screenReaderEnabled ? true : !isPastAutoHideTime && (doesAdRequireControls || isContent);

    let adBar;
    let adIcons;

    if (this.props.ad) {
      adBar = (this.props.ad.requireAdBar && this.props.config.adScreen.showAdMarquee) ? this._renderAdBar() : null;
      if (this.props.ad.icons) {
        adIcons = this._renderAdIcons();
      }
    }

    if (!this.props.config.adScreen.showControlBar) {
      let playButtonIfPaused;
      if (!this.props.playing) {
        playButtonIfPaused = this._renderPlayPause(shouldShowControls)
      }
      return (
        <View style={styles.adContainer}>
          {adBar}
          {this._renderPlaceholder(adIcons)}
          {playButtonIfPaused}
        </View>
      );
    } else {
      return (
        <View style={styles.adContainer}>
          {adBar}
          {this._renderPlaceholder(adIcons)}
          {this._renderPlayPause(shouldShowControls)}
          {this._renderBottomOverlay(shouldShowControls)}
        </View>
      );
    }
  }

}

module.exports = AdPlaybackScreen;
