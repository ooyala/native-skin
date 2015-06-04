'use strict';

var React = require('react-native');
var {
  requireNativeComponent
} = React;

class ClosedCaptionsView extends React.Component {
  render() {
    return <OOClosedCaptionsView
              {...this.props}
              pointerEvents='none'/>;
  }
}
ClosedCaptionsView.propTypes = {
  captionJSON: React.PropTypes.object,
};

var OOClosedCaptionsView = requireNativeComponent('OOClosedCaptionsView', ClosedCaptionsView);
module.exports = ClosedCaptionsView;

