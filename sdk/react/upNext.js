
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  } = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/upNext.json'));
var RectButton = require('./widgets/RectButton');
var CountdownView = require('./widgets/countdownTimer');
var ResponsiveDesignManager = require('./responsiveDesignManager');

var descriptionMinWidth = 140;
var thumbnailWidth = 175;
var dismissButtonWidth = 10;

var UpNext = React.createClass({
  propTypes: {
    config: React.PropTypes.object,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    ad: React.PropTypes.object,
    nextVideo: React.PropTypes.object,
    onPress: React.PropTypes.func,
    upNextDismissed: React.PropTypes.bool,
    width: React.PropTypes.number
  },

  dismissUpNext: function() {
    this.props.onPress("upNextDismiss");
  },

  clickUpNext: function() {
    this.props.onPress("upNextClick");
  },

  upNextDuration: function() {

    if(this.props.config.upNext.timeToShow.indexOf('%') >= 0) {
      return (this.props.duration - parseFloat(this.props.config.upNext.timeToShow.slice(0,-1) / 100) * this.props.duration);
    }
    // else if we are given a number of seconds from end in which to show the upnext dialog.
    else {
      return parseInt(this.props.config.upNext.timeToShow);
    }
  },

  isWithinShowUpNextBounds: function() {
    return parseInt(this.upNextDuration()) > this.props.duration - this.props.playhead;
  },

  render: function() {

    if(this.isWithinShowUpNextBounds() && !this.props.upNextDismissed && this.props.config.upNext.showUpNext && !this.props.ad && this.props.nextVideo != null) {
      var upNextWidth = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, thumbnailWidth, [0.8,1], [520]);

      var upNextImage = (
      <TouchableHighlight style={[styles.thumbnailContainer, {width: upNextWidth}]}
        onPress={this.clickUpNext}>
        <Image
          source={{uri: this.props.nextVideo.imageUrl}}
          style={[styles.thumbnail, {width: upNextWidth}]} >
          <Text style={[{fontFamily: this.props.config.icons.play.fontFamilyName, color: "white"}, styles.countdownText]}>{this.props.config.icons.play.fontString}</Text>
        </Image>
      </TouchableHighlight>
      );
      var upNextDescription = (
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <CountdownView style={{
              width: 26,
              height: 26,
            }}
            automatic={false}
            time={this.upNextDuration()}
            timeLeft={this.props.duration - this.props.playhead}
            radius={13}
            fillAlpha={0.7} />
            <Text style={styles.title}>
              Up next: {this.props.nextVideo.name}
            </Text>
          </View>
        </View>
      );
      var upNextDismissButton = (
        <RectButton
          icon={"X"}
          onPress={this.dismissUpNext}
          style={[styles.dismissButton, {width: dismissButtonWidth}]}>
        </RectButton>
      );

      if (this.props.width < descriptionMinWidth + upNextWidth + dismissButtonWidth) {
        return (
          <View style={styles.container}>
            {upNextImage}
            <View style={{flex: 5}}></View>
            {upNextDismissButton}
          </View>
        );
      }
      else {
        return (
          <View style={styles.container}>
            {upNextImage}
            {upNextDescription}
            {upNextDismissButton}
          </View>
        );
      }

    }
    return null;
  }
});

module.exports = UpNext;