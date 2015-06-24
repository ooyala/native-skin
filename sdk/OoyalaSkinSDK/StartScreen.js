
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var Constants = require('./constants');
var {
  IMG_URLS
} = Constants;

var ICONS = require('./constants').ICONS;

var StartScreen = React.createClass({
  propTypes: {
    config: React.PropTypes.object,
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    promoUrl: React.PropTypes.string,
    onPress: React.PropTypes.func,
  },

  handleClick: function() {
    this.props.onPress('PlayPause');
  },

  // Gets the play button based on the current config settings
  getPlayButton: function() {

    var playButtonLocation;
    switch (this.props.config.playButtonPosition) {
      case "center":
        playButtonLocation = styles.playButtonCenter;
        break;
      case "bottomLeft":
        playButtonLocation = styles.playButtonSW;
        break;
      default:
        throw("Invalid play button location " + this.props.config.playButtonPosition);
    }
    
    return (
      <View style={playButtonLocation}>
        <TouchableHighlight
          onPress={this.handleClick}
          underlayColor="transparent"
          activeOpacity={0.5}>
          <Text style={styles.playButton}>{ICONS.PLAY}</Text>
        </TouchableHighlight>
      </View>
    );
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

  render: function() {
    var fullscreenPromoImage = (this.props.config.mode == 'default');
    
    var playButton;
    if(this.props.config.showPlayButton) {
      playButton = this.getPlayButton();
    }
    var infoPanel = this.getInfoPanel();

    var waterMarkImageLocation = styles.waterMarkImageSE;
    var waterMarkImage = (
      <Image style={[styles.waterMarkImage, waterMarkImageLocation]}
        source={{uri: IMG_URLS.OOYALA_LOGO}} 
        resizeMode={Image.resizeMode.contain}>
      </Image>
      );

    var promoUrl;
    if(this.props.config.showPromo) {
      promoUrl = this.props.promoUrl;
    }
    
    if (fullscreenPromoImage) {   
      return (
        <Image 
          source={{uri: promoUrl}}
          style={styles.container}
          resizeMode={Image.resizeMode.contain}>
          {infoPanel}
          {playButton}
          {waterMarkImage}
        </Image>);
    } else {
      var promoImage = (
        <Image 
          source={{uri: promoUrl}}
          style={styles.promoImageSmall}
          resizeMode={Image.resizeMode.contain}>
        </Image>
      );
      return (
        <View style={styles.container}>
          {playButton}
          {promoImage}
          {infoPanel}
          {waterMarkImage}
        </View>
      );
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },

  promoImageSmall: {
    width: 180,
    height: 90,
    margin: 20,
  },

  infoPanelNW: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },

  infoPanelSW: {
    position: 'absolute',    
    bottom: 0,
    left: 0
  },

  infoPanelTitle: {
    textAlign: 'left',
    fontSize: 20,
    fontFamily: 'Arial-BoldMT',
    color: 'white',
    marginTop: 20,
    marginLeft: 10
  },

  infoPanelDescription: {
    textAlign: 'left',
    fontSize: 16,
    fontFamily: 'ArialMT',
    color: 'white',
    margin: 10
  },

  playButtonCenter: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  playButtonSE: {
    position: 'absolute',    
    bottom: 0,
    right: 0
  },

  playButtonSW: {
    position: 'absolute',    
    bottom: 0,
    left: 0
  },

  playButton: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'fontawesome',
    margin: 10
  },

  waterMarkImageSW: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },

  waterMarkImageSE: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

  waterMarkImage: {
    width:160,
    height: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 10
  }
});

module.exports = StartScreen;