var React = require('react-native');
var {
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated
  } = React;

var Constants = require('../constants');
var {
  BUTTON_NAMES,
  PLATFORMS
} = Constants;

// Uses the rectbutton styles
var styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));
var PLAY = "play";
var PAUSE = "pause";

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
    showButton: React.PropTypes.bool,
    playing: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    initialPlay: React.PropTypes.bool
  },

  getInitialState: function() {      
    return {
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
      showInitialPlayAnimation: this.props.initialPlay,
      inAnimation: false
    };
  },

  componentWillMount: function() {
    // initialize animations.
    if (this.props.initialPlay) {
      this.state.widget.animationOpacity.setValue(1);
      this.state.play.animationOpacity.setValue(1);
      this.state.pause.animationOpacity.setValue(0);
    } else {
      this.state.widget.animationOpacity.setValue(this.props.showButton ? 1 : 0);
      this.state.play.animationOpacity.setValue(this.props.playing ? 0 : 1);
      this.state.pause.animationOpacity.setValue(this.props.playing ? 1 : 0);
    }
  },

  componentDidMount: function () {
    if (this.state.showInitialPlayAnimation) {
      this.animatePlayButton();
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.showButton != this.props.showButton) {
      var widgetOpacity = nextProps.showButton ? 1 : 0
      Animated.timing(this.state.widget.animationOpacity, {
        toValue: widgetOpacity,
      }).start();
    }

    if (nextProps.playing != this.props.playing) {
      if (!this.state.inAnimation) {
        this.syncButtons(nextProps.playing);
      }
    }
  },

  onPress: function() {
    if(this.props.showButton) {
      if (this.props.playing) {
        this.showPlayButton();
      } else {
        this.animatePlayButton();
      }
      this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  },

  onAnimationCompleted: function(instance) {
    this.state.widget.animationOpacity.setValue(this.props.showButton ? 1 : 0);
    this.setState({inAnimation:false});
    this.syncButtons(this.props.playing);
  },

  // Animations for play/pause transition
  animatePlayButton: function() {
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
  },

  showPlayButton: function() {
    this.state.pause.animationOpacity.setValue(0);
    this.state.play.animationOpacity.setValue(1);
    this.state.play.animationScale.setValue(1);
  },

  showPauseButton: function() {
    this.state.pause.animationOpacity.setValue(1);
    this.state.play.animationOpacity.setValue(0);
  },

  _renderLoading: function(sizeStyle) {
    if (this.props.loading) {
      if(this.props.platform == Constants.PLATFORMS.ANDROID) {
        return (
          <Animated.View style={[styles.buttonArea, styles.loading, sizeStyle, {position: 'absolute'}]}>
            <ProgressBarAndroid styleAttr="Small"/>
          </Animated.View>
        );     
      }
      else if(this.props.platform == Constants.PLATFORMS.IOS){
        return (
        <Animated.View style={[styles.buttonArea, styles.loading, sizeStyle, {position: 'absolute'}]}>
          <ActivityIndicatorIOS
            animating={true}
            size="large">
          </ActivityIndicatorIOS>
        </Animated.View>);
      }
    }
  },

  _renderButton: function(name) {
    var fontStyle = {fontSize: this.props.fontSize, fontFamily: this.props.icons[name].fontFamily};

    var opacity = {opacity: this.state[name].animationOpacity};
    var animate = {transform: [{scale: this.state[name].animationScale}]};
    var buttonColor = {color: this.props.buttonColor == null? "white": this.props.buttonColor};

    var size = {position: 'absolute'};

    return (
      <Animated.Text
        style={[styles.buttonTextStyle, fontStyle, buttonColor, this.props.buttonStyle, animate, opacity, size]}>
        {this.props.icons[name].icon}
      </Animated.Text>
    );
  },

  syncButtons: function(playing) {
    if (playing) {
      this.showPauseButton();
    } else {
      this.showPlayButton();
    }
  },

  // Gets the play button based on the current config settings
  render: function() {
    var scaleMultiplier = this.props.platform == Constants.PLATFORMS.ANDROID ? 2 : 1 // increase area of play button on android to play scale animation correctly.
    if(this.props.style != null) {
      positionStyle = this.props.style;
    }
    
    else if (this.props.position == "center") {
      
      var topOffset = Math.round((this.props.frameHeight - this.props.buttonHeight * scaleMultiplier) * 0.5);
      var leftOffset = Math.round((this.props.frameWidth - this.props.buttonWidth * scaleMultiplier) * 0.5);

      positionStyle = {
        position: 'absolute', top: topOffset, left: leftOffset
      };
    } else {
      positionStyle = styles[this.props.position];
    }
    
    var sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    var opacity = {opacity: this.state.widget.animationOpacity};

    var playButton = this._renderButton(PLAY);
    var pauseButton = this._renderButton(PAUSE);
    var loading = this._renderLoading(sizeStyle);
    if(this.props.platform == Constants.PLATFORMS.ANDROID) {
      if(!this.props.showButton)
      {
        return null;
      }
      else
      {
        sizeStyle.justifyContent = 'center';
        sizeStyle.alignSelf = 'center';
        sizeStyle.paddingTop = this.props.buttonHeight / scaleMultiplier;
        sizeStyle.paddingRight = this.props.buttonWidth / scaleMultiplier;
        sizeStyle.height = this.props.buttonHeight * scaleMultiplier;
        sizeStyle.width = this.props.buttonWidth * scaleMultiplier;
        
        return (
          <TouchableHighlight
            onPress={() => this.onPress()}
            style={[positionStyle]}
            underlayColor="transparent"
            activeOpacity={this.props.opacity}>
            <View>
              {loading}
              <Animated.View style={[styles.buttonArea, sizeStyle]}>
                {playButton}
                {pauseButton}
              </Animated.View>
            </View>
          </TouchableHighlight>
        );
      }
    }
    else{
      return (
        <TouchableHighlight
          onPress={() => this.onPress()}
          style={[positionStyle]}
          underlayColor="transparent"
          activeOpacity={this.props.opacity}>
          <View>
            {loading}
            <Animated.View style={[styles.buttonArea, sizeStyle, opacity, {position: 'absolute'}]}>
              {playButton}
              {pauseButton}
            </Animated.View>
          </View>
        </TouchableHighlight>
      );
    }
  }
});

module.exports = VideoViewPlayPause;