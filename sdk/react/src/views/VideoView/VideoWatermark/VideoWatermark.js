// @flow

import React from 'react';
import { Image, View } from 'react-native';

import styles from './VideoWatermark.styles';

type Props = {
  buttonHeight: number,
  buttonWidth: number,
  waterMarkName: string,
};

const VideoWatermark = ({ buttonHeight: height, buttonWidth: width, waterMarkName }: Props) => (
  <View style={[styles.watermarkContainer]}>
    <Image
      resizeMode="contain"
      source={{ uri: waterMarkName }}
      style={{ height, width }}
    />
  </View>
);

export default VideoWatermark;
