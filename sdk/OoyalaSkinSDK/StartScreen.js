
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/startScreenStyles.json'));
var Constants = require('./constants');
var {
  IMG_URLS
} = Constants;

var ICONS = require('./constants').ICONS;
var RectButton = require('./widgets/RectButton');

var StartScreen = React.createClass({
  propTypes: {
    config: React.PropTypes.object,
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    promoUrl: React.PropTypes.string,
    onPress: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  },

  handleClick: function() {
    this.props.onPress('PlayPause');
  },

  // Gets the play button based on the current config settings
  getPlayButton: function() {
    if(this.props.config.showPlayButton) {
      var buttonSize = Math.floor((this.props.height + this.props.width) * 0.05);
      console.log("buttonSize"+buttonSize);
      return (
        <RectButton
          icon={ICONS.PLAY}
          position={this.props.config.playButtonPosition}
          onPress={this.handleClick}
          opacity={0.5}
          frameWidth={this.props.width}
          frameHeight={this.props.height}
          buttonWidth={buttonSize * 2}
          buttonHeight={buttonSize * 2}
          fontSize={buttonSize}>
        </RectButton>)
    }
    return null;
  },

  // Gets the infoPanel based on the current config settings
  getInfoPanel: function() {
    var infoPanelTitle;
    if(this.props.config.showTitle) {
      infoPanelTitle = (<Text style={styles.infoPanelTitle}>{this.props.title}</Text>);
    }
    var infoPanelDescription;
    if(this.props.config.showDescription) {
      infoPanelDescription = (<Text style={styles.infoPanelDescription}>{this.props.description}</Text>);
    }

    var infoPanelLocation;
    switch (this.props.config.infoPanelPosition) {
      case "topLeft":
        infoPanelLocation = styles.infoPanelNW;
        break;
      case "bottomLeft":
        infoPanelLocation = styles.infoPanelSW;
        break;
      default:
        throw("Invalid infoPanel location " + this.props.config.infoPanelPosition);
    }

    return (
      <View style={infoPanelLocation}>
        {infoPanelTitle}
        {infoPanelDescription}
      </View>
    );
  },

  getPromoImage: function() {
    if (this.props.config.showPromo && this.props.promoUrl) {
      var fullscreen = (this.props.config.mode == 'default');

      return (
        <Image 
          source={{uri: this.props.promoUrl}}
          style={fullscreen ? styles.container : styles.promoImageSmall}
          resizeMode={Image.resizeMode.contain}>
        </Image>
      );
    }
    
    return null;
  },

  getWaterMark: function () {
    var waterMarkImageLocation = styles.SE;
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