var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;

var Utils = require('../utils');

var styles = Utils.getStyles(require('./style/endScreenStyles.json'));
var ProgressBar = require('../progressBar');
var ControlBar = require('../controlBar');
var WaterMark = require('../waterMark');
var InfoPanel = require('../infoPanel');
var BottomOverlay = require('../bottomOverlay');
var Log = require('../log');
var Constants = require('../constants');

var {
  BUTTON_NAMES,
  IMG_URLS
} = Constants;

var leftMargin = 20;
var dismissButtonSize = 20;

var EndScreen = React.createClass({
	getInitialState: function() {
    return {
      showControls:true,
    };
  },

  propTypes: {
    config: React.PropTypes.object,
    title: React.PropTypes.string,
    duration: React.PropTypes.number,
    description: React.PropTypes.string,
    promoUrl: React.PropTypes.string,
    onPress: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    volume: React.PropTypes.number,
    upNextDismissed: React.PropTypes.bool,
  },

  handleClick: function(name) {
    this.props.onPress(name);
  },

  handleTouchEnd: function(event) {
    this.toggleControlBar();
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

  _renderDefaultScreen: function(progressBar, controlBar) {
    var fullscreenPromoImage = (this.props.config.endScreen.mode == 'default');
    var replaybuttonLocation = styles.replaybuttonCenter;
    var replaybutton;
    if(this.props.config.endScreen.showReplayButton) {
      var fontFamilyStyle = {fontFamily: this.props.config.icons.replay.fontFamilyName};
      replaybutton = (
        <TouchableHighlight
          onPress={(name) => this.handleClick('PlayPause')}
          underlayColor="transparent"
          activeOpacity={0.5}>
          <Text style={[styles.replaybutton, fontFamilyStyle]}>{this.props.config.icons.replay.fontString}</Text>
        </TouchableHighlight>
      );
    }

    var title = this.props.config.endScreen.showTitle ? this.props.title : null;
    var description = this.props.config.endScreen.showDescription ? this.props.description : null;
    var infoPanel =
      (<InfoPanel title={title} description={description} />);

    return (
      <Image
      source={{uri: this.props.promoUrl}}
      style={styles.fullscreenContainer}
      resizeMode={Image.resizeMode.contain}>
      <View
        style={styles.fullscreenContainer}>
        {infoPanel}
        <View style={replaybuttonLocation}>
          {replaybutton}
        </View>
        <View style={styles.controlBarPosition}>
          {this._renderBottomOverlay(true)}
        </View>
      </View>
      </Image>
    );
  },

  _renderBottomOverlay: function(show) {
    var shouldShowClosedCaptionsButton =
      this.props.availableClosedCaptionsLanguages &&
      this.props.availableClosedCaptionsLanguages.length > 0;
      Log.log("duration: " +this.props.duration)
    return (<BottomOverlay
      width={this.props.width}
      height={this.props.height}
      primaryButton={"replay"}
      playhead={this.props.duration}
      duration={this.props.duration}
      platform={this.props.platform}
      volume={this.props.volume}
      onPress={(name) => this.handlePress(name)}
      shouldShowProgressBar={false}
      showWatermark={this.props.showWatermark}
      isShow={show}
      config={{
        controlBar: this.props.config.controlBar,
        buttons: this.props.config.buttons,
        icons: this.props.config.icons,
        live: this.props.config.live
      }} />);
  },

  render: function() {
      return this._renderDefaultScreen();
  }
});

module.exports = EndScreen;