import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  View
} from 'react-native';

import * as Utils from '../../../lib/utils';

import videoWaterMarkStyles from './VideoWatermark.styles';
const styles = Utils.getStyles(videoWaterMarkStyles);

export default class VideoWatermark extends Component {
  static propTypes = {
    buttonWidth: PropTypes.number.isRequired,
    buttonHeight: PropTypes.number.isRequired,
    waterMarkName: PropTypes.string.isRequired
  };

  renderLogo = () => {
    const waterMarkName = this.props.waterMarkName;
    const sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    return (
        <View style={[styles.watermarkContainer]}>
          <Image
            style={sizeStyle}
            source={{uri: waterMarkName}}
            resizeMode='contain'/>
        </View>
      );
    };

  render() {
    return this.renderLogo();
  }
}
