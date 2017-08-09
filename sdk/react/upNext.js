import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";

var Constants = require('./constants');
var {
  BUTTON_NAMES
} = Constants;

var Utils = require("./utils");

var styles = Utils.getStyles(require("./style/upNext.json"));
var CountdownView = require("./widgets/countdownTimer");
var CountdownViewAndroid = require("./widgets/countdownTimerAndroid");
var ResponsiveDesignManager = require("./responsiveDesignManager");
var Constants = require("./constants");

var descriptionMinWidth = 140;
var thumbnailWidth = 175;
var dismissButtonWidth = 10;
var defaultCountdownVal = 10;

var UpNext = React.createClass({
  propTypes: {
    config: React.PropTypes.object,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    ad: React.PropTypes.object,
    nextVideo: React.PropTypes.object,
    onPress: React.PropTypes.func,
    upNextDismissed: React.PropTypes.bool,
    width: React.PropTypes.number,
    platform:React.PropTypes.string
  },

  dismissUpNext: function() {
    this.props.onPress("upNextDismiss");
  },

  clickUpNext: function() {
    this.props.onPress("upNextClick");
  },

  upNextDuration: function() {
    var upNextConfig = this.props.config.upNext || {};
    // TODO: Unit test this functionality, there're still some edge cases
    if (typeof upNextConfig.timeToShow === "string") {
      // Support old version of percentage (e.g. "80%")
      if (upNextConfig.timeToShow.indexOf("%") >= 0) {
        return (this.props.duration - parseFloat(upNextConfig.timeToShow.slice(0,-1) / 100) * this.props.duration);
      }
      else if (isNaN(upNextConfig.timeToShow)) {
        // The string is not a valid number
        return defaultCountdownVal;
      } else {
        // if we are given a number of seconds from end in which to show the upnext dialog.
        return parseInt(upNextConfig.timeToShow);
      }
    } else if (typeof upNextConfig.timeToShow === "number"){
      if (upNextConfig.timeToShow > 0.0 && upNextConfig.timeToShow <= 1.0) {
        // New percentage mode (e.g. 0.8)
        return this.props.duration - upNextConfig.timeToShow * this.props.duration;
      } else if (upNextConfig.timeToShow > 1.0) {
        // Normal number (e.g. 15)
        return upNextConfig.timeToShow;
      } else {
        // 0 or negative number
        return defaultCountdownVal;
      }
    } else {
      // Not a valid string nor number, return default.
      return defaultCountdownVal;
    }
  },

  isWithinShowUpNextBounds: function() {
    return parseInt(this.upNextDuration()) > this.props.duration - this.props.playhead;
  },

  _renderDismissButton: function() {
    return (<TouchableHighlight 
      accessible={true} accessibilityLabel={BUTTON_NAMES.DISMISS} accessibilityComponentType="button"
      onPress={this.dismissUpNext}
      underlayColor="transparent"
      style={styles.dismissButtonContainer}>
      <Text style={[
        styles.dismissButton,
        {fontFamily: this.props.config.icons.dismiss.fontFamilyName}
      ]}>{this.props.config.icons.dismiss.fontString}</Text>
    </TouchableHighlight>);
  },


  renderCountdownTimer: function() {
    if(this.props.platform == Constants.PLATFORMS.ANDROID) {
      return <CountdownViewAndroid style={styles.countdownView}
        countdown={{
          main_color:"#AAffffff",
          secondary_color:"#AA808080",
          fill_color:"#AA000000",
          text_color:"#AAffffff",
          stroke_width:5,
          text_size:25,
          max_time:this.upNextDuration(),
          progress:parseInt((this.upNextDuration() - (this.props.duration-this.props.playhead))),
          automatic:false}}/>
    }
    if(this.props.platform == Constants.PLATFORMS.IOS) {
      return <CountdownView style={styles.countdownView}
        automatic={false}
        time={this.upNextDuration()}
        timeLeft={this.props.duration - this.props.playhead}
        radius={9}
        fillAlpha={0.7} />
    }
  },


  render: function() {
    var upNextConfig = this.props.config.upNext || {};
    if(this.isWithinShowUpNextBounds() && !this.props.upNextDismissed && upNextConfig.showUpNext === true && !this.props.ad && this.props.nextVideo != null) {
      var countdown = this.renderCountdownTimer();
      var upNextImage = (
        <Image
          source={{uri: this.props.nextVideo.imageUrl}}
          style={styles.thumbnail} >
          <TouchableHighlight style={styles.thumbnail}
            onPress={this.clickUpNext}>
            <Text style={styles.countdownText}>{this.props.config.icons.play.fontString}</Text>
          </TouchableHighlight>
        </Image>
      );

      var upNextDescription = (
        <View style={styles.textContainer}>
          {countdown}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              Up next: {this.props.nextVideo.name}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {this.props.nextVideo.description}
            </Text>
          </View>
        </View>
      );
      var upNextDismissButton = this._renderDismissButton();
        return (
          <View style={styles.container}>
            {upNextImage}
            {upNextDescription}
            {upNextDismissButton}
          </View>
        );
      }
    return null;
  },
});

module.exports = UpNext;
