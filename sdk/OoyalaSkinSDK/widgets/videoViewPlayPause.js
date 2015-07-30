var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated
  } = React;

var Constants = require('../constants');
var {
  BUTTON_NAMES
} = Constants;

// Uses the rectbutton styles
var styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));

var VideoViewPlayPause = React.createClass({
  propTypes: {
    icons: React.PropTypes.object,
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
    style:React.PropTypes.object,
    animationTrigger: React.PropTypes.bool,
    playing: React.PropTypes.bool,
    isStartScreen: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      play: {
        animationScale: new Animated.Value(1),
        animationOpacity: new Animated.Value(this.props.isStartScreen ? 1 : 0)
      },
      pause: {
        animationScale: new Animated.Value(1),
        animationOpacity: new Animated.Value(this.props.isStartScreen ? 0 : 1)
      }
    };
  },

  onPress: function(name) {
    if(name == "play") {
      this.state.play.animationScale.setValue(1);
      this.state.play.animationOpacity.setValue(1);
      Animated.parallel([
        Animated.timing(this.state.play.animationOpacity, {
          toValue: 0
        }),
        Animated.timing(this.state.play.animationScale, {
          toValue: 2
        }),
        Animated.timing(this.state.pause.animationOpacity, {
          toValue: 1,
          duration: 0,
          delay: 500
        })
      ]).start();
    }
    if(name == "pause") {
      this.state.pause.animationOpacity.setValue(0);
      this.state.play.animationOpacity.setValue(1);
      this.state.play.animationScale.setValue(1);
    }
    this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
  },

  _renderButton(name) {
    if(this.state[name].animationOpacity._value == 0) {
      return null;
    }

    var fontStyle = {fontSize: this.props.fontSize, fontFamily: this.props.icons[name].fontFamily};

    var opacity = {opacity: this.state[name].animationOpacity};
    var animate = {transform: [{scale: this.state[name].animationScale}]};
    var buttonColor = {color: this.props.buttonColor == null? "white": this.props.buttonColor};

    return (
      <Animated.Text
        style={[styles.buttonTextStyle, fontStyle, buttonColor, this.props.buttonStyle, animate, opacity]}
        onPress={() => this.onPress(name)}>
        {this.props.icons[name].icon}
      </Animated.Text>
    );
  },

  // Gets the play button based on the current config settings
  render: function() {

    if(this.props.style != null) {
      positionStyle = this.props.style;
    }
    else if (this.props.position == "center") {
      var topOffset = Math.round((this.props.frameHeight - this.props.buttonHeight) * 0.5);
      var leftOffset = Math.round((this.props.frameWidth - this.props.buttonWidth) * 0.5);

      positionStyle = {
        position: 'absolute', top: topOffset, left: leftOffset
      };
    } else {
      positionStyle = styles[this.props.position];
    }
    var sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};

    var playButton = this._renderButton("play");
    var pauseButton = this._renderButton("pause");

    if(this.props.animationTrigger || (!this.props.animationTrigger && (this.state.play.animationOpacity._value != 0))) {
      return (
        <TouchableHighlight
          style={[positionStyle]}
          underlayColor="transparent"
          activeOpacity={this.props.opacity}>
          <View style={[styles.buttonArea, sizeStyle]}>
            {playButton}
            {pauseButton}
          </View>
        </TouchableHighlight>
      );
    }
    return null;

  }
});

module.exports = VideoViewPlayPause;