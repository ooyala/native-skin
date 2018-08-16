import PropTypes from 'prop-types';
import React from 'react';
import {
  Text,
  View
} from 'react-native';

const Utils = require('./utils');
const styles = Utils.getStyles(require('./style/infoPanelStyles.json'));

class InfoPanel extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
  };

  render() {
    let infoPanel;
    const titleAccessible = this.props.title != null && this.props.title != "";
    const descriptionAccessible = this.props.description != null && this.props.title != "";

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