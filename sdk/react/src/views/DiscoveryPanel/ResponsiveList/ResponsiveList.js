// @flow

import PropTypes from 'prop-types';
import React from 'react';
import { ScrollView, View } from 'react-native';

import styles from './ResponsiveList.styles';

const placeHolderItem = 'ResponsiveListPlaceHolder';

export default class ResponsiveList extends React.Component {
  static propTypes = {
    horizontal: PropTypes.bool,
    data: PropTypes.arrayOf(),
    itemRender: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
  };

  getSlices = () => {
    const {
      data, height, horizontal, itemHeight, itemWidth, width,
    } = this.props;

    const listMeasure = horizontal ? height : width;
    const itemMeasure = horizontal ? itemHeight : itemWidth;
    let itemsPerSlice = Math.floor(listMeasure / itemMeasure);
    const itemsPerSliceCap = 5;

    if (itemsPerSlice <= 0) {
      itemsPerSlice = 1;
    } else if (itemsPerSlice > itemsPerSliceCap) {
      itemsPerSlice = itemsPerSliceCap;
    }
    const slices = [];
    if (data) {
      const numberOfSlices = Math.ceil(data.length / itemsPerSlice);
      for (let i = 0; i < numberOfSlices; i += 1) {
        slices[i] = [];
        for (let j = 0; j < itemsPerSlice; j += 1) {
          if (i * itemsPerSlice + j < data.length) {
            slices[i][j] = data[i * itemsPerSlice + j];
          } else {
            slices[i][j] = placeHolderItem;
          }
        }
      }
    }

    return slices;
  };

  renderSlice = (slice, i) => {
    const { horizontal } = this.props;
    const sliceStyle = horizontal ? styles.column : styles.row;

    const { renderItem } = this;
    const renderedItem = slice.map((item, idx, arr) => renderItem(item, idx, i * arr.length + idx));

    return (
      <View
        key={i}
        style={sliceStyle}
      >
        {renderedItem}
      </View>
    );
  };

  renderItem = (item, sectionId, i) => {
    const { itemHeight, itemRender, itemWidth } = this.props;

    const placeHolderStyle = {
      flex: 1,
      backgroundColor: 'transparent',
      width: itemWidth,
      height: itemHeight,
    };

    if (item === placeHolderItem) {
      return <View key={sectionId} style={placeHolderStyle} />;
    }

    return itemRender(item, sectionId, i);
  };

  render() {
    const { horizontal, width } = this.props;
    const slices = this.getSlices();

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{
            width,
            flex: 1,
          }}
          horizontal={horizontal}
          directionalLockEnabled
          showsHorizontalScrollIndicator={false}
        >
          {slices.map(this.renderSlice)}
        </ScrollView>
      </View>
    );
  }
}
