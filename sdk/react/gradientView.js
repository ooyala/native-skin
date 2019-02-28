import React, { Component } from 'react';
import {
  requireNativeComponent
} from 'react-native';

class GradientView extends Component {
  render() {
    return <OOGradientView {...this.props} pointerEvents='none'/>;
  }
}

GradientView.propTypes = {};
const OOGradientView = requireNativeComponent('OOGradientView', GradientView);

export default GradientView;
