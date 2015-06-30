var React = require('react-native');
var {
  StyleSheet,
  SliderIOS,
  Image,
  TouchableHighlight,
  View
} = React;

var Utils = require('./utils');
var styles = Utils.getStyles();

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
    	<View style={styles.waterMarkContainer}>
    		{waterMarkImage}
    	</View>
  	);
	}
});

module.exports = WaterMark