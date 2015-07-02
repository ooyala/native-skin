
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
    onClickAction: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      showUpNext:false,
      isDismissed:false
    };
  },

  componentWillReceiveProps: function(nextProps) {

    // If we are given a percentage of the video in which to show the upnext dialog.
    if(nextProps.config.timeToShow < 1) {
      this.setState({showUpNext: nextProps.config.timeToShow < nextProps.playhead / nextProps.duration});
    }
    // else if we are given a number of seconds from end in which to show the upnext dialog.
    else {
      this.setState({showUpNext: nextProps.config.timeToShow > nextProps.duration - nextProps.playhead});
    }
  },

  dismissUpNext: function() {
    this.setState({isDismissed: true});
  },

  render: function() {
    if(this.state.showUpNext && !this.state.isDismissed) {
      return (
        <View
          style={styles.container}>

          <TouchableHighlight
            onPress={() => this.props.onClickAction({action:"click", embedCode:this.props.nextVideo.embedCode, bucketInfo:this.props.nextVideo.bucketInfo})}>
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