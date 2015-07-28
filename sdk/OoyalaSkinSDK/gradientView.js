'use strict';

var React = require('react-native');
var {
  requireNativeComponent
} = React;

class GradientView extends React.Component {
  render() {
    return <OOGradientView {...this.props} pointerEvents='none'/>;
  }
}

var OOGradientView = requireNativeComponent('OOGradientView', GradientView);
module.exports = GradientView;

