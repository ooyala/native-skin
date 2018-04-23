/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';

var styles=require('../utils').getStyles(require('./style/ItemSelectionScrollViewStyles.json'));

var ItemSelectionList = React.createClass({
  propTypes: {
    horizontal: React.PropTypes.bool,
    data: React.PropTypes.array,
    itemRender: React.PropTypes.func
  },

  renderItems: function(items) {
    var renderedItems = items.map((item, index) => (
        this.props.itemRender(item, index)
    ));
      
    return (renderedItems);
  },

  render: function() {
    var scrollViewStyle = this.props.horizontal ? styles.column : styles.row;
    return (
      <ScrollView
        style={scrollViewStyle}
        indicatorStyle={"white"} // Can't move this property to json styles file because it doesn't work
        horizontal={this.props.horizontal}
        directionalLockEnabled={true}>
          {this.renderItems(this.props.data)}
      </ScrollView>
    );
  },


});

module.exports = ItemSelectionList;