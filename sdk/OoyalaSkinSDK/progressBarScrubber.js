/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
} = React;

var ProgressBarScrubber = React.createClass({
  propTypes: {
    left: React.PropTypes.number,
    bottom: React.PropTypes.number
  },

  render: function() {
    var positionStyle={bottom:this.props.bottom, left:this.props.left}
    return (
      <Image
        source={{uri:"doc-gray-circle.png"}}
        style={[styles.container, positionStyle]} >
      </Image>);
  }
});

var styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 40,
    height: 40
  }
});

module.exports = ProgressBarScrubber;
