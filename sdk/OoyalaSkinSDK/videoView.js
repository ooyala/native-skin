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
var ProgressBar = require('./progressBar');
var ControlBar = require('./controlBar');
var ClosedCaptionsView = require('./closedCaptionsView');
var SharePanel = require('./sharePanel');
var AdBar = require('./adBar');
var UpNext = require('./upNext');
var Constants = require('./constants');
var Utils = require('./utils');
var styles = Utils.getStyles(require('./style/videoViewStyles.json'));

var {
  BUTTON_NAMES,
  IMG_URLS
} = Constants;

var VideoView = React.createClass({
  getInitialState: function() {
    return {
      showControls: true,
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
    this.props.onPress(name);
  },

  _renderProgressBar: function() {
    if (this.props.ad) {
      return null;
    }
    return (<ProgressBar ref='progressBar'
      playhead={this.props.playhead}
      duration={this.props.duration}
      width={this.props.width}
      height={this.props.height}
      onScrub={(value)=>this.handleScrub(value)}
      isShow={this.showControlBar()} />);
  },

  _renderControlBar: function() {
    if (this.props.ad) {
      return null;
    }

    var shouldShowClosedCaptionsButton =
      this.props.availableClosedCaptionsLanguages &&
      this.props.availableClosedCaptionsLanguages.length > 0;

    return (<ControlBar
      ref='controlBar'
      primaryButton={this.props.showPlay ? "play" : "pause"}
      playhead={this.props.playhead}
      duration={this.props.duration}
      live={this.generateLiveLabel()}
      width={this.props.width}
      height={this.props.height}
      fullscreen = {this.props.fullscreen}
      onPress={(name) => this.handlePress(name)}
      showClosedCaptionsButton={shouldShowClosedCaptionsButton}
      showWatermark={this.props.showWatermark}
      isShow={this.showControlBar()}
      config={{
        controlBar: this.props.config.controlBar,
        icons: this.props.config.icons
      }} />);
  },

  _renderAdBar: function() {
    if (this.props.ad) {
      return (<AdBar
        ad={this.props.ad}
        playhead={this.props.playhead}
        duration={this.props.duration}
        onPress={this.handlePress} 
        width={this.props.width}
        localizableStrings={this.props.localizableStrings}
        locale={this.props.locale} />
      );
    }
    return null;
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

  _handleSocialShare: function() {
    this.setState({showSharePanel:!this.state.showSharePanel});
  },

  handleScrub: function(value) {
    this.props.onScrub(value);
  },

  getDefaultProps: function() {
    return {showPlay: true, playhead: 0, buffered: 0, duration: 1};
  },

  showControlBar: function() {
    return this.state.showControls && (new Date).getTime() < this.props.lastPressedTime + 5000;
  },

  toggleControlBar: function() {

    this.setState({showControls:!this.showControlBar()});
    this.props.onPress();
  },

  handleTouchEnd: function(event) {
    this.toggleControlBar();
  },

  render: function() {
    var adBar = this._renderAdBar();
    var placeholder = this._renderPlaceholder();
    var closedCaptions = this._renderClosedCaptions();
    var progressBar = this._renderProgressBar();
    var controlBar = this._renderControlBar();
    var upNext = this._renderUpNext();

    return (
      <View style={styles.container}>
        {adBar}
        {placeholder}
        {closedCaptions}
        {upNext}
        {progressBar}
        {controlBar}
      </View>
    );
  }
});

module.exports = VideoView