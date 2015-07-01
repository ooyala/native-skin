'use strict';

var React = require('react-native');
var {
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  LayoutAnimation,
} = React;

var Utils = require('./utils');
var Constants = require('./constants');
var styles = Utils.getStyles(require('./style/moreOptionScreenStyles.json'));

var {
  ICONS,
  BUTTON_NAMES,
  IMG_URLS,
} = Constants;

var MoreOptionScreen = React.createClass({
  getInitialState: function(){
    return {optionSelected: false}
  },

	propTypes: {
		isShow: React.PropTypes.bool,
    onPress: React.PropTypes.func,
	},

  _renderButton: function(style, icon, func) {
    return (
      <TouchableHighlight onPress={func}>
        <Text style={style}>{icon}</Text>
      </TouchableHighlight>
    );
  },

  _renderIconButton: function(icon, func) {
    return (
      <TouchableHighlight onPress={func}>
        <Text style={styles.icon}>{icon}</Text>
      </TouchableHighlight>
    );
  },

  onPlayPausePress: function() { 
    this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
  },

  onOptionButtonPress: function() {
    LayoutAnimation.configureNext(animations.layout.easeInEaseOut);
    this.setState({optionSelected:!this.state.optionSelected});
  },

	render: function() {
    var discoveryButton = this._renderIconButton(ICONS.DISCOVERY, this.onOptionButtonPress);
    var qualityButton = this._renderIconButton(ICONS.QUALITY, this.onPlayPausePress);
    var ccButton = this._renderIconButton(ICONS.CC, this.onPlayPausePress);
    var shareButton = this._renderIconButton(ICONS.SHARE, this.onPlayPausePress);
    var settingButton = this._renderIconButton(ICONS.SETTING, this.onPlayPausePress);

    var closeButton = this._renderButton(styles.closeIconStyle, ICONS.CLOSE, this.onPlayPausePress);

    var moreOptionRow;
    if(this.state.optionSelected){
      moreOptionRow = (
        <View
          ref='moreOptionRow' 
          style={styles.rowBottom}>
          {discoveryButton}
          {qualityButton}
          {ccButton}
          {shareButton}
          {settingButton}
        </View>
      );
    }else{
      moreOptionRow = (
        <View
          ref='moreOptionRow' 
          style={styles.rowCenter}>
          {discoveryButton}
          {qualityButton}
          {ccButton}
          {shareButton}
          {settingButton}
        </View>
      );
    }

    var closeButtonRow = (
      <View style={styles.closeButtonNE}>
        {closeButton}
      </View>
    );

    var moreOptionScreen;
    if(this.props.isShow){
      moreOptionScreen = (
        <View style={styles.fullscreenContainer}>
          {closeButtonRow}
          {moreOptionRow}
        </View>
      );
    }

    return (
      <View style={styles.fullscreenContainer}>
        {moreOptionScreen}
      </View>
    );
  }
});

var animations = {
  layout: {
    easeInEaseOut: {
      duration: 900,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    },
  },
};

module.exports = MoreOptionScreen;