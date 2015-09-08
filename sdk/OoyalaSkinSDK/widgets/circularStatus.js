
/**
 * Created by dkao on 9/4/15.
 */
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  } = React;

var styles = require('../utils').getStyles(require('./style/CircularStatus.json'));

var CircularStatus = React.createClass({
  propTypes: {
    current: React.PropTypes.number,
    total: React.PropTypes.number
  },

  // Gets the play button based on the current config settings
  render: function() {
    return (<View style={styles.circle}>
    </View>);
  }
});

module.exports = CircularStatus;
