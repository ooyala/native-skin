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
  getInitialState: function() {
    return {showControls:true};
  },

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

  toggleControlBar: function() {
    console.log("toggleControlBar pressed")
    var showControls = !this.state.showControls;
    this.setState({showControls:showControls});
  },

  render: function() {
    var progressBar;
    var controlBar;
    if (this.state.showControls) {
      progressBar = (<ProgressBar playhead={this.props.playhead} duration={this.props.duration} />);
      controlBar = (
        <ControlBar showPlay={this.props.showPlay} isPlayEnd={false} playhead={this.props.playhead} duration={this.props.duration} onPress={(name) => this.handlePress(name)} />
        );
    }
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <TouchableHighlight style={styles.placeholder} onPress={this.toggleControlBar}>
            <View />
          </TouchableHighlight>
        </View>
        {progressBar}
        {controlBar}
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
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
});

module.exports = VideoView
