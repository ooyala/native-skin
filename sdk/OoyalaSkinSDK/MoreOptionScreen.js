'use strict';

var React = require('react-native');
var {
  Animated,
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
var CollapsingBarUtils = require('./collapsingBarUtils');

var {
  BUTTON_NAMES,
  IMG_URLS,
} = Constants;

var dismissButtonSize = 20;
var animationDuration = 1000;

var MoreOptionScreen = React.createClass({
	propTypes: {
    height: React.PropTypes.number,
    onDismiss: React.PropTypes.func,
    onSocialButtonPress: React.PropTypes.func,
    panel: React.PropTypes.object,
    buttonSelected: React.PropTypes.string,
    onOptionButtonPress: React.PropTypes.func,
    config: React.PropTypes.object,
    controlBarWidth: React.PropTypes.number
	},

  getInitialState: function() {
    return {
      translateY: new Animated.Value(this.props.height),
      opacity: new Animated.Value(0),
      rowTranslateY: new Animated.Value(0),
    };
  },

  componentDidMount:function () {
    this.state.translateY.setValue(this.props.height);
    this.state.opacity.setValue(0);
    Animated.parallel([
      Animated.timing(                      
        this.state.translateY,                 
        {
          toValue: 0,                         
          duration: animationDuration,
          delay: 0  
        }),
      Animated.timing(                      
        this.state.opacity,                 
        {
          toValue: 1,                         
          duration: animationDuration,
          delay: 0  
        }),
    ]).start();
  },

  onAnimationComplete: function(result){
    this.props.onOptionButtonPress(this.state.button);
  },

  onOptionPress: function(buttonName) {
    this.setState({button:buttonName});
    Animated.timing(
      this.state.rowTranslateY,{
        toValue: this.props.height / 2 - 32,
        duration: animationDuration,
        delay: 0
      }
    ).start(this.onAnimationComplete);
    
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

      moreOptionButton = this._renderButton(buttonStyle, buttonIcon.fontString, onOptionPress, this.props.config.moreOptions.iconSize, this.props.config.moreOptions.color, buttonIcon.fontFamilyName);

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
      var rowAnimateStyle = {transform: [{translateY: this.state.rowTranslateY}]};
      moreOptionRow = (
        <Animated.View
          ref='moreOptionRow' 
          style={[styles.rowCenter, rowAnimateStyle]}>
          {moreOptionButtons}
        </Animated.View>
      );
    }else{
      moreOptionRow = (
        <View
          ref='moreOptionRow' 
          style={styles.rowBottom}>
          {moreOptionButtons}
        </View>
      );
    }
    
    var dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );
    var animationStyle = {transform:[{translateY:this.state.translateY},], opacity:this.state.opacity}
    var moreOptionScreen = (
      <Animated.View style={[styles.fullscreenContainer, animationStyle]}>
        {moreOptionRow}
        {this.props.panel}
        {dismissButtonRow}
      </Animated.View>
    );

    return moreOptionScreen;
  }
});

module.exports = MoreOptionScreen;