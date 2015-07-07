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
var config = require('./skin-config/skin.json');
var SharePanel = require('./sharePanel');

var {
  ICONS,
  BUTTON_NAMES,
  IMG_URLS,
} = Constants;

var moreOptionButtonSize = 30;
var dismissButtonSize = 20;

var MoreOptionScreen = React.createClass({
  getInitialState: function(){
    return {
      buttonSelected: "None",
      panelShow: "None"
    }
  },

	propTypes: {
    onPress: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    onSocialButtonPress: React.PropTypes.func,
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

  onOptionButtonPress: function(button) {
    LayoutAnimation.configureNext(animations.layout.easeInEaseOut);

    this.setState({buttonSelected: button});
    this.setState({panelShow: button});
  },

  _renderMoreOptionButtons: function(moreOptionButtons){
    for(var i = 0; i < config.buttons.length; i++){
      var button = config.buttons[i];

      if(button.type == "FeatureOptions" || button.type == "MoreOptions" && button.name != "Dismiss"){
        var moreOptionButton;
        var buttonStyle;
        var buttonIcon;

        if(this.state.buttonSelected == "None"|| this.state.buttonSelected == button.name){
          buttonStyle = styles.iconSelected;
        }else{
          buttonStyle = styles.iconUnselected;
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
        }(button.name, this.onOptionButtonPress);

        moreOptionButton = this._renderButton(buttonStyle, buttonIcon, onOptionPress, moreOptionButtonSize);

        moreOptionButtons.push(moreOptionButton);
      }
    }
  },

	render: function() {
    var moreOptionButtons = [];
    this._renderMoreOptionButtons(moreOptionButtons);
    
    var dismissButton = this._renderButton(styles.iconSelected, ICONS.DISMISS, this.props.onDismiss, dismissButtonSize);

    var moreOptionRow = (
      <View
        ref='moreOptionRow' 
        style={this.state.buttonSelected != "None"? styles.rowBottom: styles.rowCenter}>
        {moreOptionButtons}
      </View>
    );
    
    var dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );

    var sharePanel = (
      <SharePanel
        isShow= {this.state.panelShow == "Share"}
        socialButtons={config.sharing}
        onSocialButtonPress={(socialType) => this.props.onSocialButtonPress(socialType)} />
    );

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