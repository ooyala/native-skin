// @flow

import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import ItemSelectionList from './ItemSelectionList';
import * as Accessibility from '../../lib/accessibility';
import * as Utils from '../../lib/utils';
import type { Config } from '../../types/Config';

import styles from './ItemSelectionScrollView.styles';

type Props = {
  items: Array<any>,
  selectedItem: string,
  onSelect: () => void,
  width: number,
  height: number,
  config: Config,
  cellType: string,
};

export default class ItemSelectionScrollView extends React.Component<Props> {
  onSelected(name) {
    const { onSelect, selectedItem } = this.props;

    if (selectedItem !== name) {
      onSelect(name);
    }
  }

  isSelected(name) {
    const { selectedItem } = this.props;

    return name && name !== '' && name === selectedItem;
  }

  renderItem = (item: any, index: number) => {
    const { cellType, config } = this.props;

    const isSelectedItem = this.isSelected(item);
    const buttonStyle = isSelectedItem ? styles.selectedButton : styles.button;
    const textStyle = isSelectedItem ? styles.selectedButtonText : styles.buttonText;
    const checkmarkIcon = isSelectedItem ? config.icons.selected.fontString : '';
    const accessibilityString = Accessibility.createAccessibilityLabelForCell(cellType, item);

    return (
      <TouchableHighlight
        accessibility
        accessibilityLabel={accessibilityString}
        key={index}
        style={styles.item}
        underlayColor="transparent" // Can't move this property to json styles file because it doesn't work
        onPress={() => this.onSelected(item)}
      >
        <View style={buttonStyle}>
          <View style={styles.selectedCheckmarkContainer}>
            <Text style={styles.selectedCheckmarkIcon}>
              {checkmarkIcon}
            </Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={textStyle}>{item}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { height, items, width } = this.props;

    const renderHorizontal = Utils.shouldShowLandscape(width, height);

    return (
      <ItemSelectionList horizontal={renderHorizontal} data={items} itemRender={this.renderItem} />
    );
  }
}
