import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import AccessibilityUtils from '../../lib/accessibility';
import Utils from '../../lib/utils';
import ItemSelectionList from './ItemSelectionList/ItemSelectionList';

import itemSelectionScrollViewStyles from './ItemSelectionScrollView.styles';
const styles = Utils.getStyles(itemSelectionScrollViewStyles);

class ItemSelectionScrollView extends Component {
  static propTypes = {
    items: PropTypes.array,
    selectedItem: PropTypes.string,
    onSelect: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    config: PropTypes.object,
    cellType: PropTypes.string
  };

  isSelected = (name) => {
    return name && name !== '' && name === this.props.selectedItem;
  };

  onSelected = (name) => {
    if (this.props.selectedItem !== name) {
      this.props.onSelect(name);
    }
  };

  renderItem = (item, index) => {
    const isSelectedItem = this.isSelected(item);
    const buttonStyle = isSelectedItem ? styles.selectedButton : styles.button;
    const textStyle = isSelectedItem ? styles.selectedButtonText : styles.buttonText;
    const checkmarkIcon = isSelectedItem ? this.props.config.icons.selected.fontString : '';
    const accessibilityString = AccessibilityUtils.createAccessibilityLabelForCell(this.props.cellType, item);

    return (
      <TouchableHighlight
        accessibility={true}
        accessibilityLabel={accessibilityString}
        key={index}
        style={styles.item}
        underlayColor='transparent' // Can't move this property to json styles file because it doesn't work
        onPress={() => this.onSelected(item)}>
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
    const renderHorizontal = Utils.shouldShowLandscape(this.props.width, this.props.height);
    return (
      <ItemSelectionList
        horizontal={renderHorizontal}
        data={this.props.items}
        itemRender={this.renderItem}>
      </ItemSelectionList>
    );
  }
}

module.exports = ItemSelectionScrollView;
