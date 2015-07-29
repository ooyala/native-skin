var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated
  } = React;

var styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));

var VideoViewPlayPause = React.createClass({
  propTypes: {
    icon: React.PropTypes.string,
    position: React.PropTypes.string,
    onPress: React.PropTypes.func,
    opacity: React.PropTypes.number,
    frameWidth: React.PropTypes.number,
    frameHeight: React.PropTypes.number,
    buttonWidth: React.PropTypes.number,
    buttonHeight: React.PropTypes.number,
    buttonColor: React.PropTypes.string,
    buttonStyle: React.PropTypes.object,
    fontSize: React.PropTypes.number,
    fontFamily: React.PropTypes.string,
    style:React.PropTypes.object,
    animation: React.PropTypes.object,
    animationTrigger: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      animationScale: new Animated.Value(1)
    };
  },

  onPress: function() {
    Animated.decay(this.state.animationScale, {
      toValue: 1,
      velocity: 0.1
    }).start();
    this.props.onPress();
  },

  componentDidUpdate: function(prevProps, prevState) {
    if(this.props.animationTrigger != prevProps.animationTrigger) {
      this.state.animationScale.setValue(1);
      Animated.decay(this.state.animationScale, {
        toValue: 1,
        velocity: 1
      }).start();
    }
  },

  // Gets the play button based on the current config settings
  render: function() {
    var fontStyle = {fontSize: this.props.fontSize, fontFamily: this.props.fontFamily};
    var sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    var opacity = {transform: [{scale: this.state.animationScale}]};
    var buttonColor = {color: this.props.buttonColor == null? "white": this.props.buttonColor};

    return (
      <TouchableHighlight
        onPress={this.onPress}
        underlayColor="transparent"
        activeOpacity={this.props.opacity}>
        <View style={[styles.buttonArea, sizeStyle]}>
          <Animated.Text style={[styles.buttonTextStyle, fontStyle, buttonColor, this.props.buttonStyle, opacity]}>{this.props.icon}</Animated.Text>
        </View>
      </TouchableHighlight>);
  },
});

module.exports = VideoViewPlayPause;