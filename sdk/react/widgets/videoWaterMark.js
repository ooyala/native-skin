import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  View
} from 'react-native';

import Utils from '../utils';

import videoWaterMarkStyles from './style/videoWaterMarkStyles.json';
const styles = Utils.getStyles(videoWaterMarkStyles);

class VideoWaterMark extends Component {
  static propTypes = {
    buttonWidth: PropTypes.number.isRequired,
    buttonHeight: PropTypes.number.isRequired,
    waterMarkName: PropTypes.string.isRequired,
  };

  renderLogo = () => {
    const waterMarkName = this.props.waterMarkName;
    const sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    return (
        <View style={[styles.watermarkContainer]}>
          <Image
            style={sizeStyle}
            source={{uri: waterMarkName}}
            resizeMode="contain"/>
        </View>
      );
    };

  render() {
    return this.renderLogo();
  }
}

module.exports = VideoWaterMark;
