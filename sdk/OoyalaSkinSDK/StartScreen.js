
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
    var playButtonLocation; = 
    if  this.props.mode == 'default' ? ;
    
    var playButton = (
      <TouchableHighlight
        onPress={this.handleClick}
        underlayColor="transparent"
        activeOpacity={0.5}>
        <Text style={[styles.playButtonStyle, playButtonLocation]}>{ICONS.PLAY}</Text>
      </TouchableHighlight>);

    var infoPanel;
    if (this.props.config.infoPanel) {
      infoPanel =
    }

    var watermarkImage = (
      <Image style={[waterMarkImage, waterMarkImageSE]}
        source={{uri: 'http://www.palantir.net/presentations/dcamsterdam2014-decoupled-drupal-silex/assets/ooyala-logo.png'}} 
        resizeMode={Image.resizeMode.contain}>
      </Image>);

    var promoImage;
    if (this.props.promoUrl) {
      var promoImageStyle = {};
      if (this.props.config.mode != 'default') {
        promoImageStyle = styles.promoImageSmall;
      }

      promoImage = (
        <Image style={promoImageStyle}>
          source={{uri: this.props.promoUrl}} 
          resizeMode={Image.resizeMode.stretch}>
        </Image>);
    }
                 
    return (
      <View>
        {promoImage}
        {playButton}
        {infoPanel}
        {watermarkImage}
      </View>);
  }
});

var styles = StyleSheet.create({
  promoImageSmall: {
    position: 'absolute',
    width: 180,
    height: 90,
    bottom: 50
  },

  infoPanelNW: {
    position: 'absolute',    
    top: 0,
    left: 0
  },

  infoPanelSW: {
    position: 'absolute',    
    bottom: 0,
    left: 0
  },

  infoPanel: {
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'transparent',
    color: 'white',
    margin: 10
  },

  playButtonCenter: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center'
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
    left: 0
  },

  waterMarkImageSE: {
    position: 'absolute',
    bottom: 0,
    right: 0
  },

  waterMarkImage: {
    width:100,
    height: 16,
    backgroundColor: 'transparent',
    margin: 10
  }
});

module.exports = StartScreen;