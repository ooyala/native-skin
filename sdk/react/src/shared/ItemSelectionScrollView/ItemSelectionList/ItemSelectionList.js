import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView } from 'react-native';

// TODO(styles): Prefer own styles instead.
import styles from '../ItemSelectionScrollView.styles';

export default class ItemSelectionList extends Component {
  static propTypes = {
    horizontal: PropTypes.bool,
    data: PropTypes.array,
    itemRender: PropTypes.func
  };

  renderItems = (items) => {
    if (typeof(items) !== 'undefined') {
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
        indicatorStyle={'white'} // Can't move this property to json styles file because it doesn't work
        horizontal={this.props.horizontal}
        directionalLockEnabled={true}>
          {this.renderItems(this.props.data)}
      </ScrollView>
    );
  }
}
