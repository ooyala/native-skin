var React = require('react-native');
var {
  StyleSheet,
  SliderIOS,
  Image,
  TouchableHighlight,
  View
} = React;

var eventBridge = require('NativeModules').OOReactBridge;

var ICONS = require('./constants').ICONS;

var WaterMark = React.createClass ({
	render: function() {
		var waterMarkImageLocation = styles.waterMarkImageSE;
    	var waterMarkImage = (
      		<Image style={[styles.waterMarkImage, waterMarkImageLocation]}
		        source={{uri: 'http://www.palantir.net/presentations/dcamsterdam2014-decoupled-drupal-silex/assets/ooyala-logo.png'}} 
		        resizeMode={Image.resizeMode.contain}>
		    </Image>
      	);

    	return (
	      	<View style={styles.container}>
	      		{waterMarkImage}
	      	</View>
      	);
	}
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    height: 8
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

module.exports = WaterMark