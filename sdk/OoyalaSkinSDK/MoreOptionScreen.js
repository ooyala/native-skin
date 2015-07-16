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
    onDismiss: React.PropTypes.func,
    onSocialButtonPress: React.PropTypes.func,
    panel: React.PropTypes.object,
    buttonSelected: React.PropTypes.string,
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
        var budsfasdttonIcon;dadfsadfasdfsad
        if(this.props.buttonSelected == "None"|| this.props.buttonSelected == button.name){
          buttonStyle = styles.iconBright;
        }else{
          buttonStyle = styles.iconDark;
        }
        
        switch(button.name){
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