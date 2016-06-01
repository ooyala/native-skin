'use strict';

import React, { Component } from 'react';
import {
  requireNativeComponent
} from 'react-native';

class GradientView extends React.Component {
  render() {
    return <OOGradientView {...this.props} pointerEvents='none'/>;
  }
}

GradientView.propTypes = {};
var OOGradientView = requireNativeComponent('OOGradientView', GradientView);
module.exports = GradientView;

