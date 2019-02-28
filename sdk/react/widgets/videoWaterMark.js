import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Image,
  View
} from 'react-native';

import Utils from '../utils';
const styles = Utils.getStyles(require('./style/videoWaterMarkStyles.json'));

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

export default VideoWaterMark;
