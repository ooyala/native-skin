'use strict';

import React, { Component } from 'react';
import {
  Animated,
  Text,
  View
} from 'react-native';

var Utils = require('./utils');
var styles = Utils.getStyles(require('./panels/style/languageSelectionPanelStyles.json'));

var Constants = require('./constants');
var {
  UI_SIZES
} = Constants;

var LanguageSelectionPreview = React.createClass({
  propTypes: {
    config: React.PropTypes.object,
    selectedLanguage: React.PropTypes.string,
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

  render() {
    return (
      <Animated.View style={styles.previewPanel}>
      <View style={styles.splitter} />
        <Text style={styles.buttonText}>{Utils.localizedString(this.props.selectedLanguage, 'CLOSED CAPTION PREVIEW', this.props.config.localizableStrings)}</Text>
        <Text style={styles.buttonText}>{Utils.localizedString(this.props.selectedLanguage, 'Sample Text', this.props.config.localizableStrings)}</Text>
      </Animated.View>
    );
  }
});

module.exports = LanguageSelectionPreview;