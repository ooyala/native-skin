'use strict';

var React = require('react-native');
var {
  Animated,
  Text,
  View
} = React;

var Utils = require('./utils');
var styles = Utils.getStyles(require('./style/languageSelectionPanelStyles.json'));

var LanguageSelectionPreview = React.createClass({
  propTypes: {
    height: React.PropTypes.number,
    config: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      height: new Animated.Value(0)
    };
  },

  _getStyle: function() {
    return [
      styles.previewPanel,
      {
        'height': 60
      }
    ];
  },

  render: function() {
    return (
      <Animated.View style={this._getStyle()}>
        <View style={styles.splitter} />
        <Text style={styles.buttonText}>{Utils.localizedString(this.props.config.locale, 'CLOSE CAPTION PREVIEW', this.props.config.localizableStrings)}</Text>
        <Text style={styles.buttonText}>{Utils.localizedString(this.props.config.locale, 'Sample Text', this.props.config.localizableStrings)}</Text>
      </Animated.View>
    );
  }
});

module.exports = LanguageSelectionPreview;