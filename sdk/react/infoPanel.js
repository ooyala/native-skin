import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/infoPanelStyles.json'));

class InfoPanel extends React.Component {
  static propTypes = {
 title: PropTypes.string,
 description: PropTypes.string,
};

  render() {
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
}

module.exports = InfoPanel;