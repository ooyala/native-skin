var React = require('react-native');
var {
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  } = React;

var Constants = require('../constants');
var {
  BUTTON_NAMES
} = Constants;

// Uses the rectbutton styles
var styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));
var PLAY = "play";
var PAUSE = "pause";

var VideoViewPlayPauseAndroid = React.createClass({
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
    isStartScreen: React.PropTypes.bool,
    rate: React.PropTypes.number,
    playhead: React.PropTypes.number
  },

  getInitialState: function() {
    return {
      controlPlaying: true
    };
  },

  componentWillMount: function () {
    if(this.isInitialVideoPlay() || this.isVideoRemount(PLAY)) {
      this.playPauseAction(PLAY);
      this.setState({controlPlaying: false});
    }
    if(this.isVideoRemount(PAUSE)) {
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  },

  isInitialVideoPlay: function() {
    return (!this.props.isStartScreen && this.props.playhead == 0);
  },

  isVideoRemount: function(state) {
    if(!this.props.isStartScreen && this.props.playhead != 0) {
      if(state == PLAY) {
        return (!this.props.playing);
      }
      if(state == PAUSE) {
        return (this.props.playing);
      }
    }
    return false;
  },

  onPress: function() {
    if(this.props.showButton) {
      // Sets controlPlaying if video is paused by user
      this.setState({controlPlaying: !this.state.controlPlaying});
      if(this.props.rate <= 0 != this.state.controlPlaying && !this.props.isStartScreen) {
        this.playPauseAction(PAUSE);
      }
      else {
        this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
        this.playPauseAction((this.state.controlPlaying) ? PLAY : PAUSE);
      }
    }
    else {
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  },


  componentDidUpdate(prevProps, prevState) {
    if(prevProps.playing != this.props.playing && (this.props.rate <= 0) == this.state.controlPlaying) {
      this.playPauseAction(this.props.playing ? PAUSE : PLAY);
    }
  },

  _renderLoading: function() {
    if((this.props.rate <= 0 || this.props.playhead == 0) && !this.props.showButton && !this.state.controlPlaying) {
        return (
       <View style={styles.loading}>
         <ProgressBarAndroid styleAttr="Small"/>
      </View>
    );  
    }
  },

  _renderButton(name) {
    var fontStyle = {fontSize: this.props.fontSize, fontFamily: this.props.icons[name].fontFamily};
    var buttonColor = {color: this.props.buttonColor == null? "white": this.props.buttonColor};
    var size = {position: 'absolute'};
    return (
      <Text
        style={[styles.buttonTextStyle, fontStyle, buttonColor, this.props.buttonStyle,size]}>
        {this.props.icons[name].icon}
      </Text>
    );
  },

// Animations for play/pause transition
  playPauseAction(name) {
    if(name == PLAY) {
      console.log("play pause action play loop")
      //need to do something

    }
    if(name == PAUSE) {
      //need to do something
      console.log("pause loop")
    }
  },


  render: function() {
    var sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    var playButton = this._renderButton(PLAY);
    var pauseButton = this._renderButton(PAUSE);
    var loading = this._renderLoading();
    var totalButton = (
      <TouchableHighlight
        onPress={() => this.onPress()}
        underlayColor="transparent"
        activeOpacity={this.props.opacity}>
        <View>
          <View style={[styles.buttonArea, sizeStyle]}>
            {loading}
          </View>
          <View style={[styles.buttonArea, sizeStyle]}>
            {playButton}
          </View>
        </View>
      </TouchableHighlight>
      );
    //as animations are not supported, we are using opacity value to hide the button.
    //in start screen, opacity will be undefined, hence we are not handling opacity value of 1.
    if(this.props.opacity == 0)
    {
      return null;
    }
    else
    {
      return (
      <View style={[styles.buttonArea, sizeStyle]}>
        {totalButton}
      </View>
     );
    }
    
  }
});

module.exports = VideoViewPlayPauseAndroid;