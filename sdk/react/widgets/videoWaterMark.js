import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Image,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';

import {
  BUTTON_NAMES,
  IMG_URLS,
  UI_SIZES
} from '../constants';

var ResponsiveDesignManager = require('../responsiveDesignManager');
var styles = require('../utils').getStyles(require('./style/videoWaterMarkStyles.json'));

class logo extends React.Component {
  static propTypes = {
    buttonWidth: PropTypes.number.isRequired,
    buttonHeight: PropTypes.number.isRequired,
    waterMarkName: PropTypes.string.isRequired,
  };

  renderLogo = () => {
    var waterMarkName = this.props.waterMarkName;
    var sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
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

module.exports = logo;
