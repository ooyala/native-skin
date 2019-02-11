'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {Animated, ListView, Text, View, TouchableHighlight} from 'react-native';

import {BUTTON_NAMES} from '../constants';

const Utils = require('../utils');
const styles = Utils.getStyles(require('./style/castScreenStyles.json'));

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2});

const dismissButtonSize = 20;
const castButtonSize = 35;

class CastDevicesScreen extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    onDismiss: PropTypes.func,
    config: PropTypes.object,
    data: PropTypes.array,
    selectedItem: PropTypes.string
  };

  componentWillMount() {
    this.state = {
      translateY: new Animated.Value(this.props.height),
      opacity: new Animated.Value(0),
      dataSource: ds.cloneWithRows(this.props.data),
      selectedID: -1
    };
  }

  componentDidMount() {
    this.state.translateY.setValue(this.props.height);
    this.state.opacity.setValue(0);

    Animated.parallel([
      Animated.timing(
        this.state.translateY,
        {
          toValue: 0,
          duration: 700,
          delay: 0
        }),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: 500,
          delay: 0
        }),
    ]).start();
  }

  onDismissBtnPress = () => {
    this.props.onDismiss();
  };

  onDismissPress = () => {
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0,
        duration: 500,
        delay: 0
      }
    ).start(this.onDismissBtnPress);
  };

  render() {
    const dismissButton = Utils.renderRectButton(BUTTON_NAMES.DISMISS,
      styles.iconDismiss,
      this.props.config.icons.dismiss.fontString,
      this.onDismissPress, dismissButtonSize,
      this.props.config.moreDetailsScreen.color,
      this.props.config.icons.dismiss.fontFamilyName);

    const castButton = Utils.renderRectButton(BUTTON_NAMES.CAST,
      null,
      this.props.config.icons.cast.fontString,
      null, castButtonSize,
      this.props.config.moreDetailsScreen.color,
      this.props.config.icons.cast.fontFamilyName);

    const dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );
    const animationStyle = {opacity: this.state.opacity};
    return (
      <Animated.View
        style={[styles.fullscreenContainer, animationStyle, {height: this.props.height, width: this.props.width}]}>
        <Animated.View
          style={[animationStyle, {height: this.props.height, width: this.props.width, marginTop: 20}]}>
          <ListView
            style={[{flex: 0}, styles.listViewContainer]}
            dataSource={this.state.dataSource}
            renderRow={(rowData, sectionID, rowID, _) => this._renderItem(rowData, rowID, castButton)}
          />
        </Animated.View>
        <Text style={styles.title}>{"Remote playback"}</Text>
        {dismissButtonRow}
      </Animated.View>
    );
  }

  _renderItem = (rowData, rowID, castButton) => {
    const itemContainerStyle = this.state.selectedID === rowID ?
      styles.itemContainerSelected : styles.itemContainer;

    return (
      <TouchableHighlight
        style={{flex: 1}}
        onPress={() => this._onPressButton(rowID)}
        underlayColor='transparent'>
        <View
          style={itemContainerStyle}>
          <View style={styles.icon}>
            {castButton}
          </View>
          <Text style={styles.text}>
            {rowData}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  _onPressButton = (rowID) => {
    this.setState({
      selectedID: rowID,
      dataSource: this.state.dataSource.cloneWithRows(this.props.data),
      translateY: this.state.translateY,
      opacity: this.state.opacity
    });
  }
}

module.exports = CastDevicesScreen;