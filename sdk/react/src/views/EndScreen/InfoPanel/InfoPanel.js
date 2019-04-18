import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

import styles from './InfoPanel.styles';

export default class InfoPanel extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
  };

  render() {
    const { description, title } = this.props;

    let infoPanel;
    const titleAccessible = title && title !== '';
    // TODO: Check if we have to assign title to descriptionAccessible.
    const descriptionAccessible = description && title !== '';

    infoPanel = (
      <View style={styles.infoPanelNW}>
        <Text accessible={titleAccessible} style={styles.infoPanelTitle}>{title}</Text>
        <Text accessible={descriptionAccessible} style={styles.infoPanelDescription}>{description}</Text>
      </View>
    );

    return (
      <View style={styles.container}>
        {infoPanel}
      </View>
    );
  }
}
