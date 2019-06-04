// @flow

import React, { type Node } from 'react';
import { ScrollView } from 'react-native';

type Props = {
  data?: Array<string>,
  horizontal: boolean,
  itemRender: (string, number) => Node,
};

export default class ItemSelectionList extends React.Component<Props> {
  static defaultProps = {
    data: undefined,
  };

  renderItems = () => {
    const { data, itemRender } = this.props;

    if (typeof data === 'undefined') {
      return null;
    }

    return data.map<Node>((item, index) => itemRender(item, index));
  };

  render() {
    const { horizontal } = this.props;

    return (
      <ScrollView directionalLockEnabled horizontal={horizontal} indicatorStyle="white">
        {this.renderItems()}
      </ScrollView>
    );
  }
}
