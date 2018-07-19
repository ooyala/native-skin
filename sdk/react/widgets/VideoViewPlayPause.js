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

const SEEKBUTTONS_MARGIN = 20;

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
      <Animated.Text
        accessible={false}
        style={[styles.buttonTextStyle, fontStyle, buttonColor, this.props.buttonStyle, animate, opacity]}>
        {this.props.icons[name].icon}
      </Animated.Text>
    );
  };

  _renderSeekButton = (name, scaleMultiplier) => {
    const fontStyle = {fontSize: this.props.fontSize, fontFamily: this.props.icons[name].fontFamily};
    const opacity = {opacity: this.state.seekButtons.animationOpacity};
    const animate = {transform: [{scale: this.state.seekButtons.animationScale}]};
    const buttonColor = {color: this.props.buttonColor === null ? "white" : this.props.buttonColor};
    const isForward = name === FORWARD;
    let marginLeftValue = 0, marginRightValue = 0;
    if (isForward) {
      marginLeftValue = this.props.buttonWidth + SEEKBUTTONS_MARGIN/* * scaleMultiplier + SEEKBUTTONS_MARGIN*/;
    } else {
      marginRightValue = this.props.buttonWidth + SEEKBUTTONS_MARGIN/* * scaleMultiplier + SEEKBUTTONS_MARGIN*/;
    }

    console.log("Button width is: " + this.props.buttonWidth + " and SEEKBUTTONS_MARGIN is: " + SEEKBUTTONS_MARGIN
      + " and margin values is: Left: " + marginLeftValue + " Right: " + marginRightValue);

    const margin = {marginLeft: marginLeftValue, marginRight: marginRightValue};

    return (
      <FwdButton
        isForward={isForward}
        timeValue={10}
        currentPosition={10}
        icon={this.props.icons[name].icon}
        fontStyle={fontStyle}
        opacity={opacity}
        animate={animate}
        buttonColor={buttonColor}
      />
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
    let topOffset, leftOffset;

    if (positionStyle === null) {
      positionStyle = styles[this.props.position];
    } else if (this.props.position === "center") {
      topOffset = Math.round((this.props.frameHeight - this.props.buttonHeight * scaleMultiplier) * 0.5);
      leftOffset = Math.round((this.props.frameWidth - this.props.buttonWidth * scaleMultiplier) * 0.5);
    }

    const sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    const opacity = {opacity: this.state.widget.animationOpacity};

    const playButton = this._renderButton(PLAY);
    const pauseButton = this._renderButton(PAUSE);
    const backwardButton = this._renderSeekButton(BACKWARD, scaleMultiplier);
    const forwardButton = this._renderSeekButton(FORWARD, scaleMultiplier);

    const containerStyle = {
      flexDirection: 'row',
      flex: 0,
      justifyContent: 'space-between',
      alignItems: 'center'
    };

    if (this.props.platform === Constants.PLATFORMS.ANDROID) {
      if (!this.props.showButton) {
        return null;
      } else {
        sizeStyle.height = this.props.buttonHeight * scaleMultiplier;
        sizeStyle.width = this.props.buttonWidth * scaleMultiplier;

        return (
          <View style={[containerStyle]}>
            {backwardButton}
            <TouchableHighlight
              onPress={() => this.onPress()}
              underlayColor="transparent"
              activeOpacity={this.props.opacity}>
              <Animated.View style={[sizeStyle]}>
                {playButton}
                {pauseButton}
              </Animated.View>
            </TouchableHighlight>
            {forwardButton}
          </View>
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
