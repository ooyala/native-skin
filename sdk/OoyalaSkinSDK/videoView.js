/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {
  View,
  TouchableHighlight,
  StyleSheet
} = React;

var ProgressBar = require('./progressBar');
var ControlBar = require('./controlBar');

var VideoView = React.createClass({
  propTypes: {
    showPlay: React.PropTypes.bool,
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
    onPress: React.PropTypes.func,
  },

  handlePress: function(name) {
    this.props.onPress(name);
  },

  getDefaultProps: function() {
    return {showPlay: true, playhead: 0, buffered: 0, duration: 1};
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder} />
        <ProgressBar playhead={this.props.playhead} duration={this.props.duration} />
        <ControlBar showPlay={this.props.showPlay} playhead={this.props.playhead} duration={this.props.duration} onPress={(name) => this.handlePress(name)} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  placeholder : {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

module.exports = VideoView
