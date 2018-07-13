import PropTypes from 'prop-types';
import React from 'react';
import {
  View,
  TouchableHighlight,
  Animated
} from 'react-native';
import FwdButton from './FwdButton'

const Constants = require('../constants');
const {
  BUTTON_NAMES
} = Constants;

// Uses the rectbutton styles
const styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));
const PLAY = "play";
const PAUSE = "pause";
const FORWARD = "seekForward";
const BACKWARD = "seekBackward";

class VideoViewPlayPause extends React.Component {
  static propTypes = {
    icons: PropTypes.object,
    position: PropTypes.string,
    onPress: PropTypes.func,
    opacity: PropTypes.number,
    frameWidth: PropTypes.number,
    frameHeight: PropTypes.number,
    buttonWidth: PropTypes.number,
    buttonHeight: PropTypes.number,
    buttonColor: PropTypes.string,
    buttonStyle: PropTypes.object,
    fontSize: PropTypes.number,
    style: PropTypes.object,
    showButton: PropTypes.bool,
    playing: PropTypes.bool,
    loading: PropTypes.bool,
    initialPlay: PropTypes.bool
  };

  state = {
    play: {
      animationScale: new Animated.Value(1),
      animationOpacity: new Animated.Value(1)
    },
    pause: {
      animationScale: new Animated.Value(1),
      animationOpacity: new Animated.Value(0)
    },
    widget: {
      animationOpacity: new Animated.Value(0)
    },
    seekButtons: {
      animationScale: new Animated.Value(1),
      animationOpacity: new Animated.Value(0)
    },
    showInitialPlayAnimation: this.props.initialPlay,
    inAnimation: false
  };

  componentWillMount() {
    // initialize animations.
    if (this.props.initialPlay) {
      this.state.widget.animationOpacity.setValue(1);
      this.state.play.animationOpacity.setValue(1);
      this.state.pause.animationOpacity.setValue(0);
      this.state.seekButtons.animationOpacity.setValue(0);
    } else {
      this.state.widget.animationOpacity.setValue(this.props.showButton ? 1 : 0);
      this.state.play.animationOpacity.setValue(this.props.playing ? 0 : 1);
      this.state.pause.animationOpacity.setValue(this.props.playing ? 1 : 0);
      this.state.seekButtons.animationOpacity.setValue(1);
    }
  }

  componentDidMount() {
    if (this.state.showInitialPlayAnimation) {
      this.animatePlayButton();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showButton !== this.props.showButton) {
      const widgetOpacity = nextProps.showButton ? 1 : 0;

      Animated.timing(this.state.widget.animationOpacity, {
        toValue: widgetOpacity,
      }).start();
    }

    if (nextProps.playing !== this.props.playing) {
      if (!this.state.inAnimation) {
        this.syncButtons(nextProps.playing);
      }
    }
  }

