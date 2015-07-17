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
  ICONS,
  BUTTON_NAMES,
  IMG_URLS,
} = Constants;

var dismissButtonSize = 20;

var MoreOptionScreen = React.createClass({
	propTypes: {
    moreOptionConfig: React.PropTypes.object,
    onDismiss: React.PropTypes.func,
    onSocialButtonPress: React.PropTypes.func,
    panel: React.PropTypes.object,
    buttonSelected: React.PropTypes.string,
    onOptionButtonPress: React.PropTypes.func,
	},

  _renderButton: function(style, icon, func, size, color) {
    return (
      <RectButton
        icon={icon}
        onPress={func}
        fontSize={size}
        style={style}
        buttonColor={color}>
      </RectButton>
    );
  },

  _renderMoreOptionButtons: function(moreOptionButtons){
    for(var i = 0; i < this.props.moreOptionConfig.buttons.length; i++){
      var button = this.props.moreOptionConfig.buttons[i];

      var moreOptionButton;
      var buttonOpacity = this._renderOpacity(this.props.buttonSelected, button);
      var buttonIcon = this._renderIcon(button);
      var buttonStyle = [styles.icon, buttonOpacity];

      var onOptionPress = function(buttonName, f){
        return function(){
          f(buttonName);
        };
      }(button, this.props.onOptionButtonPress);
        
      moreOptionButton = this._renderButton(buttonStyle, buttonIcon, onOptionPress, this.props.moreOptionConfig.iconSize, this.props.moreOptionConfig.color);

      moreOptionButtons.push(moreOptionButton);
    }
  },

  _renderOpacity: function(buttonSelected, buttonName){
    var buttonOpacity;
    if(buttonSelected == BUTTON_NAMES.NONE || buttonSelected == buttonName){
      buttonOpacity = this.props.moreOptionConfig.brightOpacity;
    }else{
      buttonOpacity = this.props.moreOptionConfig.darkOpacity;
    }

    return {opacity: buttonOpacity};
  },

  _renderIcon: function(buttonName){
    var buttonIcon;
    switch(buttonName){
          case BUTTON_NAMES.DISCOVERY:
            buttonIcon = ICONS.DISCOVERY;
            break;
          case BUTTON_NAMES.QUALITY:
            buttonIcon = ICONS.QUALITY;
            break;
          case BUTTON_NAMES.CLOSED_CAPTIONS:
            buttonIcon = ICONS.CC;
            break;
          case BUTTON_NAMES.SHARE:
            buttonIcon = ICONS.SHARE;
            break;
          case BUTTON_NAMES.SETTING:
            buttonIcon = ICONS.SETTING;
            break;
          default:
            break;
        }
    return buttonIcon;
  },

	render: function() {
    var moreOptionButtons = [];
    this._renderMoreOptionButtons(moreOptionButtons);
    
    var dismissButton = this._renderButton(styles.iconBright, ICONS.DISMISS, this.props.onDismiss, dismissButtonSize);

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