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
var RectButton = require('./widgets/RectButton');
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
    onPress: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
	},

  _renderButton: function(style, icon, func) {
    return (
      <RectButton
        icon={icon}
        onPress={func}
        fontSize={20}
        style={style}>
      </RectButton>
    );
  },

  _renderIconButton: function(icon, func) {
    return (
      <RectButton
        icon={icon}
        onPress={func}
        fontSize={30}
        style={styles.icon}>
      </RectButton>
    );
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

    var dismissButton = this._renderButton(styles.closeIconStyle, ICONS.CLOSE, this.props.onDismiss);

    var moreOptionRow = (
      <View
        ref='moreOptionRow' 
        style={this.state.optionSelected? styles.rowBottom: styles.rowCenter}>
        {discoveryButton}          
        {qualityButton}
        {ccButton}
        {shareButton}
        {settingButton}
      </View>
    );
    
    var dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );

    var moreOptionScreen = (
      <View style={styles.fullscreenContainer}>
        {dismissButtonRow}
        {moreOptionRow}
      </View>
    );

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