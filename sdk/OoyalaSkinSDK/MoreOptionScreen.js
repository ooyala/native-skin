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

var indexIos = require('./index.ios.js');
var Utils = require('./utils');
var Constants = require('./constants');
var RectButton = require('./widgets/RectButton');
var styles = Utils.getStyles(require('./style/moreOptionScreenStyles.json'));

var {
  BUTTON_NAMES,
  IMG_URLS,
} = Constants;

var dismissButtonSize = 20;

var MoreOptionScreen = React.createClass({
	propTypes: {
    onDismiss: React.PropTypes.func,
    onSocialButtonPress: React.PropTypes.func,
    panel: React.PropTypes.object,
    buttonSelected: React.PropTypes.string,
    onOptionButtonPress: React.PropTypes.func,
    config: React.PropTypes.object
	},

  _renderButton: function(style, icon, func, size, color, fontFamily) {
    return (
      <RectButton
        icon={icon}
        onPress={func}
        fontSize={size}
        fontFamily={fontFamily}
        style={style}
        buttonColor={color}>
      </RectButton>
    );
  },

  _renderMoreOptionButtons: function(moreOptionButtons){
    for(var i = 0; i < this.props.config.moreOptions.buttons.length; i++){
      var button = this.props.config.moreOptions.buttons[i];

      var moreOptionButton;
      var buttonOpacity = this._renderOpacity(this.props.buttonSelected, button);
      var buttonIcon = this._renderIcon(button);
      var buttonStyle = [styles.icon, buttonOpacity];

      var onOptionPress = function(buttonName, f){
        return function(){
          f(buttonName);
        };
      }(button, this.props.onOptionButtonPress);

      moreOptionButton = this._renderButton([buttonStyle, this.props.config.moreOptions.iconStyle], buttonIcon.fontString, onOptionPress, this.props.config.moreOptions.iconSize, this.props.config.moreOptions.iconStyle.color, buttonIcon.fontFamilyName);

      moreOptionButtons.push(moreOptionButton);
    }
  },

  _renderOpacity: function(buttonSelected, buttonName){
    var buttonOpacity;
    if(buttonSelected == BUTTON_NAMES.NONE || buttonSelected == buttonName){
      buttonOpacity = this.props.config.moreOptions.brightOpacity;
    }else{
      buttonOpacity = this.props.config.moreOptions.darkOpacity;
    }

    return {opacity: buttonOpacity};
  },

  _renderIcon: function(buttonName){
    var buttonIcon;
    switch(buttonName){
          case BUTTON_NAMES.DISCOVERY:
            buttonIcon = this.props.config.icons.discovery;
            break;
          case BUTTON_NAMES.QUALITY:
            buttonIcon = this.props.config.icons.quality;
            break;
          case BUTTON_NAMES.CLOSED_CAPTIONS:
            buttonIcon = this.props.config.icons.cc;
            break;
          case BUTTON_NAMES.SHARE:
            buttonIcon = this.props.config.icons.share;
            break;
          case BUTTON_NAMES.SETTING:
            buttonIcon = this.props.config.icons.setting;
            break;
          default:
            break;
        }
    return buttonIcon;
  },

	render: function() {
    var moreOptionButtons = [];
    this._renderMoreOptionButtons(moreOptionButtons);
    
    var dismissButton = this._renderButton(styles.iconBright, this.props.config.icons.dismiss.fontString, this.props.onDismiss, dismissButtonSize, this.props.config.moreOptions.iconStyle.color, this.props.config.icons.dismiss.fontFamilyName);

    var moreOptionRow = (
      <View
        ref='moreOptionRow' 
        style={this.props.buttonSelected != BUTTON_NAMES.NONE? styles.rowBottom: styles.rowCenter}>
        {moreOptionButtons}
      </View>
    );
    
    var dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );

    var moreOptionScreen = (
      <View style={styles.fullscreenContainer}>
        {this.props.panel}
        {dismissButtonRow}
        {moreOptionRow}
      </View>
    );

    return moreOptionScreen;
  }
});

module.exports = MoreOptionScreen;