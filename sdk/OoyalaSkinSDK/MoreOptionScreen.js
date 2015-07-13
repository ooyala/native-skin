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

var moreOptionButtonSize = 30;
var dismissButtonSize = 20;

var MoreOptionScreen = React.createClass({
	propTypes: {
    onPress: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    onSocialButtonPress: React.PropTypes.func,
    sharePanel: React.PropTypes.object,
    buttonSelected: React.PropTypes.string,
    panelToShow: React.PropTypes.string,
    onOptionButtonPress: React.PropTypes.func,
    buttons: React.PropTypes.array,
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

  _renderMoreOptionButtons: function(moreOptionButtons){
    for(var i = 0; i < this.props.buttons.length; i++){
      var button = this.props.buttons[i];

      if(button.type == "FeatureOptions" || button.type == "MoreOptions"){
        var moreOptionButton;
        var buttonStyle;
        var buttonIcon;

        if(this.props.buttonSelected == "None"|| this.props.buttonSelected == button.name){
          buttonStyle = styles.iconBright;
        }else{
          buttonStyle = styles.iconDark;
        }
        
        switch(button.name){
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

        var onOptionPress = function(buttonName, f){
          return function(){
            f(buttonName);
          };
        }(button.name, this.props.onOptionButtonPress);

        moreOptionButton = this._renderButton(buttonStyle, buttonIcon, onOptionPress, moreOptionButtonSize);

        moreOptionButtons.push(moreOptionButton);
      }
    }
  },

	render: function() {
<<<<<<< HEAD
    var discoveryButton = this._renderIconButton(ICONS.DISCOVERY, this.onOptionButtonPress);
    var qualityButton = this._renderIconButton(ICONS.QUALITY, this.onPlayPausePress);
    var ccButton = this._renderIconButton(ICONS.CC, this.onPlayPausePress);
    var shareButton = this._renderIconButton(ICONS.SHARE, this.onPlayPausePress);
    var settingButton = this._renderIconButton(ICONS.SETTING, this.onPlayPausePress);

    var dismissButton = this._renderButton([styles.closeIconStyle, styles.topRight], ICONS.CLOSE, this.onDismissPress);
=======
    var moreOptionButtons = [];
    this._renderMoreOptionButtons(moreOptionButtons);
    
    var dismissButton = this._renderButton(styles.iconBright, ICONS.DISMISS, this.props.onDismiss, dismissButtonSize);
>>>>>>> master

    var moreOptionRow = (
      <View
        ref='moreOptionRow' 
        style={this.props.buttonSelected != "None"? styles.rowBottom: styles.rowCenter}>
        {moreOptionButtons}
      </View>
    );
    
<<<<<<< HEAD
    var moreOptionScreen = (
      <View style={styles.container}>
        {this.props.discovery}
        {dismissButton}
=======
    var dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );


    var sharePanel;
    if(this.props.panelToShow == "Share"){
      console.log("i am into it, ");
      sharePanel = this.props.sharePanel;
    }

    var moreOptionScreen = (
      <View style={styles.fullscreenContainer}>
        {sharePanel}
        {dismissButtonRow}
        {moreOptionRow}
>>>>>>> master
      </View>
    );

    return moreOptionScreen;
  }
});

module.exports = MoreOptionScreen;