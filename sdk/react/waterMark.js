import React, { Component } from 'react';
import {
  Image,
  View
} from 'react-native';

import Utils from './utils';
const styles = Utils.getStyles();

class WaterMark extends Component {
    render() {
		const waterMarkImageLocation = styles.waterMarkImageSE;
  	const waterMarkImage = (
			<Image style={[styles.waterMarkImage, waterMarkImageLocation]}
				source={{uri: this.props.general.watermark.url}}
				resizeMode="contain">
	    </Image>
  	);

  	return (
    	<View style={styles.waterMarkContainer}>
    		{waterMarkImage}
    	</View>
  	);
	}
}

module.exports = WaterMark;
