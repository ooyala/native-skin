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
    sharePanel: React.PropTypes.object,
    buttonSelected: React.PropTypes.string,
    panelToShow: React.PropTypes.string,
    onOptionButtonPress: React.PropTypes.func,
    buttons: React.PropTypes.array,
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
    for(var i = 0; i < this.props.buttons.length; i++){
      var button = this.props.buttons[i];

      if(button.type == "FeatureOptions" || button.type == "MoreOptions"){
        var moreOptionButton;
        var buttonOpacity = this._renderOpacity(this.props.buttonSelected, button.name);
        var buttonIcon = this._renderIcon(button.name);
        var buttonStyle = [styles.icon, buttonOpacity];

        var onOptionPress = function(buttonName, f){
          return function(){
            f(buttonName);
          };
        }(button.name, this.props.onOptionButtonPress);
        
        moreOptionButton = this._renderButton(buttonStyle, buttonIcon, onOptionPress, this.props.moreOptionConfig.iconSize, button.color);

        moreOptionButtons.push(moreOptionButton);
      }
    }
  },

  _renderOpacity: function(buttonSelected, buttonName){
    var buttonOpacity;
    if(buttonSelected == "None" || buttonSelected == buttonName){
      buttonOpacity = this.props.moreOptionConfig.brightOpacity;
    }else{
      buttonOpacity = this.props.moreOptionConfig.darkOpacity;
    }

    return {opacity: buttonOpacity};
  },

  _renderIcon: function(buttonName){
    var buttonIcon;
    switch(buttonName){
          case "Discovery":
            buttonIcon = ICONS.DISCOVERY;
            break;
          case "Quality":
            buttonIcon = ICONS.QUALITY;
            break;
          case "CC":
            buttonIcon = ICONS.CC;
            break;
          case "Share":
            buttonIcon = ICONS.SHARE;
            break;
          case "Setting":
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
        style={this.props.buttonSelected != "None"? styles.rowBottom: styles.rowCenter}>
        {moreOptionButtons}
      </View>
    );
    
    var dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );


    var sharePanel;
    if(this.props.panelToShow == "Share"){
      sharePanel = this.props.sharePanel;
    }

    var moreOptionScreen = (
      <View style={styles.fullscreenContainer}>
        {sharePanel}
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

module.exports = MoreOptionScreen;