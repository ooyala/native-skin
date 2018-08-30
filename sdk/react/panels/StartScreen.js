import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';

const Utils = require('../utils');
const Log = require('../log');
const styles = Utils.getStyles(require('./style/startScreenStyles.json'));
const Constants = require('../constants');
const {
  PLATFORMS,
  IMG_URLS,
  UI_SIZES,
  BUTTON_NAMES,
} = Constants;

const RectButton = require('../widgets/RectButton');
const VideoViewPlayPause = require('../widgets/VideoViewPlayPause');
const ResponsiveDesignManager = require('../responsiveDesignManager');

class StartScreen extends React.Component {
  static propTypes = {
    config: PropTypes.object,
    title: PropTypes.string,
    description: PropTypes.string,
    promoUrl: PropTypes.string,
    onPress: PropTypes.func,
    playhead: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    platform: PropTypes.string,
    screenReaderEnabled: PropTypes.bool,
  };

  handleClick = () => {
    this.props.onPress(BUTTON_NAMES.PLAY);
  };

  // Gets the play button based on the current config settings
  getPlayButton = () => {
    const iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);

    if (this.props.config.startScreen.showPlayButton) {
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
          position={this.props.config.startScreen.playButtonPosition}
          onPress={this.handleClick}
          buttonStyle={this.props.config.startScreen.playIconStyle}
          frameWidth={this.props.width}
          frameHeight={this.props.height}
          playhead={this.props.playhead}
          buttonWidth={iconFontSize}
          buttonHeight={iconFontSize}
          platform={this.props.platform}
          fontSize={iconFontSize}
          playing={false}
          showButton={!this.props.screenReaderEnabled}
          initialPlay={true}/>
      );
    }
  };

  //Gets the infoPanel based on the current config settings
  getInfoPanel = () => {
    let infoPanelTitle;
    if (this.props.config.startScreen.showTitle) {
      infoPanelTitle = (
        <Text style={[styles.infoPanelTitle, this.props.config.startScreen.titleFont]}>
          {this.props.title}
        </Text>);
    }
    let infoPanelDescription;
    if (this.props.config.startScreen.showDescription) {
      infoPanelDescription = (
        <Text style={[styles.infoPanelDescription, this.props.config.startScreen.descriptionFont]}>
          {this.props.description}
        </Text>);
    }

    let infoPanelLocation;
    switch (this.props.config.startScreen.infoPanelPosition) {
      case "topLeft":
        infoPanelLocation = styles.infoPanelNW;
        break;
      case "bottomLeft":
        infoPanelLocation = styles.infoPanelSW;
        break;
      default:
        throw("Invalid infoPanel location " + this.props.config.startScreen.infoPanelPosition);
    }

    return (
      <View style={infoPanelLocation}>
        {infoPanelTitle}
        {infoPanelDescription}
      </View>
    );
  };

  getPromoImage = () => {
    if (this.props.config.startScreen.showPromo && this.props.promoUrl) {
      const fullscreen = (this.props.config.startScreen.promoImageSize === 'default');

      return (
        <Image
          source={{uri: this.props.promoUrl}}
          style={fullscreen ?
            {position: 'absolute', top: 0, left: 0, width: this.props.width, height: this.props.height} :
            styles.promoImageSmall}
          resizeMode={Image.resizeMode.contain}>
        </Image>
      );
    }

    return null;
  };

  getWaterMark = () => {
    const waterMarkImageLocation = styles.waterMarkImageSE;
    return (
      <Image style={[styles.waterMarkImage, waterMarkImageLocation]}
             source={{uri: IMG_URLS.OOYALA_LOGO}}
             resizeMode={Image.resizeMode.contain}>
      </Image>
    );
  };

  _tapHandler = (event) => {
    if (this.props.screenReaderEnabled) {
      this.handleClick();
    }
  };

  render() {
    const promoImage = this.getPromoImage();
    const playButton = this.getPlayButton();
    const infoPanel = this.getInfoPanel();
    const waterMarkImage = this.getWaterMark();


    return (
      <View
        reactTag={1}
        accessible={true}
        accessibilityLabel={"Video player. Tap twice to play"}
        style={styles.container}
        onTouchEnd={(event) => this._tapHandler(event)}>
        {promoImage}
        {waterMarkImage}
        {infoPanel}
        {playButton}
      </View>
    );

  }
}

module.exports = StartScreen;