  onPress = () => {
    if (this.props.showButton) {
      if (this.props.playing) {
        this.showPlayButton();
      } else {
        this.animatePlayButton();
      }
      this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  };

  onAnimationCompleted = (instance) => {
    this.state.widget.animationOpacity.setValue(this.props.showButton ? 1 : 0);
    this.setState({inAnimation: false});
    this.syncButtons(this.props.playing);
  };

  // Animations for play/pause transition
  animatePlayButton = () => {
    this.setState({inAnimation: true});
    this.state.play.animationScale.setValue(1);
    this.state.play.animationOpacity.setValue(1);

    Animated.parallel([
      Animated.timing(this.state.play.animationOpacity, {
        toValue: 0
      }),
      Animated.timing(this.state.play.animationScale, {
        toValue: 2
      }),
    ]).start(this.onAnimationCompleted);
  };

  showPlayButton = () => {
    this.state.pause.animationOpacity.setValue(0);
    this.state.play.animationOpacity.setValue(1);
    this.state.play.animationScale.setValue(1);
  };

  showPauseButton = () => {
    this.state.pause.animationOpacity.setValue(1);
    this.state.play.animationOpacity.setValue(0);
  };

  _renderButton = (name) => {
    const fontStyle = {fontSize: this.props.fontSize, fontFamily: this.props.icons[name].fontFamily};
    const opacity = {opacity: this.state[name].animationOpacity};
    const animate = {transform: [{scale: this.state[name].animationScale}]};
    const buttonColor = {color: this.props.buttonColor === null ? "white" : this.props.buttonColor};

    return (
      <View
        accessible={false}
        style={[styles.buttonTextContainer]}>
        <Animated.Text
          accessible={false}
          style={[styles.buttonTextStyle, fontStyle, buttonColor, this.props.buttonStyle, animate, opacity]}>
          {this.props.icons[name].icon}
        </Animated.Text>
      </View>
    );
  };

  _renderSeekButton = (name) => {
    const fontStyle = {fontSize: this.props.fontSize, fontFamily: this.props.icons[name].fontFamily};
    const opacity = {opacity: this.state[name].animationOpacity};
    const animate = {transform: [{scale: this.state[name].animationScale}]};
    const buttonColor = {color: this.props.buttonColor === null ? "white" : this.props.buttonColor};
    const isForward = name === FORWARD;

    return (
      <FwdButton
        isForward={isForward}
        fontStyle={fontStyle}
        animate={animate}
        buttonColor={buttonColor}
        opacity={opacity}
        icon={this.props.icons[name]}/>
    );
  };

  syncButtons = (playing) => {
    if (playing) {
      this.showPauseButton();
    } else {
      this.showPlayButton();
    }
  };

  // Gets the play button based on the current config settings
  render() {
    const scaleMultiplier = this.props.platform === Constants.PLATFORMS.ANDROID ? 2 : 1; // increase area of play button on android to play scale animation correctly.
    let positionStyle = this.props.style;

    if (positionStyle === null) {
      positionStyle = styles[this.props.position];
    } else if (this.props.position === "center") {
      const topOffset = Math.round((this.props.frameHeight - this.props.buttonHeight * scaleMultiplier) * 0.5);
      const leftOffset = Math.round((this.props.frameWidth - this.props.buttonWidth * scaleMultiplier) * 0.5);

      positionStyle = {
        position: 'absolute',
        top: topOffset,
        left: leftOffset
      };
    }

    const sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    const opacity = {opacity: this.state.widget.animationOpacity};

    const playButton = this._renderButton(PLAY);
    const pauseButton = this._renderButton(PAUSE);

    if (this.props.platform === Constants.PLATFORMS.ANDROID) {
      if (!this.props.showButton) {
        return null;
      } else {
        sizeStyle.justifyContent = 'center';
        sizeStyle.alignSelf = 'center';
        sizeStyle.paddingTop = this.props.buttonHeight / scaleMultiplier;
        sizeStyle.paddingRight = this.props.buttonWidth;
        sizeStyle.height = this.props.buttonHeight * scaleMultiplier;
        sizeStyle.width = this.props.buttonWidth * scaleMultiplier;

        return (
          <TouchableHighlight
            onPress={() => this.onPress()}
            style={[positionStyle]}
            underlayColor="transparent"
            activeOpacity={this.props.opacity}>
            <View>
              <Animated.View style={[styles.playPauseButtonArea, sizeStyle]}>
                {playButton}
                {pauseButton}
              </Animated.View>
            </View>
          </TouchableHighlight>
        );
      }
    } else {
      return (
        <TouchableHighlight
          onPress={() => this.onPress()}
          style={[positionStyle]}
          underlayColor="transparent"
          activeOpacity={this.props.opacity}>
          <View>
            <Animated.View style={[styles.playPauseButtonArea, sizeStyle, opacity]}>
              {playButton}
              {pauseButton}
            </Animated.View>
          </View>
        </TouchableHighlight>
      );
    }
  }

}

module.exports = VideoViewPlayPause;
