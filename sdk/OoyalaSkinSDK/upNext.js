
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  } = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/upNextStyles.json'));
var RectButton = require('./widgets/RectButton');
var Constants = require('./constants');
var {
  IMG_URLS
  } = Constants;

var UpNext = React.createClass({
  propTypes: {
    config: React.PropTypes.object,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    nextVideo: React.PropTypes.object,
    onUpNextClicked: React.PropTypes.func,
    onUpNextDismissed: React.PropTypes.func,
    upNextDismissed: React.PropTypes.bool
  },

  dismissUpNext: function() {
    this.props.onUpNextDismissed();
  },

  render: function() {
    var isWithinShowUpNextBounds;
    // If we are given a percentage of the video in which to show the upnext dialog.
    if(this.props.config.timeToShow < 1) {
      isWithinShowUpNextBounds = this.props.config.timeToShow < this.props.playhead / this.props.duration;
    }
    // else if we are given a number of seconds from end in which to show the upnext dialog.
    else {
      isWithinShowUpNextBounds = this.props.config.timeToShow > this.props.duration - this.props.playhead;
    }

    if(isWithinShowUpNextBounds && !this.props.upNextDismissed && this.props.config.showUpNext) {
      return (
        <View
          style={styles.container}>

          <TouchableHighlight style={styles.thumbnailContainer}
            onPress={() => this.props.onUpNextClicked()}>
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
            frameWidth={60}
            frameHeight={10}
            buttonWidth={60}
            buttonHeight={10}
            fontSize={15}>
          </RectButton>
        </View>

      );
    }
    return null;
  }
});

module.exports = UpNext;