
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  } = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/upNext.json'));
var CountdownView = require('./widgets/countdownTimer');
var CountdownViewAndroid = require('./widgets/countdownTimerAndroid');
var ResponsiveDesignManager = require('./responsiveDesignManager');
var Constants = require('./constants');

var descriptionMinWidth = 140;
var thumbnailWidth = 175;
var dismissButtonWidth = 10;

var UpNext = React.createClass({
  propTypes: {
    config: React.PropTypes.object,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    ad: React.PropTypes.object,
    nextVideo: React.PropTypes.object,
    onPress: React.PropTypes.func,
    upNextDismissed: React.PropTypes.bool,
    width: React.PropTypes.number,
    platform:React.PropTypes.string
  },

  dismissUpNext: function() {
    this.props.onPress("upNextDismiss");
  },

  clickUpNext: function() {
    this.props.onPress("upNextClick");
  },

  upNextDuration: function() {

    if(this.props.config.upNext.timeToShow.indexOf('%') >= 0) {
      return (this.props.duration - parseFloat(this.props.config.upNext.timeToShow.slice(0,-1) / 100) * this.props.duration);
    }
    // else if we are given a number of seconds from end in which to show the upnext dialog.
    else {
      return parseInt(this.props.config.upNext.timeToShow);
    }
  },

  isWithinShowUpNextBounds: function() {
    return parseInt(this.upNextDuration()) > this.props.duration - this.props.playhead;
  },

  _renderDismissButton: function() {
    return (<TouchableHighlight
      onPress={this.dismissUpNext}
      underlayColor='transparent'
      style={styles.dismissButtonContainer}>
      <Text style={[
        styles.dismissButton,
        {fontFamily: this.props.config.icons.dismiss.fontFamilyName}
      ]}>{this.props.config.icons.dismiss.fontString}</Text>
    </TouchableHighlight>);
  },


  renderCountdownTimer: function() {
    if(this.props.platform == Constants.PLATFORMS.ANDROID) {
      return <CountdownViewAndroid style={styles.countdownView}
        countdown={{
          main_color:"#AAffffff",
          secondary_color:"#AA808080",
          fill_color:"#AA000000",
          text_color:"#AAffffff",
          stroke_width:5,
          text_size:25,
          max_time:this.upNextDuration(),
          progress:parseInt((this.upNextDuration() - (this.props.duration-this.props.playhead))),
          automatic:false}}/>
    }
    if(this.props.platform == Constants.PLATFORMS.IOS) {
      return <CountdownView style={styles.countdownView}
        automatic={false}
        time={this.upNextDuration()}
        timeLeft={this.props.duration - this.props.playhead}
        radius={9}
        fillAlpha={0.7} />
    }
  },


  render: function() {

    if(this.isWithinShowUpNextBounds() && !this.props.upNextDismissed && this.props.config.upNext.showUpNext && !this.props.ad && this.props.nextVideo != null) {
      var upNextWidth = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, thumbnailWidth, [0.8,1], [520]);
      var countdown = this.renderCountdownTimer();
      var upNextImage = (
        <Image
          source={{uri: this.props.nextVideo.imageUrl}}
          style={[styles.thumbnail, {width: upNextWidth}]} >
          <TouchableHighlight style={[styles.thumbnail, {width: upNextWidth}]}
            onPress={this.clickUpNext}>
            <Text style={[{fontFamily: this.props.config.icons.play.fontFamilyName, color: "white"}, styles.countdownText]}></Text>
          </TouchableHighlight>
          <Text style={styles.icon}>{this.props.config.icons.play.fontString}</Text>
        </Image>
      );

      var upNextDescription = (
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            {countdown}
            <Text style={styles.title}>
              Up next: {this.props.nextVideo.name}
            </Text>
          </View>
        </View>
      );
      var upNextDismissButton = this._renderDismissButton();

      if (this.props.width < descriptionMinWidth + upNextWidth + dismissButtonWidth) {
        return (
          <View style={styles.container}>
            {upNextImage}
            <View style={{flex: 5}}></View>
            {upNextDismissButton}
          </View>
        );
      }
      else {
        return (
          <View style={styles.container}>
            {upNextImage}
            {upNextDescription}
            {upNextDismissButton}
          </View>
        );
      }

    }
    return null;
  },
});

module.exports = UpNext;
