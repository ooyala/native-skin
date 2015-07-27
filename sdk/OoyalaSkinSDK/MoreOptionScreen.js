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
var AnimationExperimental = require('AnimationExperimental');
var CollapsingBarUtils = require('./collapsingBarUtils');

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
    config: React.PropTypes.object,
    controlBarWidth: React.PropTypes.number
	},

  componentDidMount:function () {
    AnimationExperimental.startAnimation({
      node: this.refs.this,
      duration: 900,
      easing: 'linear',
      property: 'scaleXY',
      fromValue: [1, 0],
      toValue: [1, 1],
    });
    AnimationExperimental.startAnimation({
      node: this.refs.this,
      duration: 900,
      easing: 'linear',
      property: 'opacity',
      fromValue: 0,
      toValue: 1,
    });  
  },

  onOptionPress: function(buttonName) {
    AnimationExperimental.startAnimation({
      node: this.refs.this,
      duration: 900,
      easing: 'linear',
      property: 'opacity',
      fromValue: 0,
      toValue: 1,
    });  
    this.props.onOptionButtonPress(buttonName);
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
    var itemCollapsingResults = CollapsingBarUtils.collapse( this.props.config.controlBarWidth, this.props.config.buttons );
    var buttons = itemCollapsingResults.overflow;
    for(var i = 0; i < buttons.length; i++){
      var button = buttons[i];

      var moreOptionButton;
      var buttonOpacity = this._renderOpacity(this.props.buttonSelected, button.name);
      var buttonIcon = this._renderIcon(button.name);
      var buttonStyle = [styles.icon, buttonOpacity];

      // Skip unsupported buttons to avoid crashes. But log that they were unexpected.
      if( buttonOpacity === undefined || buttonIcon === undefined || buttonStyle === undefined ) {
        console.log( "ERROR: skipping unsupported More Options button ", button );
        continue;
      }

      var onOptionPress = function(buttonName, f){
        return function(){
          f(buttonName);
        };
      }(button.name, this.onOptionPress);

      moreOptionButton = this._renderButton([buttonStyle, this.props.config.moreOptions.iconStyle], buttonIcon.fontString, onOptionPress, this.props.config.moreOptions.iconSize, this.props.config.moreOptions.color, buttonIcon.fontFamilyName);

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
          case BUTTON_NAMES.SETTING: // TODO: this doesn't exist in the skin.json?
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
    
    var dismissButton = this._renderButton(styles.iconBright, this.props.config.icons.dismiss.fontString, this.props.onDismiss, dismissButtonSize, this.props.config.moreOptions.color, this.props.config.icons.dismiss.fontFamilyName);

    var moreOptionRow;
    if (!this.props.buttonSelected || this.props.buttonSelected == BUTTON_NAMES.NONE) {

      moreOptionRow = (
      <View
        ref='moreOptionRow' 
        style={styles.rowCenter}>
        {moreOptionButtons}
      </View>);
    }
    
    var dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );

    var moreOptionScreen = (
      <View ref='this' style={styles.fullscreenContainer}>
        {moreOptionRow}
        {this.props.panel}
        {dismissButtonRow}
      </View>
    );

    return moreOptionScreen;
  }
});

module.exports = MoreOptionScreen;