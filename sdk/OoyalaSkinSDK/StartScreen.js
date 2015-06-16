
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var ICONS = require('./constants').ICONS;
var IMG_URLS = require('./constants').IMG_URLS;

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

  render: function() {
    var fullscreenPromoImage = (this.props.config.mode == 'default');
    var playButtonLocation = styles.playButtonCenter;
    var playButton = (
        <TouchableHighlight
          onPress={this.handleClick}
          underlayColor="transparent"
          activeOpacity={0.5}>
          <Text style={styles.playButton}>{ICONS.PLAY}</Text>
        </TouchableHighlight>
      );

    var infoPanel;
    if (this.props.config.infoPanel) {
      infoPanel = (
        <View style={styles.infoPanelNW}>
          <Text style={styles.infoPanelTitle}>{this.props.title}</Text>
          <Text style={styles.infoPanelDescription}>{this.props.description}</Text>
        </View>
      );
    }

    var waterMarkImageLocation = styles.waterMarkImageSE;
    var waterMarkImage = (
      <Image style={[styles.waterMarkImage, waterMarkImageLocation]}
        source={{uri: IMG_URLS.OOYALA_LOGO}}
        resizeMode={Image.resizeMode.contain}>
      </Image>
      );

    
    if (fullscreenPromoImage) {   
      return (
        <Image 
          source={{uri: this.props.promoUrl}}
          style={styles.container}
          resizeMode={Image.resizeMode.contain}>
          {infoPanel}
          <View style={playButtonLocation}>
            {playButton}
          </View>
          {waterMarkImage}
        </Image>);
    } else {
      var promoImage = (
        <Image 
          source={{uri: this.props.promoUrl}}
          style={styles.promoImageSmall}
          resizeMode={Image.resizeMode.contain}>
        </Image>
      );
      return (
        <View style={styles.container}>
          <View style={playButtonLocation}>
            {playButton}
          </View>
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