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
    return {
      optionSelected: false,
      discoverySelected: true,
      qualitySelected: true,
      ccSelected: true,
      shareSelected: true,
      settingSelected: true,
    }
  },

	propTypes: {
    onPress: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
	},

  _renderButton: function(style, icon, func, size) {
    return (
      <RectButton
        icon={icon}
        onPress={func}
        fontSize={size}
        style={style}>
      </RectButton>
    );
  },

  onOptionButtonPress: function() {
    LayoutAnimation.configureNext(animations.layout.easeInEaseOut);
    this.setState({optionSelected:!this.state.optionSelected});
  },

  onDiscoveryButtonPress: function() {
    this.setButtonSelectedState(true, false, false, false, false);
  },

  onQualityButtonPress: function() {
    this.setButtonSelectedState(false, true, false, false, false);
  },

  onCCButtonPress: function() {
    this.setButtonSelectedState(false, false, true, false, false);
  },

  onShareButtonPress: function() {
    this.setButtonSelectedState(false, false, false, true, false);
  },

  onSettingButtonPress: function() {
    this.setButtonSelectedState(false, false, false, false, true);
  },

  setButtonSelectedState: function(discovery, quality, cc, share, setting) {
    LayoutAnimation.configureNext(animations.layout.easeInEaseOut);
    this.setState({optionSelected:true});

    this.setState({discoverySelected: discovery});
    this.setState({qualitySelected: quality});
    this.setState({ccSelected: cc});
    this.setState({shareSelected: share});
    this.setState({settingSelected: setting});
  },

	render: function() {
    var discoveryBtnStyle = this.state.discoverySelected? styles.iconSelected: styles.iconUnselected;
    var qualityBtnStyle = this.state.qualitySelected? styles.iconSelected: styles.iconUnselected;
    var ccBtnStyle = this.state.ccSelected? styles.iconSelected: styles.iconUnselected;
    var shareBtnStyle = this.state.shareSelected? styles.iconSelected: styles.iconUnselected;
    var settingBtnStyle = this.state.settingSelected? styles.iconSelected: styles.iconUnselected;

    var discoveryButton = this._renderButton(discoveryBtnStyle, ICONS.DISCOVERY, this.onDiscoveryButtonPress, 30);
    var qualityButton = this._renderButton(qualityBtnStyle, ICONS.QUALITY, this.onQualityButtonPress, 30);
    var ccButton = this._renderButton(ccBtnStyle, ICONS.CC, this.onCCButtonPress, 30);
    var shareButton = this._renderButton(shareBtnStyle, ICONS.SHARE, this.onShareButtonPress, 30);
    var settingButton = this._renderButton(settingBtnStyle, ICONS.SETTING, this.onSettingButtonPress, 30);

    var dismissButton = this._renderButton(styles.closeIconStyle, ICONS.CLOSE, this.props.onDismiss, 20);

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