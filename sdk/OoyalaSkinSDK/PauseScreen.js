var React = require('react-native');

var {
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/pauseScreenStyles.json'));
var WaterMark = require('./waterMark');
var InfoPanel = require('./infoPanel');
var ICONS = require('./constants').ICONS;

var PauseScreen = React.createClass({
  propTypes: {
   config: React.PropTypes.object,
   title: React.PropTypes.string,
   duration: React.PropTypes.number,
   description: React.PropTypes.string,
   onPress: React.PropTypes.func,
  },

	getInitialState: function() {
    return {};
  },

  handleClick: function() {
    this.props.onPress('Play'); // assuming 'default' presentation.
  },

  handleTouchEnd: function(event) {
    this.props.onPress('Play'); // assuming 'default' presentation.
  },

  render: function() {
   var playButtonLocation = styles.playButtonCenter; // assuming 'default' presentation.
   var playButton = this._renderPlayButton();
   var infoPanel = <Text>Info</Text>;
   var waterMarkImage = this._renderWaterMarkImage();
   return (
     <View style={styles.container}>
       <View style={playButtonLocation}>
        {playButton}
       </View>
       {infoPanel}
       {waterMarkImage}
     </View>
     );
  },

  _renderPlayButton: function() {
    return (
      <TouchableHighlight
        onPress={this.handleClick}
        underlayColor="transparent"
        activeOpacity={0.5}>
        <Text style={styles.playButton}>{ICONS.PLAY}</Text>
      </TouchableHighlight>
    );
  },

  _renderWaterMarkImage: function() {
    var waterMarkImageLocation = styles.waterMarkImageSE;
    return (
      <Image style={[styles.waterMarkImage, waterMarkImageLocation]}
        source={{uri: 'http://www.palantir.net/presentations/dcamsterdam2014-decoupled-drupal-silex/assets/ooyala-logo.png'}}
        resizeMode={Image.resizeMode.contain}>
      </Image>
    );
  }

});

module.exports = PauseScreen;
