var React = require('react-native');
var {
  StyleSheet,
  Text,
  View
} = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/infoPanelStyles.json'));

var InfoPanel = React.createClass ({
	propTypes: {
   title: React.PropTypes.string,
   description: React.PropTypes.string,
  },

  render: function() {
    var infoPanel;

    infoPanel = (
      <View style={styles.infoPanelNW}>
        <Text style={styles.infoPanelTitle}>{this.props.title}</Text>
        <Text style={styles.infoPanelDescription}>{this.props.description}</Text>
      </View>
    );

    return (
      <View style={styles.container}>
        {infoPanel}
      </View>
    );

  }
});

module.exports = InfoPanel;