// @flow

import PropTypes from 'prop-types';
import React from 'react';
import { Image, View } from 'react-native';

import styles from './VideoWatermark.styles';

const VideoWatermark = ({ buttonHeight: height, buttonWidth: width, waterMarkName }) => (
  <View style={[styles.watermarkContainer]}>
    <Image
      resizeMode="contain"
      source={{ uri: waterMarkName }}
      style={{ height, width }}
    />
  </View>
);

VideoWatermark.propTypes = {
  buttonWidth: PropTypes.number.isRequired,
  buttonHeight: PropTypes.number.isRequired,
  waterMarkName: PropTypes.string.isRequired,
};

export default VideoWatermark;
