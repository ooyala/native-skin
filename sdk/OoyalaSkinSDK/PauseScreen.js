var React = require('react-native');

var {
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var styles = require('./pauseScreenStyles');
var WaterMark = require('./waterMark');
var InfoPanel = require('./infoPanel');
var ICONS = require('./constants').ICONS;

var PauseScreen = React.createClass({
  propTypes: {
   config: React.PropTypes.object,
   title: React.PropTypes.string,
   duration: React.PropTypes.number,
   description: React.PropTypes.string,
   promoUrl: React.PropTypes.string,
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
   var playButtonLocation = styles.playButtonCenter;
   var promoImage = this._renderPromoImage();
   var playButton = this._renderPlayButton();
   var infoPanel = <Text>Info</Text>;
   return (
     <View style={styles.container}>
       <View style={playButtonLocation}>
        {playButton}
       </View>
       {promoImage}
       {infoPanel}
     </View>
     );
  },

  _renderPromoImage: function() {
    return (
      <Image
      source={{uri: this.props.promoUrl}}
      style={styles.promoImageSmall}
      resizeMode={Image.resizeMode.contain}>
      </Image>
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
  }

});

module.exports = PauseScreen;
