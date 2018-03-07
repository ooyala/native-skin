/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

var Utils = require('../utils');
var ItemSelectionList = require('./ItemSelectionList');
var styles = require('../utils').getStyles(require('./style/ItemSelectionScrollViewStyles'));

var ItemSelectionScrollView = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    selectedItem: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    config: React.PropTypes.object
  },

  isSelected: function(name) {
    return name && name !== '' && name == this.props.selectedItem;
  },

  onSelected: function(name) {
    if (this.props.selectedItem !== name) {
      this.props.onSelect(name);
    }
  },

  renderItem: function(item, index) {
    var isSelectedItem = this.isSelected(item);
    var buttonStyle = isSelectedItem ? styles.selectedButton : styles.button;
    var textStyle = isSelectedItem ? styles.selectedButtonText : styles.buttonText;
    var checkmarkIcon = isSelectedItem ? this.props.config.icons.selected.fontString : "";
    return (
      <TouchableHighlight
        key={index}
        style={styles.item}
        underlayColor="transparent" // Can't move this property to json styles file because it doesn't work
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
  },

  render: function() {
    var renderHorizontal = Utils.shouldShowLandscape(this.props.width, this.props.height);
    return (
      <ItemSelectionList
        horizontal={false}
        data={this.props.items}
        itemRender={this.renderItem}
        width={this.props.width}
        height={this.props.height}>
      </ItemSelectionList>
    );
  },


});

module.exports = ItemSelectionScrollView;