
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

var UpNext = React.createClass({
  propTypes: {
    config: React.PropTypes.object,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    ad: React.PropTypes.object,
    nextVideo: React.PropTypes.object,
    onPress: React.PropTypes.func,
    upNextDismissed: React.PropTypes.bool
  },

  dismissUpNext: function() {
    this.props.onPress("upNextDismiss");
  },

  clickUpNext: function() {
    this.props.onPress("upNextClick");
  },

  isWithinShowUpNextBounds: function() {
    if(this.props.config.timeToShow.indexOf('%', this.props.config.timeToShow.length - '%'.length) !== -1) {
      return (parseFloat(this.props.config.timeToShow.slice(0,-1) / 100) < (this.props.playhead / this.props.duration));
    }
    // else if we are given a number of seconds from end in which to show the upnext dialog.
    else {
      return parseInt(this.props.config.timeToShow) > this.props.duration - this.props.playhead;
    }
  },

  render: function() {

    if(this.isWithinShowUpNextBounds() && !this.props.upNextDismissed && this.props.config.showUpNext && !this.props.ad && this.props.nextVideo != null) {
      return (
        <View
          style={styles.container}>

          <TouchableHighlight style={styles.thumbnailContainer}
            onPress={this.clickUpNext}>
            <Image
              source={{uri: this.props.nextVideo.imageUrl}}
              style={styles.thumbnail} >
              <Text style={styles.countdownText}>{Math.floor(this.props.duration - this.props.playhead)}</Text>
            </Image>
          </TouchableHighlight>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{this.props.nextVideo.name}</Text>
            <Text style={styles.description}>{Utils.secondsToString(this.props.nextVideo.duration)}</Text>
          </View>
          <RectButton
            icon={"Dismiss"}
            onPress={this.dismissUpNext}
            style={styles.dismissButton}>
          </RectButton>
        </View>

      );
    }
    return null;
  }
});

module.exports = UpNext;