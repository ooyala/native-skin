import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View
} from 'react-native';

import Utils from './utils';

import infoPanelStyles from './style/infoPanelStyles.json';
const styles = Utils.getStyles(infoPanelStyles);

class InfoPanel extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
  };

  render() {
    let infoPanel;
    const titleAccessible = this.props.title && this.props.title != '';
    const descriptionAccessible = this.props.description && this.props.title != '';

    infoPanel = (
      <View style={styles.infoPanelNW}>
        <Text accessible={titleAccessible} style={styles.infoPanelTitle}>{this.props.title}</Text>
        <Text accessible={descriptionAccessible} style={styles.infoPanelDescription}>{this.props.description}</Text>
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