/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {
  View,
  StyleSheet
} = React;

var ProgressBar = require('./progressBar');
var ControlBar = require('./controlBar');

var VideoView = React.createClass({

  render: function() {
    var played = 0.4;
    var buffered = 0.1;

    return (
      <View style={styles.container}>
        <ProgressBar played={played} buffered={buffered}>
        </ProgressBar>
        <ControlBar />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
});

module.exports = VideoView
