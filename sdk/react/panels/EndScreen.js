import PropTypes from 'prop-types';
import React, { Component } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from "react-native";

var Utils = require("../utils");


var styles = Utils.getStyles(require("./style/endScreenStyles.json"));
var ResponsiveDesignManager = require('../responsiveDesignManager');
var ProgressBar = require("../progressBar");
var ControlBar = require("../controlBar");
var WaterMark = require("../waterMark");
var InfoPanel = require("../infoPanel");
var BottomOverlay = require("../bottomOverlay");
var Log = require("../log");
var Constants = require("../constants");

var {
  BUTTON_NAMES,
  IMG_URLS
} = Constants;

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
    var endScreenConfig = this.props.config.endScreen || {};
    var replaybuttonLocation = styles.replaybuttonCenter;
    var replaybutton;
    if(endScreenConfig.showReplayButton) {
      var fontFamilyStyle = {fontFamily: this.props.config.icons.replay.fontFamilyName};
      replaybutton = (
        <TouchableHighlight 
          accessible={true} accessibilityLabel={BUTTON_NAMES.REPLAY} accessibilityComponentType="button"
          onPress={(name) => this.handleClick("PlayPause")}
          underlayColor="transparent"
          activeOpacity={0.5}>
          <Text style={[styles.replaybutton, fontFamilyStyle]}>{this.props.config.icons.replay.fontString}</Text>
        </TouchableHighlight>
      );
    }

    var title = endScreenConfig.showTitle ? this.props.title : null;
    var description = endScreenConfig.showDescription ? this.props.description : null;
    var infoPanel =
      (<InfoPanel title={title} description={description} />);

    return (
      <View
        style={styles.fullscreenContainer}>
        <Image
        source={{uri: this.props.promoUrl}}
        style={[styles.fullscreenContainer,{position:"absolute", top:0, left:0, width:this.props.width, height: this.props.height}]}
        resizeMode={Image.resizeMode.contain}>
        </Image>
        {infoPanel}
        <View style={replaybuttonLocation}>
          {replaybutton}
        </View>
        <View style={styles.controlBarPosition}>
          {this._renderBottomOverlay(true)}
        </View>
      </View>
    );
  };

  handleScrub = (value) => {
    this.props.onScrub(value);
  };

  _renderBottomOverlay = (show) => {
    var shouldShowClosedCaptionsButton =
      this.props.availableClosedCaptionsLanguages &&
      this.props.availableClosedCaptionsLanguages.length > 0;
      Log.log("duration: " +this.props.duration)
    return (<BottomOverlay
      width={this.props.width}
      height={this.props.height}
      primaryButton={"replay"}
      playhead={this.props.duration}
      duration={this.props.duration}
      platform={this.props.platform}
      volume={this.props.volume}
      onPress={(name) => this.handlePress(name)}
      shouldShowProgressBar={true}
      showWatermark={this.props.showWatermark}
      handleControlsTouch={() => this.props.handleControlsTouch()}
      onScrub={(value)=>this.handleScrub(value)}
      fullscreen={this.props.fullscreen}
      isShow={show}
      loading={this.props.loading}
      config={{
        controlBar: this.props.config.controlBar,
        buttons: this.props.config.buttons,
        icons: this.props.config.icons,
        live: this.props.config.live,
        general: this.props.config.general
      }} />);
  };

  _renderLoading ()  {
    var loadingSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.LOADING_ICON);
    var scaleMultiplier = this.props.platform == Constants.PLATFORMS.ANDROID ? 2 : 1;
    var topOffset = Math.round((this.props.height - loadingSize * scaleMultiplier) * 0.5);
    var leftOffset = Math.round((this.props.width - loadingSize * scaleMultiplier) * 0.5);
    var loadingStyle = {
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
      <View
      accessible={false}
      style={styles.container}>
      {this._renderDefaultScreen()}
      {this._renderLoading()}
    </View>
    );
  }
}

module.exports = EndScreen;
