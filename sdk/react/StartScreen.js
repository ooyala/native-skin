
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var Utils = require('./utils');
var Log = require('./log');
var styles = Utils.getStyles(require('./style/startScreenStyles.json'));
var Constants = require('./constants');
var {
  PLATFORMS,
  IMG_URLS,
  UI_SIZES,
  BUTTON_NAMES,
} = Constants;

var RectButton = require('./widgets/RectButton');
var VideoViewPlayPause = require('./widgets/VideoViewPlayPause');
var VideoViewPlayPauseAndroid = require('./widgets/VideoViewPlayPauseAndroid');
var ResponsiveDesignManager = require('./responsiveDesignManager');

var StartScreen = React.createClass({
  propTypes: {
    config: React.PropTypes.object,
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    promoUrl: React.PropTypes.string,
    onPress: React.PropTypes.func,
    playhead: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    platform: React.PropTypes.string,
  },

  handleClick: function() {
    this.props.onPress(BUTTON_NAMES.PLAY);
  },
  // Gets the play button based on the current config settings
  getPlayButton: function() {
    var iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.VIDEOVIEW_PLAYPAUSE);
      if(this.props.config.startScreen.showPlayButton) {
        if(this.props.platform == Constants.PLATFORMS.ANDROID) {
          return (
          <VideoViewPlayPauseAndroid
            icons={{
              play: {
                icon: this.props.config.icons.play.fontString,
                fontFamily: this.props.config.icons.play.fontFamilyName
              },
              pause: {
                icon: this.props.config.icons.pause.fontString,
                fontFamily: this.props.config.icons.pause.fontFamilyName
              }
            }}
            position={this.props.config.startScreen.playButtonPosition}
            onPress={this.handleClick}
            buttonStyle={this.props.config.startScreen.playIconStyle}
            frameWidth={this.props.width}
            frameHeight={this.props.height}
            playhead={this.props.playhead}
            buttonWidth={iconFontSize}
            buttonHeight={iconFontSize}
            fontSize={iconFontSize}
            playing={false}
            showButton={true}
            isStartScreen={true}>
          </VideoViewPlayPauseAndroid>)
    }
    else if(this.props.platform == Constants.PLATFORMS.IOS){
        return (
          <VideoViewPlayPause
          icons={{
            play: {
              icon: this.props.config.icons.play.fontString,
              fontFamily: this.props.config.icons.play.fontFamilyName
            },
            pause: {
              icon: this.props.config.icons.pause.fontString,
              fontFamily: this.props.config.icons.pause.fontFamilyName
            }
          }}
          position={this.props.config.startScreen.playButtonPosition}
          onPress={this.handleClick}
          buttonStyle={this.props.config.startScreen.playIconStyle}
          frameWidth={this.props.width}
          frameHeight={this.props.height}
          playhead={this.props.playhead}
          buttonWidth={iconFontSize}
          buttonHeight={iconFontSize}
          fontSize={iconFontSize}
          playing={false}
          showButton={true}>
        </VideoViewPlayPause>);
      }
  }
  return null;
  },

  //Gets the infoPanel based on the current config settings
  getInfoPanel: function() {
    var infoPanelTitle;
    if(this.props.config.startScreen.showTitle) {
      infoPanelTitle = (<Text style={[styles.infoPanelTitle, this.props.config.startScreen.titleFont]}>{this.props.title}</Text>);
    }
    var infoPanelDescription;
    if(this.props.config.startScreen.showDescription) {
      infoPanelDescription = (<Text style={[styles.infoPanelDescription, this.props.config.startScreen.descriptionFont]}>{this.props.description}</Text>);
    }

    var infoPanelLocation;
    switch (this.props.config.startScreen.infoPanelPosition) {
      case "topLeft":
        infoPanelLocation = styles.infoPanelNW;
        break;
      case "bottomLeft":
        infoPanelLocation = styles.infoPanelSW;
        break;
      default:
        throw("Invalid infoPanel location " + this.props.config.startScreen.infoPanelPosition);
    }

    return (
      <View style={infoPanelLocation}>
        {infoPanelTitle}
        {infoPanelDescription}
      </View>
    );
  },

  getPromoImage: function() {
    if (this.props.config.startScreen.showPromo && this.props.promoUrl) {
      var fullscreen = (this.props.config.startScreen.promoImageSize == 'default');

      return (
        <Image 
          source={{uri: this.props.promoUrl}}
          style={fullscreen ? 
            {position:'absolute', top:0, left:0, width:this.props.width, height: this.props.height} :
             styles.promoImageSmall}
          resizeMode={Image.resizeMode.contain}>
        </Image>
      );
    }
    
    return null;
  },

  getWaterMark: function () {
    var waterMarkImageLocation = styles.waterMarkImageSE;
    return (
      <Image style={[styles.waterMarkImage, waterMarkImageLocation]}
        source={{uri: IMG_URLS.OOYALA_LOGO}} 
        resizeMode={Image.resizeMode.contain}>
      </Image>
    );
  },

  render: function() {  
    var promoImage = this.getPromoImage();
    var playButton = this.getPlayButton();
    var infoPanel = this.getInfoPanel();
    var waterMarkImage = this.getWaterMark();
 

    return (
     <View style={styles.container}>
       {promoImage}
       {waterMarkImage}
       {infoPanel} 
       {playButton}
      </View>
   );

  },
});
module.exports = StartScreen;