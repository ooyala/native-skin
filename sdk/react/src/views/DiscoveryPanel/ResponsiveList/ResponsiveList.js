import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView
} from 'react-native';

import * as Utils from '../../../lib/utils';

import responsiveListStyles from './ResponsiveList.styles';
const styles = Utils.getStyles(responsiveListStyles);
const placeHolderItem = 'ResponsiveListPlaceHolder';

export default class ResponsiveList extends Component {
  static propTypes = {
    horizontal: PropTypes.bool,
    data: PropTypes.array,
    itemRender: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number
  };

  getSlices = () => {
    const listMeasure = this.props.horizontal ? this.props.height : this.props.width;
    const itemMeasure = this.props.horizontal ? this.props.itemHeight : this.props.itemWidth;
    let itemsPerSlice = Math.floor(listMeasure / itemMeasure);
    const itemsPerSliceCap = 5;

    if (itemsPerSlice <= 0) {
      itemsPerSlice = 1;
    } else if (itemsPerSlice > itemsPerSliceCap) {
      itemsPerSlice = itemsPerSliceCap;
    }
    let slices = [];
    if (this.props.data) {
      const numberOfSlices = Math.ceil(this.props.data.length / itemsPerSlice);
      for (let i = 0; i  < numberOfSlices; i++) {
        slices[i] = [];
        for (let j = 0; j < itemsPerSlice; j++) {
          if (i * itemsPerSlice + j < this.props.data.length) {
            slices[i][j] = this.props.data[i * itemsPerSlice + j];
          } else {
            slices[i][j] = placeHolderItem;
          }
        }
      }
    }
    return slices;
  };

  render() {
    let slices = this.getSlices();

    return (
      <View style={{flex: 1}}>
        <ScrollView
          style={{ width: this.props.width, flex: 1 }}
          horizontal={this.props.horizontal}
          directionalLockEnabled={true}
          showsHorizontalScrollIndicator={false}>
          {slices.map(this.renderSlice)}
        </ScrollView>
      </View>
    );
  }

  renderSlice = (slice, i) => {
    const sliceStyle = this.props.horizontal ? styles.column : styles.row;

    let renderItem = this.renderItem;
    const renderedItem = slice.map(function(item, idx, arr) {
      return renderItem(item, idx, i * arr.length + idx);
    });

    return (
      <View
        key={i}
        style={sliceStyle}>
        {renderedItem}
      </View>
    );
  };

  renderItem = (item, sectionId, i) => {
    const placeHolderStyle = {
      flex: 1,
      backgroundColor: 'transparent',
      width: this.props.itemWidth,
      height: this.props.itemHeight
    };
    if (item === placeHolderItem) {
      return (<View key={sectionId} style={placeHolderStyle}></View>);
    } else {
      return this.props.itemRender(item, sectionId, i);
    }
  };
}
