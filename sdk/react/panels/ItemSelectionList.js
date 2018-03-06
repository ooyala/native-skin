import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
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
    var itemStyle = this.props.horizontal ? styles.column : styles.row;

    var renderItem = this.renderItem;
    var renderedItems = items.map((item, index) => (
        this.props.itemRender(item, index)
    ));
      
    return (
     <View style={itemStyle}> 
        {renderedItems}
     </View>
    );
  },

  render: function() {
    var listBound = this.props.horizontal ? this.props.width : this.props.height;
    var itemBound = this.props.horizontal ? this.props.itemWidth : this.props.itemHeight;

    return (
      <View style={{flex: 1}}>
        <ScrollView
          style={{flex: 1, width: this.props.width}}
          horizontal={this.props.horizontal}
          directionalLockEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {this.renderItems(this.props.data)}
        </ScrollView>
      </View>);
  },


});

module.exports = ItemSelectionList;
