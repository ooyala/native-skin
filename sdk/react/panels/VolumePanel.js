'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {
  Animated,
  Slider,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  BUTTON_NAMES,
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
    config: PropTypes.object
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
          duration: constants.animationDuration,
          delay: 0
        }),
    ]).start();
  };

  _renderVolumeIcon= () => {

  };

  _renderVolumeIcon= () => {

  };

  render() {
    const animationStyle = {opacity:this.state.opacity};

    return (
      <Animated.View style={[styles.container, animationStyle]}>

      </Animated.View>
    );
  }

}

export default VolumePanel;
