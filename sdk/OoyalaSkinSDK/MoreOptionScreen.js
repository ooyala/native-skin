'use strict';

var React = require('react-native');
var {
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;
	
var Utils = require('./utils');
var Constants = require('./constants');

var {
  ICONS,
  BUTTON_NAMES,
  IMG_URLS,
} = Constants;

var MoreOptionScreen = React.createClass({
	propTypes: {
		isShow: React.PropTypes.bool,
    onPress: React.PropTypes.func,
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

	render: function() {
    var discoveryButton = this._renderIconButton(ICONS.DISCOVERY, this.onPlayPausePress);
    var qualityButton = this._renderIconButton(ICONS.QUALITY, this.onPlayPausePress);
    var ccButton = this._renderIconButton(ICONS.CC, this.onPlayPausePress);
    var shareButton = this._renderIconButton(ICONS.SHARE, this.onPlayPausePress);
    var settingButton = this._renderIconButton(ICONS.SETTING, this.onPlayPausePress);

    var closeButton = this._renderIconButton(ICONS.CLOSE, this.onPlayPausePress);

    var moreOptionRow = (
      <View style={styles.buttonCenter}>
        {discoveryButton}
        {qualityButton}
        {ccButton}
        {shareButton}
        {settingButton}
      </View>
    );

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

var styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },

  sharePanelButtonRow: {
    flexDirection:'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    margin: 20
  },

  closeButtonNE:{
    position: 'absolute',
    top: 15,
    right: 15,
  },

  buttonCenter: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  icon: {
    fontSize: 30,
    textAlign: 'center',
    color: '#8E8E8E',
    fontFamily: 'fontawesome',
    margin: 15
  },
});

module.exports = MoreOptionScreen;