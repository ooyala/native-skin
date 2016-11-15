import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  ScrollView
} from 'react-native';

var styles=require('../utils').getStyles(require('./style/ResponsiveListStyles.json'));
var placeHolderItem = "ResponsiveListPlaceHolder";
var ResponsiveList = React.createClass({
  propTypes: {
    horizontal: React.PropTypes.bool,
    data: React.PropTypes.array,
    itemRender: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    itemWidth: React.PropTypes.number,
    itemHeight: React.PropTypes.number
  },

  getSlices: function() {
    var listMeasure = this.props.horizontal ? this.props.height : this.props.width;
    var itemMeasure = this.props.horizontal ? this.props.itemHeight : this.props.itemWidth;
    var itemsPerSlice = Math.floor(listMeasure / itemMeasure);
    var itemsPerSliceCap = 5;

    if (itemsPerSlice <= 0) {
      itemsPerSlice = 1;
    } else if (itemsPerSlice > itemsPerSliceCap) {
      itemsPerSlice = itemsPerSliceCap;
    }
    var slices = [];
    if(this.props.data != null){
      var numberOfSlices = Math.ceil(this.props.data.length / itemsPerSlice);
      for (var i = 0; i  < numberOfSlices; i++) {
        slices[i] = [];
        for (var j = 0; j < itemsPerSlice; j++) {
          if (i * itemsPerSlice + j < this.props.data.length) {
            slices[i][j] = this.props.data[i * itemsPerSlice + j];
          } else {
            slices[i][j] = placeHolderItem;
          }
        }
      }
    }

    return slices;
  },

  render: function() {
    var slices = this.getSlices();
    var listBound = this.props.horizontal ? this.props.width : this.props.height;
    var itemBound = this.props.horizontal ? this.props.itemWidth : this.props.itemHeight;

    return (
      <View style={{flex: 1}}>
        <ScrollView
          style={{width:this.props.width, flex: 1}}
          horizontal={this.props.horizontal}
          directionalLockEnabled={true}
          showsHorizontalScrollIndicator={false}>
          {slices.map(this.renderSlice)}
        </ScrollView>
      </View>);
  },

  renderSlice: function(slice: object, i: number) {
    var sliceStyle = this.props.horizontal ? styles.column : styles.row;

    var renderItem = this.renderItem;
    var renderedItem = slice.map(function(item, idx, arr) {
      return renderItem(item, idx, i * arr.length + idx);
    });

    return (<View
      key={i}
      style={sliceStyle}>
      {renderedItem}
    </View>);
  },

  renderItem: function(item: object, sectionId: number, i: number) {
    var placeHolderStyle = {flex: 1, backgroundColor: "transparent", width:this.props.itemWidth, height: this.props.itemHeight};
    if (item === placeHolderItem) {
      return (<View key={sectionId} style={placeHolderStyle}></View>);
    } else {
      return this.props.itemRender(item, sectionId, i);
    }
  }
});

module.exports = ResponsiveList;
