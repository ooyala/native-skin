'use strict';

var React = require('react-native');
var {
  requireNativeComponent
} = React;

class ClosedCaptionsView extends React.Component {
  render() {
    return <OOClosedCaptionsView {...this.props}/>;
  }
}
ClosedCaptionsView.propTypes = {
  caption: React.PropTypes.string,
};

var OOClosedCaptionsView = requireNativeComponent('OOClosedCaptionsView', ClosedCaptionsView);
module.exports = ClosedCaptionsView;

