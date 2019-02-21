import PropTypes from 'prop-types';
import React from "react";
import {
  ActivityIndicator,
  Text,
  View,
  Image,
  TouchableHighlight,
  Platform
} from "react-native";

import {
  BUTTON_NAMES,
  UI_SIZES
} from '../constants';

const Utils = require("../utils");
const styles = Utils.getStyles(require("./style/endScreenStyles.json"));
const ResponsiveDesignManager = require('../responsiveDesignManager');
const InfoPanel = require("../infoPanel");
const BottomOverlay = require("../bottomOverlay");
const Log = require("../log");

class EndScreen extends React.Component {
  static propTypes = {
    config: PropTypes.object,
    title: PropTypes.string,
    duration: PropTypes.number,
    description: PropTypes.string,
    promoUrl: PropTypes.string,
    onPress: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    volume: PropTypes.number,
    upNextDismissed: PropTypes.bool,
    fullscreen: PropTypes.bool,
    handleControlsTouch: PropTypes.func,
    loading: PropTypes.bool,
    onScrub: PropTypes.func,
    showAudioAndCCButton: PropTypes.bool
  };

  state = {
    showControls:true,
  };

  handleClick = (name) => {
    this.props.onPress(name);
  };

  handleTouchEnd = (event) => {
    this.toggleControlBar();
  };

  handlePress = (name) => {
    Log.verbose("VideoView Handle Press: " + name);
    this.setState({lastPressedTime: new Date().getTime()});
    if (this.state.showControls) {
      if (name === "LIVE") {
        this.props.onScrub(1);
      } else {
        this.props.onPress(name);
      }
    } else {
      this.props.onPress(name);
    }
  };

  _renderDefaultScreen = (progressBar, controlBar) => {
    const endScreenConfig = this.props.config.endScreen || {};

    const replayMarginBottom = !this.props.config.controlBar.enabled ?
      ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT) : 1;

    const replayButtonLocation = styles.replayButtonCenter;
    let replayButton;

    if (endScreenConfig.showReplayButton) {
      const fontFamilyStyle = {fontFamily: this.props.config.icons.replay.fontFamilyName};
      replayButton = (
        <TouchableHighlight
          accessible={true} accessibilityLabel={BUTTON_NAMES.REPLAY} accessibilityComponentType="button"
          onPress={(name) => this.handleClick(BUTTON_NAMES.REPLAY)}
          underlayColor="transparent"
          activeOpacity={0.5}>
          <Text style={[styles.replayButton, fontFamilyStyle]}>{this.props.config.icons.replay.fontString}</Text>
        </TouchableHighlight>
      );
    }

    const title = endScreenConfig.showTitle ? this.props.title : null;
    const description = endScreenConfig.showDescription ? this.props.description : null;
    const infoPanel = (<InfoPanel title={title} description={description} />);

    return (
      <View style={[styles.fullscreenContainer, {width: this.props.width,height: this.props.height}]}>
        <Image
          source={{uri: this.props.promoUrl}}
          style={
            [styles.fullscreenContainer, {
              position: "absolute",
              top: 0,
              left: 0,
              width: this.props.width,
              height: this.props.height}]}
          resizeMode="contain">
        </Image>
        {infoPanel}
        <View style={[replayButtonLocation, {marginBottom: replayMarginBottom}]}>
          {replayButton}
        </View>
        <View style={styles.controlBarPosition}>
          {this._renderBottomOverlay(true)}
        </View>
      </View>
    );
  };

  handleScrub = (value) => {
    this.props.onScrub(value);
    this.handleClick(BUTTON_NAMES.PLAY_PAUSE);
  };

  _renderBottomOverlay = (show) => {
    return (<BottomOverlay
      width={this.props.width}
      height={this.props.height}
      primaryButton={"replay"}
      playhead={this.props.duration}
      duration={this.props.duration}
      volume={this.props.volume}
      onPress={(name) => this.handlePress(name)}
      shouldShowProgressBar={true}
      showWatermark={this.props.showWatermark}
      handleControlsTouch={() => this.props.handleControlsTouch()}
      onScrub={(value)=>this.handleScrub(value)}
      fullscreen={this.props.fullscreen}
      isShow={show}
      loading={this.props.loading}
      showAudioAndCCButton={this.props.showAudioAndCCButton}
      config={{
        controlBar: this.props.config.controlBar,
        buttons: this.props.config.buttons,
        icons: this.props.config.icons,
        live: this.props.config.live,
        general: this.props.config.general
      }} />);
  };

  _renderLoading ()  {
    const loadingSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.LOADING_ICON);
    const scaleMultiplier = Platform.OS === 'android' ? 2 : 1;
    const topOffset = Math.round((this.props.height - loadingSize * scaleMultiplier) * 0.5);
    const leftOffset = Math.round((this.props.width - loadingSize * scaleMultiplier) * 0.5);
    const loadingStyle = {
      position: 'absolute',
      top: topOffset,
      left: leftOffset,
      width: loadingSize,
      height: loadingSize
    };
    if (this.props.loading) {
      return (
        <ActivityIndicator
          style={loadingStyle}
          size="large"
        />
      );
    }
  };

  render() {
    return (
      <View accessible={false} style={styles.container}>
        {this._renderDefaultScreen()}
        {this._renderLoading()}
      </View>
    );
  }

}

module.exports = EndScreen;
