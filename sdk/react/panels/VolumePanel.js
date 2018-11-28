'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {
  Animated,
  Slider,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import {
  BUTTON_NAMES,
  UI_SIZES,
  CELL_TYPES
} from '../constants';

const Utils = require('../utils');
const styles = Utils.getStyles(require('./style/VolumePanelStyles'));

const constants = {
  animationDuration: 1000
}

class VolumePanel extends React.Component {
  static propTypes = {
    onDismiss: PropTypes.func,
    volume: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    config: PropTypes.object,
  };

  state = {
    opacity: new Animated.Value(0)
  };

  componentDidMount() {
    this.state.opacity.setValue(0);
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: constants.animationDuration
        }),
    ]).start();
  };

  _renderVolumeIcon= () => {
    const iconConfig = (this.props.volume > 0) ? this.props.config.icons.volume : this.props.config.icons.volumeOff;
    const fontFamilyStyle = {fontFamily: iconConfig.fontFamilyName};

    return (
      <View style={styles.volumeIconContainer}>
        <Text style={[styles.volumeIcon, fontFamilyStyle]}>
          {iconConfig.fontString}
        </Text>
      </View>
    );
  };

  _renderVolumeSlider= () => {
    return (
      <View style={styles.sliderContainer}>
        <Slider
          step={1}
          maximumValue={100}
          // onValueChange={this.change.bind(this)}
          value={40}
        /> 
      </View>
    );
  };


  render() {
    const animationStyle = {opacity: this.state.opacity};

    return (
      <Animated.View style={[styles.container, animationStyle]}>
        {this._renderVolumeIcon()}
        {this._renderVolumeSlider()}
      </Animated.View>
    );
  }

}

export default VolumePanel;
