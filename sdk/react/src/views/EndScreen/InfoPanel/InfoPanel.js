import PropTypes from 'prop-types';
import React from 'react';
import { Text, View } from 'react-native';

import styles from './InfoPanel.styles';

const InfoPanel = ({ description, title }) => {
  const titleAccessible = title && title !== '';
  // TODO: Check if we have to assign title to descriptionAccessible.
  const descriptionAccessible = description && title !== '';

  return (
    <View style={styles.container}>
      <View style={styles.infoPanelNW}>
        <Text accessible={titleAccessible} style={styles.infoPanelTitle}>{title}</Text>
        <Text accessible={descriptionAccessible} style={styles.infoPanelDescription}>{description}</Text>
      </View>
    </View>
  );
};

InfoPanel.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default InfoPanel;
