
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

var descriptionMinWidth = 140;
var thumbnailWidth = 175;
var dismissButtonWidth = 80;

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

  isWithinShowUpNextBounds: function() {
    if(this.props.config.upNext.timeToShow.indexOf('%', this.props.config.upNext.timeToShow.length - '%'.length) !== -1) {
      return (parseFloat(this.props.config.upNext.timeToShow.slice(0,-1) / 100) < (this.props.playhead / this.props.duration));
    }
    // else if we are given a number of seconds from end in which to show the upnext dialog.
    else {
      return parseInt(this.props.config.upNext.timeToShow) > this.props.duration - this.props.playhead;
    }
  },

  render: function() {

    if(this.isWithinShowUpNextBounds() && !this.props.upNextDismissed && this.props.config.upNext.showUpNext && !this.props.ad && this.props.nextVideo != null) {

      var upNextImage = (
      <TouchableHighlight style={[styles.thumbnailContainer, {width: thumbnailWidth}]}
        onPress={this.clickUpNext}>
        <Image
          source={{uri: this.props.nextVideo.imageUrl}}
          style={styles.thumbnail} >
          <Text style={[{fontFamily: this.props.config.icons.play.fontFamilyName, color: "white"}, styles.countdownText]}>{this.props.config.icons.play.fontString}</Text>
        </Image>
      </TouchableHighlight>
      );
      var upNextDescription = (
        <View style={styles.textContainer}>
          <Text style={styles.title}>{Math.floor(this.props.duration - this.props.playhead)} Up next: {this.props.nextVideo.name}</Text>
          <Text style={styles.description}>{Utils.secondsToString(this.props.nextVideo.duration)}</Text>
        </View>
      );
      var upNextDismissButton = (
        <RectButton
          icon={"Dismiss"}
          onPress={this.dismissUpNext}
          style={[styles.dismissButton, {width: dismissButtonWidth}]}>
        </RectButton>
      );

      if (this.props.width < descriptionMinWidth + thumbnailWidth + dismissButtonWidth) {
        return (
          <View style={styles.container}>
          {upNextImage}
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