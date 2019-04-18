import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View } from 'react-native';

import styles from './VideoWatermark.styles';

export default class VideoWatermark extends Component {
  static propTypes = {
    buttonWidth: PropTypes.number.isRequired,
    buttonHeight: PropTypes.number.isRequired,
    waterMarkName: PropTypes.string.isRequired,
  };

  render() {
    const { buttonHeight: height, buttonWidth: width, waterMarkName } = this.props;

    return (
      <View style={[styles.watermarkContainer]}>
        <Image
          resizeMode="contain"
          source={{ uri: waterMarkName }}
          style={{ height, width }}
        />
      </View>
    );
  }
}
