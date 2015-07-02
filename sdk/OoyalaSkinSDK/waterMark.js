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
var config = require('./skin-config/skin.json');

var ICONS = require('./constants').ICONS;

var WaterMark = React.createClass ({
	render: function() {
		var waterMarkImageLocation = styles.waterMarkImageSE;
  	var waterMarkImage = (
    		<Image style={[styles.waterMarkImage, waterMarkImageLocation]}
	        source={{uri: config.general.watermark.url}} 
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