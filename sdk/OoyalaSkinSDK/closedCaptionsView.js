'use strict';

var React = require('react-native');
var {
  Text,
  requireNativeComponent
} = React;

class ClosedCaptionsView extends React.Component {
  render() {
    return <OOClosedCaptionsView {...this.props}/>;
  }
}

ClosedCaptionsView.propTypes = {
};

var OOClosedCaptionsView = requireNativeComponent('OOClosedCaptionsView', ClosedCaptionsView);

module.exports = ClosedCaptionsView;

