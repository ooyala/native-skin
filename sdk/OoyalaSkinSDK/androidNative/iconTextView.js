// IconTextView.js

var { requireNativeComponent } = require('react-native');
var React = require('react-native');

var icon = {
  name: 'IconTextView',
  propTypes: {
    fontFamily: React.PropTypes.string,
    scaleX: 	React.PropTypes.number,
    scaleY: 	React.PropTypes.number,
    translateX: React.PropTypes.number,
    translateY: React.PropTypes.number,
    rotation: 	React.PropTypes.number,
    opacity: 	React.PropTypes.number,
    backgroundColor: React.PropTypes.number,
  },
};

module.exports = requireNativeComponent('RCTIconTextView', icon);