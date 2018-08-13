'use strict';

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
import PropTypes from 'prop-types';

import React from 'react';
import {
  ScrollView
} from 'react-native';

const styles=require('../utils').getStyles(require('./style/ItemSelectionScrollViewStyles.json'));

class ItemSelectionList extends React.Component {
  static propTypes = {
    horizontal: PropTypes.bool,
    data: PropTypes.array,
    itemRender: PropTypes.func
  };

  renderItems = (items) => {
    if (typeof(items) !== "undefined") {
      const renderedItems = items.map((item, index) => (
          this.props.itemRender(item, index)
      ));
      return (renderedItems);
    } else {
      return null;
    }
  };

  render() {
    const scrollViewStyle = this.props.horizontal ? styles.column : styles.row;
    return (
      <ScrollView
        style={scrollViewStyle}
        indicatorStyle={"white"} // Can't move this property to json styles file because it doesn't work
        horizontal={this.props.horizontal}
        directionalLockEnabled={true}>
          {this.renderItems(this.props.data)}
      </ScrollView>
    );
  }
}

module.exports = ItemSelectionList;
