import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView } from 'react-native';

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
    return (
      <ScrollView
        indicatorStyle={'white'} // Can't move this property to json styles file because it doesn't work
        horizontal={this.props.horizontal}
        directionalLockEnabled={true}>
          {this.renderItems(this.props.data)}
      </ScrollView>
    );
  }
}
