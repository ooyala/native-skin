import PropTypes from 'prop-types';
import React from 'react';
import { Image, Text, View } from 'react-native';

import { BUTTON_NAMES, IMG_URLS, UI_SIZES } from '../../constants';
import responsiveMultiplier from '../../lib/responsiveMultiplier';
import VideoViewPlayPause from '../../shared/VideoViewPlayPause';

import styles from './StartScreen.styles';

export default class StartScreen extends React.Component {
  static propTypes = {
    config: PropTypes.object,
    title: PropTypes.string,
    description: PropTypes.string,
    promoUrl: PropTypes.string,
    onPress: PropTypes.func,
    playhead: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    screenReaderEnabled: PropTypes.bool,
  };

  handleClick = () => {
    const { onPress } = this.props;

    onPress(BUTTON_NAMES.PLAY);
  };

  // Gets the play button based on the current config settings
  getPlayButton = () => {
    const {
      config, height, playhead, screenReaderEnabled, width,
    } = this.props;

    const iconFontSize = responsiveMultiplier(width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);

    if (config.startScreen.showPlayButton) {
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
          position={config.startScreen.playButtonPosition}
          onPress={this.handleClick}
          buttonStyle={config.startScreen.playIconStyle}
          frameWidth={width}
          frameHeight={height}
          playhead={playhead}
          buttonWidth={iconFontSize}
          buttonHeight={iconFontSize}
          fontSize={iconFontSize}
          playing={false}
          showButton={!screenReaderEnabled}
          initialPlay
        />
      );
    }

    return null;
  };

  // Gets the infoPanel based on the current config settings
  getInfoPanel = () => {
    const { config, description, title } = this.props;

    let infoPanelTitle;
    let infoPanelDescription;
    let infoPanelLocation;

    if (config.startScreen.showTitle) {
      infoPanelTitle = (
        <Text style={[styles.infoPanelTitle, config.startScreen.titleFont]}>
          {title}
        </Text>
      );
    }

    if (config.startScreen.showDescription) {
      infoPanelDescription = (
        <Text style={[styles.infoPanelDescription, config.startScreen.descriptionFont]}>
          {description}
        </Text>
      );
    }

    switch (config.startScreen.infoPanelPosition) {
      case 'topLeft':
        infoPanelLocation = styles.infoPanelNW;
        break;

      case 'bottomLeft':
        infoPanelLocation = styles.infoPanelSW;
        break;

      default:
        throw new Error(`Invalid infoPanel location ${config.startScreen.infoPanelPosition}`);
    }

    return (
      <View style={infoPanelLocation}>
        {infoPanelTitle}
        {infoPanelDescription}
      </View>
    );
  };

  getPromoImage = () => {
    const {
      config, height, promoUrl, width,
    } = this.props;

    if (config.startScreen.showPromo && promoUrl) {
      const fullscreen = (config.startScreen.promoImageSize === 'default');

      return (
        <Image
          source={{ uri: promoUrl }}
          style={fullscreen
            ? {
              position: 'absolute',
              top: 0,
              left: 0,
              width,
              height,
            }
            : styles.promoImageSmall}
          resizeMode="contain"
        />
      );
    }

    return null;
  };

  getWaterMark = () => {
    const waterMarkImageLocation = styles.waterMarkImageSE;
    return (
      <Image
        style={[styles.waterMarkImage, waterMarkImageLocation]}
        source={{ uri: IMG_URLS.OOYALA_LOGO }}
        resizeMode="contain"
      />
    );
  };

  tapHandler = () => {
    const { screenReaderEnabled } = this.props;

    if (screenReaderEnabled) {
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
        accessible
        accessibilityLabel="Video player. Tap twice to play"
        style={styles.container}
        onTouchEnd={event => this.tapHandler(event)}
      >
        {promoImage}
        {waterMarkImage}
        {infoPanel}
        {playButton}
      </View>
    );
  }
}
