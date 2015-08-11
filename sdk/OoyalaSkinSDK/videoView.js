/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  Text,
  View,
  StyleSheet
} = React;

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var BottomOverlay = require('./bottomOverlay');
var ClosedCaptionsView = require('./closedCaptionsView');
var SharePanel = require('./sharePanel');
var AdBar = require('./adBar');
var UpNext = require('./upNext');
var RectButton = require('./widgets/RectButton');
var VideoViewPlayPause = require('./widgets/VideoViewPlayPause');
var Constants = require('./constants');
var Utils = require('./utils');
var styles = Utils.getStyles(require('./style/videoViewStyles.json'));

var autohideDelay = 5000;

var {
  BUTTON_NAMES,
  IMG_URLS
} = Constants;

var VideoView = React.createClass({
  getInitialState: function() {
    return {
      showControls: false,
      showSharePanel: false,
    };
  },

  propTypes: {
    rate: React.PropTypes.number,
    showPlay: React.PropTypes.bool,
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
    live: React.PropTypes.bool,
    ad: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    fullscreen: React.PropTypes.bool,
    onPress: React.PropTypes.func,
    onScrub: React.PropTypes.func,
    closedCaptionsLanguage: React.PropTypes.string,
    availableClosedCaptionsLanguages: React.PropTypes.array,
    captionJSON: React.PropTypes.object,
    onSocialButtonPress: React.PropTypes.func,
    showWatermark: React.PropTypes.bool,
    lastPressedTime: React.PropTypes.number,
    config: React.PropTypes.object,
    nextVideo: React.PropTypes.object,
    upNextDismissed: React.PropTypes.bool,
    localizableStrings: React.PropTypes.object,
    locale: React.PropTypes.string
  },

  shouldShowDiscovery: function() {
    return this.state.showDiscoveryPanel && this.props.discovery;
  },

  generateLiveLabel: function() {
    if (this.props.live) {
      return this.props.showPlay? 
        Utils.localizedString(this.props.locale, "GO LIVE", this.props.localizableStrings): 
        Utils.localizedString(this.props.locale, "LIVE", this.props.localizableStrings);
    }
  },

  onSocialButtonPress: function(socialType){
    this.props.onSocialButtonPress(socialType);
  },

  handlePress: function(name) {
    if(name == BUTTON_NAMES.PLAY_PAUSE && this.props.showPlay) {
      this.state.showControls = false;
    }
    this.props.onPress(name);
  },

  _renderBottomOverlay: function() {
    var shouldShowClosedCaptionsButton =
      this.props.availableClosedCaptionsLanguages &&
      this.props.availableClosedCaptionsLanguages.length > 0;

    return (<BottomOverlay
      width={this.props.width}
      height={this.props.height}
      primaryButton={this.props.showPlay ? "play" : "pause"}
      fullscreen = {this.props.fullscreen}
      playhead={this.props.playhead}
      duration={this.props.duration} 
      live={this.generateLiveLabel()}
      onPress={(name) => this.handlePress(name)}
      onScrub={(value)=>this.handleScrub(value)}
      showClosedCaptionsButton={shouldShowClosedCaptionsButton}
      showWatermark={this.props.showWatermark}
      isShow={this.controlsVisible()}
      config={{
        controlBar: this.props.config.controlBar,
        buttons: this.props.config.buttons,
        icons: this.props.config.icons
      }} />);
  },

  _renderAdBar: function() {
    return (<AdBar
        ad={this.props.ad}
        playhead={this.props.playhead}
        duration={this.props.duration}
        onPress={this.handlePress} 
        width={this.props.width}
        localizableStrings={this.props.localizableStrings}
        locale={this.props.locale} />
      );
  },

  _renderPlaceholder: function() {
    var placeholder;
    if(this.state.showSharePanel){
      var socialButtonsArray =this.props.sharing;
      placeholder = (
        <View
          style={styles.fullscreenContainer}>
          <SharePanel
          isShow= {this.state.showSharePanel}
          socialButtons={socialButtonsArray}
          onSocialButtonPress={(socialType) => this.onSocialButtonPress(socialType)} />
        </View>
      );
    } else {
      placeholder = (
        <View
          style={styles.placeholder}
          onTouchEnd={(event) => this.handleTouchEnd(event)}>
        </View>);
    }
    return placeholder;
  },

  _renderClosedCaptions: function() {
    var ccOpacity = this.props.closedCaptionsLanguage ? 1 : 0;
    return <ClosedCaptionsView
      style={[styles.closedCaptionStyle, {opacity:ccOpacity}]}
      captionJSON={this.props.captionJSON}
      onTouchEnd={(event) => this.handleTouchEnd(event)} />;
  },

  _renderUpNext: function() {
    return <UpNext
      config={this.props.config.upNextScreen}
      ad={this.props.ad}
      playhead={this.props.playhead}
      duration={this.props.duration}
      nextVideo={this.props.nextVideo}
      upNextDismissed={this.props.upNextDismissed}
      onPress={(value) => this.handlePress(value)}
      width={this.props.width}/>;
  },

  _renderPlayPause: function() {

    var buttonOpacity;
    if(this.controlsVisible()) {
      buttonOpacity = 1;
    }
    else {
      buttonOpacity = 0;
    }

    var buttonSize = Math.floor((this.props.height + this.props.width) * 0.05);

    return (
      <VideoViewPlayPause
        icons={{
          play: {
            icon: this.props.config.icons.play.fontString,
            fontFamily: this.props.config.icons.play.fontFamilyName
          },
          pause: {
            icon: this.props.config.icons.pause.fontString,
            fontFamily: this.props.config.icons.pause.fontFamilyName
          }
        }}
        position={"center"}
        playing={this.props.showPlay}
        onPress={(name) => this.handlePress(name)}
        frameWidth={this.props.width}
        frameHeight={this.props.height}
        buttonWidth={buttonSize * 2}
        buttonHeight={buttonSize * 2}
        fontSize={buttonSize}
        opacity={buttonOpacity}
        showButton={this.controlsVisible()}
        rate={this.props.rate}>
      </VideoViewPlayPause>);
  },

  _handleSocialShare: function() {
    this.setState({showSharePanel:!this.state.showSharePanel});
  },

  handleScrub: function(value) {
    this.props.onScrub(value);
  },

  getDefaultProps: function() {
    return {showPlay: true, playhead: 0, buffered: 0, duration: 1};
  },

  controlsVisible: function() {
    return this.state.showControls && (new Date).getTime() < this.props.lastPressedTime + autohideDelay;
  },

  toggleBottomOverlay: function() {
    this.setState({showControls:!this.controlsVisible()});
    this.props.onPress();
  },

  handleTouchEnd: function(event) {
    this.toggleBottomOverlay();
  },

  render: function() {

    if (this.props.ad) {
      return this.props.ad.requireAdBar ? this._renderAdBar() : null;
    } else {
      return (
        <View
          style={styles.container}>
          {this._renderPlaceholder()}
          {this._renderClosedCaptions()}
          {this._renderPlayPause()}
          {this._renderUpNext()}
          {this._renderBottomOverlay()}
        </View>
      );
    }
  }
});

module.exports = VideoView;