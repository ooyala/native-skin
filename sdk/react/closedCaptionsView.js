'use strict';

var React = require('react-native');
var {
  requireNativeComponent,
  Platform
} = React;

if (Platform.OS === 'ios') {
  class ClosedCaptionsView extends React.Component {
    render() {
      if( this.props.captionJSON ) {
        return <OOClosedCaptionsView
                  {...this.props} />;
      }
      else {
        return null;
      }
    }
  }
  ClosedCaptionsView.propTypes = {
    captionJSON: React.PropTypes.object,
  };

  var OOClosedCaptionsView = requireNativeComponent('OOClosedCaptionsView', ClosedCaptionsView);
  module.exports = ClosedCaptionsView;
}
