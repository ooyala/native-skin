'use strict';

var React = require('react-native');
var {
  Animated,
  Text,
  View
} = React;

var Utils = require('./utils');
var styles = Utils.getStyles(require('./panels/style/languageSelectionPanelStyles.json'));

var Constants = require('./constants');
var {
  UI_SIZES
} = Constants;

var LanguageSelectionPreview = React.createClass({
  propTypes: {
    config: React.PropTypes.object,
    isVisible: React.PropTypes.bool
  },

  getInitialState() {
    return {
      height: new Animated.Value(this.props.isVisible ? UI_SIZES.CC_PREVIEW_HEIGHT: 0)
    };
  },

  componentDidUpdate(prevProps, prevState) {
    this.state.height.setValue(this.props.isVisible ? 0 : UI_SIZES.CC_PREVIEW_HEIGHT);
    Animated.timing(this.state.height, {
      toValue: this.props.isVisible ? UI_SIZES.CC_PREVIEW_HEIGHT : 0,
      duration: 300,
      delay: 0
    }).start(); 
  },

  _getStyle() {
    return [
      styles.previewPanel,
      {
        'height': this.state.height
      }
    ];
  },

  render() {
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