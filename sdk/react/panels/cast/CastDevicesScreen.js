import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  ListView,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import {
  BUTTON_NAMES
} from '../../constants';
import Utils from '../../utils';

import castScreenStyles from '../style/castScreenStyles.json';
const styles = Utils.getStyles(castScreenStyles);

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2});

const dismissButtonSize = 20;
const castButtonSize = 35;

class CastDevicesScreen extends Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    onDismiss: PropTypes.func,
    onDeviceSelected: PropTypes.func,
    config: PropTypes.object,
    deviceIds: PropTypes.array,
    deviceNames: PropTypes.array,
    selectedItemName: PropTypes.string,
  };

  componentWillMount() {
    this.state = {
      translateY: new Animated.Value(this.props.height),
      opacity: new Animated.Value(0),
      dataSource: ds.cloneWithRows(this.props.deviceNames),
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
      this.props.config.castDevicesScreen.iconStyle.inactive.color,
      this.props.config.icons.dismiss.fontFamilyName);

    const castButton = this._renderCastButton(this.props.config.castDevicesScreen.iconStyle.inactive.color);
    const castButtonActive = this._renderCastButton(this.props.config.castDevicesScreen.iconStyle.active.color);

    const dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );
    const animationStyle = {opacity: this.state.opacity};
    return (this._renderCastDevicesScreen(animationStyle, castButton, castButtonActive, dismissButtonRow));
  }

  _renderCastDevicesScreen(animationStyle, castButton, castButtonActive, dismissButtonRow) {
    return <Animated.View
      style={[styles.fullscreenContainer, animationStyle, {height: this.props.height, width: this.props.width}]}>
      <Animated.View
        style={[animationStyle, {height: this.props.height, width: this.props.width, marginTop: 20}]}>
        <ListView
          style={[{flex: 0}, styles.listViewContainer]}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID, _) => this._renderItem(rowData, rowID, castButton, castButtonActive)}
        />
      </Animated.View>
      <Text style={styles.title}>{"Remote playback"}</Text>
      {dismissButtonRow}
    </Animated.View>;
  }

  _renderItem = (rowData, rowID, castButton, castButtonActive) => {
    const isSelected = this.state.selectedID === rowID || rowData === this.props.selectedItemName;
    const itemContainerStyle = isSelected ?
      styles.itemContainerSelected : styles.itemContainer;

    return (
      <TouchableHighlight
        style={{flex: 1}}
        onPress={() => this._onPressButton(rowID)}
        underlayColor='transparent'>
        <View
          style={itemContainerStyle}>
          <View style={styles.icon}>
            {isSelected ? castButtonActive : castButton}
          </View>
          <Text style={isSelected ? styles.textSelected : styles.text}>
            {rowData}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  _renderCastButton = (color) => {
    return Utils.renderRectButton(BUTTON_NAMES.CAST,
      null,
      this.props.config.icons.cast.fontString,
      null, castButtonSize,
      color,
      this.props.config.icons.cast.fontFamilyName)
  };

  _onPressButton = (rowID) => {
    this.setState({
      selectedID: rowID,
      dataSource: this.state.dataSource.cloneWithRows(this.props.deviceNames),
      translateY: this.state.translateY,
      opacity: this.state.opacity
    });
    this.props.onDismiss();
    this.props.onDeviceSelected(this.props.deviceNames[rowID], this.props.deviceIds[rowID]);
  }
}

module.exports = CastDevicesScreen;
