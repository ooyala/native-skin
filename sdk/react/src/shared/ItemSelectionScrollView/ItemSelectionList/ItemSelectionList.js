import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView } from 'react-native';

export default class ItemSelectionList extends Component {
  static propTypes = {
    horizontal: PropTypes.bool,
    data: PropTypes.array,
    itemRender: PropTypes.func,
  };

  renderItems = () => {
    const { data, itemRender } = this.props;

    if (typeof data === 'undefined') {
      return null;
    }

    return data.map((item, index) => itemRender(item, index));
  };

  render() {
    const { horizontal } = this.props;

    return (
      <ScrollView
        indicatorStyle="white" // Can't move this property to json styles file because it doesn't work
        horizontal={horizontal}
        directionalLockEnabled
      >
        {this.renderItems()}
      </ScrollView>
    );
  }
}
