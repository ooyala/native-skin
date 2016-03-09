/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var BottomOverlay = require('./bottomOverlay');
var ClosedCaptionsView = require('./closedCaptionsView');
var ClosedCaptionsViewAndroid = require('./closedCaptionsViewAndroid');
var AdBar = require('./adBar');
var UpNext = require('./upNext');
var RectButton = require('./widgets/RectButton');
var VideoViewPlayPause = require('./widgets/VideoViewPlayPause');
var Constants = require('./constants');
var Log = require('./log');
var Utils = require('./utils');
var styles = Utils.getStyles(require('./style/videoViewStyles.json'));
var ResponsiveDesignManager = require('./responsiveDesignManager');
var VideoWaterMark = require('./widgets/videoWaterMark');
var autohideDelay = 5000;

var {
  BUTTON_NAMES,
  PLATFORMS,
  IMG_URLS,
  UI_SIZES
} = Constants;

var VideoView = React.createClass({
  propTypes: {
    rate: React.PropTypes.number,
    platform: React.PropTypes.string,
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
    ad: React.PropTypes.object,
    live: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    volume: React.PropTypes.number,
    fullscreen: React.PropTypes.bool,
    cuePoints: React.PropTypes.array,
    onPress: React.PropTypes.func,
    onIcon: React.PropTypes.func,
    onScrub: React.PropTypes.func,
    closedCaptionsLanguage: React.PropTypes.string,
    availableClosedCaptionsLanguages: React.PropTypes.array,
    captionJSON: React.PropTypes.object,
    showWatermark: React.PropTypes.bool,
    config: React.PropTypes.object,
    nextVideo: React.PropTypes.object,
    upNextDismissed: React.PropTypes.bool,
    localizableStrings: React.PropTypes.object,
    locale: React.PropTypes.string,
    playing: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    initialPlay: React.PropTypes.bool,
  },

   componentWillReceiveProps: function(nextProps) {

 },

  getInitialState: function() {
    return {
      lastPressedTime: new Date(0)
    };
  },

  generateLiveObject: function() {
    if (this.props.live) {
      var isLive = this.props.playhead >= this.props.duration * 0.95;
      return ({
        label:
          isLive ? Utils.localizedString(this.props.locale, "LIVE", this.props.localizableStrings) :
          Utils.localizedString(this.props.locale, "GO LIVE", this.props.localizableStrings),
        onGoLive: isLive? null : this.onGoLive});
    } else {
      return null;
    }
  },

  onGoLive: function() {
    Log.log("onGoLive");
    if (this.props.onScrub) {
      this.props.onScrub(1);
    }
  },

  handlePress: function(name) {
    Log.verbose("VideoView Handle Press: " + name);
    this.setState({lastPressedTime: new Date().getTime()});
    if (this.state.showControls) {
      if (name == "LIVE") {
        this.props.onScrub(1);
      } else {
        this.props.onPress(name);
      }
    } else {
      this.props.onPress(name);
    }
  },

  _createOnIcon: function(index, func) {
    return function() {
      func(index);
    }
  },

  _renderBottomOverlay: function(show) {
    var shouldShowClosedCaptionsButton =
      this.props.availableClosedCaptionsLanguages &&
      this.props.availableClosedCaptionsLanguages.length > 0;

    return (<BottomOverlay
      width={this.props.width}
      height={this.props.height}
      primaryButton={this.props.playing ? "play" : "pause"}
      fullscreen = {this.props.fullscreen}
      cuePoints = {this.props.cuePoints}
      playhead={this.props.playhead}
      platform={this.props.platform}
      duration={this.props.duration}
      ad={this.props.ad}
      volume={this.props.volume}
      live={this.generateLiveObject()}
      onPress={(name) => this.handlePress(name)}
      onScrub={(value)=>this.handleScrub(value)}
      showClosedCaptionsButton={shouldShowClosedCaptionsButton}
      showWatermark={this.props.showWatermark}
      isShow={show}
      config={{
        controlBar: this.props.config.controlBar,
        buttons: this.props.config.buttons,
        icons: this.props.config.icons,
        live: this.props.config.live
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

  _renderPlaceholder: function(adIcons) {
    return (
      <View
        style={styles.placeholder}
        onTouchEnd={(event) => this.handleTouchEnd(event)}>
        {adIcons}
      </View>);
  },

  _renderClosedCaptions: function() {
    if(this.props.platform == Constants.PLATFORMS.ANDROID) {
      if (this.props.captionJSON) {
        var end = this.props.captionJSON.end == null ? 0.0 : this.props.captionJSON.end;
        var begin = this.props.captionJSON.begin == null ? 0.0 : this.props.captionJSON.begin;
        var text = this.props.captionJSON.text == null ? "" : this.props.captionJSON.text;
        var caption = {end:end, begin:begin, text:text, width:this.props.width}
        
        return (<ClosedCaptionsViewAndroid
          style={styles.closedCaptionAndroidStyle}
          caption={caption} />
        );
    }
    return null;
    }
    if(this.props.platform == Constants.PLATFORMS.IOS) {
      var ccOpacity = this.props.closedCaptionsLanguage ? 1 : 0;
      return (<ClosedCaptionsView
        style={[styles.closedCaptionStyle, {opacity:ccOpacity}]}
        captionJSON={this.props.captionJSON}
        onTouchEnd={(event) => this.handleTouchEnd(event)} />
      );
    }
    return null;
  },

  _renderUpNext: function() {
    if (this.props.live) {
      return null;
    }

    return <UpNext
      config={{
        upNext: this.props.config.upNext,
        icons: this.props.config.icons
      }}
      ad={this.props.ad}
      playhead={this.props.playhead}
      duration={this.props.duration}
      nextVideo={this.props.nextVideo}
      upNextDismissed={this.props.upNextDismissed}
      onPress={(value) => this.handlePress(value)}
      platform={this.props.platform}
      width={this.props.width}/>;
  },

  _renderPlayPause: function(show) {
    var iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
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
          onPress={(name) => this.handlePress(name)}
          frameWidth={this.props.width}
          frameHeight={this.props.height}
          buttonWidth={iconFontSize}
          buttonHeight={iconFontSize}
          platform={this.props.platform}
          fontSize={iconFontSize}
          showButton={show}
          rate={this.props.rate}
          playing={this.props.playing}
          loading={this.props.loading}
          initialPlay={this.props.initialPlay}>
        </VideoViewPlayPause>);
  },

  _renderVideoWaterMark: function(show) {
    var VideoWaterMarkSize = ResponsiveDesignManager.makeResponsiveMultiplier(UI_SIZES.VIDEOWATERMARK, UI_SIZES.VIDEOWATERMARK);
    var waterMarkName;
    if(this.props.platform == Constants.PLATFORMS.ANDROID) {
      waterMarkName = this.props.config.general.watermark.imageResource.androidResource;
    }
    if(this.props.platform == Constants.PLATFORMS.IOS) {
      waterMarkName = this.props.config.general.watermark.imageResource.iosResource;
    }
    return (
        <VideoWaterMark
          frameWidth={this.props.width}
          frameHeight={this.props.height}
          buttonWidth={VideoWaterMarkSize}
          buttonHeight={VideoWaterMarkSize}
          waterMarkName={waterMarkName}
          isShow={show} />
          );
  },

  handleScrub: function(value) {
    this.props.onScrub(value);
  },

  getDefaultProps: function() {
    return {playhead: 0, buffered: 0, duration: 1};
  },

  handleTouchEnd: function(event) {
    var isPastAutoHideTime = (new Date).getTime() - this.state.lastPressedTime > autohideDelay;
    if (isPastAutoHideTime) {
      this.setState({lastPressedTime: new Date().getTime()});
    } else {
      this.setState({lastPressedTime: new Date(0)})
    }
  },
  
  _renderAdIcons: function() {
    var iconViews = [];
    for (var index in this.props.ad.icons) {
      var icon = this.props.ad.icons[index];
      if ((this.props.playhead < icon.offset) || (this.props.playhead > (icon.offset + icon.duration))) {
        continue;
      }
      var left = icon.x;
      var top = icon.y;
      var iconStyle = {position:"absolute", width:icon.width, height:icon.height, backgroundColor:"transparent"};
      
      var leftStyle = 
        (icon.left < this.props.width -  icon.width) ? {left:icon.left} : {right:0};
      var topStyle = 
        (icon.top < this.props.height - icon.height) ? {top:icon.top} : {bottom:0};
      var clickHandler = this._createOnIcon(index, this.props.onIcon);

      iconViews.push(
        <TouchableHighlight 
          key={"iconTouchable"+index}
          style={[iconStyle, leftStyle, topStyle]}
          onPress={clickHandler}>
          <Image
            key={"iconImage" + index}
            style={{flex:1}}
            source={{uri: icon.url}} />
        </TouchableHighlight>
      );
    }
    return iconViews;
  },

  render: function() {
    var isPastAutoHideTime = (new Date).getTime() - this.state.lastPressedTime > autohideDelay;
    var doesAdRequireControls = this.props.ad && this.props.ad.requireControls;
    // TODO: IMA Ads UI is still not supported - No way to show UI while allowing Learn More in a clean way
    // var isAdPaused = this.props.ad && !this.props.playing;
    var isContent = !this.props.ad;

    var shouldShowControls = !isPastAutoHideTime && (doesAdRequireControls || isContent);

    var adBar = null;
    var adIcons = null;
    if (this.props.ad) {
      adBar = this.props.ad.requireAdBar ? this._renderAdBar() : null;
      if (this.props.ad.icons) {
        adIcons = this._renderAdIcons();
      }
    }

    return (
      <View
        style={styles.container}>
        {adBar}
        {this._renderVideoWaterMark(shouldShowControls)}
        {this._renderPlaceholder(adIcons)}
        {this._renderClosedCaptions()}
        {this._renderPlayPause(shouldShowControls)}
        {this._renderUpNext()}
        {this._renderBottomOverlay(shouldShowControls)}
      </View>
    );
  }
});

module.exports = VideoView;
