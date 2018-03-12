import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native';

var styles=require('../utils').getStyles(require('./style/ItemSelectionScrollViewStyles.json'));

var ItemSelectionList = React.createClass({
  propTypes: {
    horizontal: React.PropTypes.bool,
    data: React.PropTypes.array,
    itemRender: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    itemWidth: React.PropTypes.number,
    itemHeight: React.PropTypes.number
  },

  renderItems: function(items) {
    var renderItem = this.renderItem;
    var renderedItems = items.map((item, index) => (
        this.props.itemRender(item, index)
    ));
      
    return (renderedItems);
  },

  render: function() {
    var listBound = this.props.horizontal ? this.props.width : this.props.height;
    var itemBound = this.props.horizontal ? this.props.itemWidth : this.props.itemHeight;
    var scrollViewStyle = this.props.horizontal ? styles.column : styles.row;

    return (
      <ScrollView
        style={{scrollViewStyle}}
        indicatorStyle={"white"} // Can't move this property to json styles file because it doesn't work
        horizontal={this.props.horizontal}
        directionalLockEnabled={true}>
          {this.renderItems(this.props.data)}
      </ScrollView>
    );
  },


});

module.exports = ItemSelectionList;
