'use strict';

var React = require('react-native');
var {
  Text,
  requireNativeComponent
} = React;

class ClosedCaptionsView extends React.Component {
  render() {
    return <OOSkinClosedCaptionsView {...this.props}/>;
  }
}

ClosedCaptionsView.propTypes = {
};

var OOSkinClosedCaptionsView = requireNativeComponent('OOSkinClosedCaptionsView', ClosedCaptionsView);

module.exports = ClosedCaptionsView;

