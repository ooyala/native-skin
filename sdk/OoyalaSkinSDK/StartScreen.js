
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

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

  render: function() {
    var playButtonLocation = this.props.config.mode == 'default' ? styles.playButtonCenter : styles.playButtonSW;
    
    var playButton = (
      <TouchableHighlight
        onPress={this.handleClick}
        underlayColor="transparent"
        activeOpacity={0.5}>
        <Text style={[styles.playButton, playButtonLocation]}>{ICONS.PLAY}</Text>
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

    var watermarkImage = (
      <Image style={[styles.waterMarkImage, styles.waterMarkImageSE]}
        source={{uri: 'http://www.palantir.net/presentations/dcamsterdam2014-decoupled-drupal-silex/assets/ooyala-logo.png'}} 
        resizeMode={Image.resizeMode.contain}>
      </Image>);

    //default: use the promo image as the background        
    return (
      <Image 
        source={{uri: this.props.promoUrl}}
        style={styles.container}
        resizeMode={Image.resizeMode.contain}>
        {infoPanel}
        {playButton}
        {watermarkImage}
      </Image>);
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  promoImageSmall: {
    position: 'absolute',
    width: 180,
    height: 90,
    bottom: 50
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
    margin: 10
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
    bottom: 0,
    left: 0,
  },

  waterMarkImageSE: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

  waterMarkImage: {
    width:160,
    height: 24,
    backgroundColor: 'transparent',
    margin: 10
  }
});

module.exports = StartScreen;