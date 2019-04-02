import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import {
  BUTTON_NAMES,
} from '../../constants';
import castDevicesStyles from '../style/CastDevicesStyles.json';
import Utils from '../../utils';

const styles = Utils.getStyles(castDevicesStyles);
const castButtonSize = 35;

export default class DeviceListItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onPressItem: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    activeColor: PropTypes.string.isRequired,
    inactiveColor: PropTypes.string.isRequired,
    castIcon: PropTypes.shape({
      'chromecast-disconnected': PropTypes.shape({
        fontString: PropTypes.string,
        fontFamilyName: PropTypes.string,
      }),
    }).isRequired,
  }

  static defaultProps = {
    selected: false,
  }

  onPress = () => {
    const { onPressItem, id } = this.props;
    onPressItem(id);
  };

  renderCastButton(color) {
    const { castIcon } = this.props;

    return Utils.renderRectButton(BUTTON_NAMES.CAST,
      null,
      castIcon.fontString,
      null, castButtonSize, color,
      castIcon.fontFamilyName);
  }

  render() {
    const {
      selected,
      activeColor,
      inactiveColor,
      title,
    } = this.props;

    const itemContainerStyle = selected ? styles.itemContainerSelected : styles.itemContainer;

    const textColor = selected ? activeColor : inactiveColor;
    const textStyle = selected ? styles.textSelected : styles.text;
    return (
      <TouchableHighlight
        style={{ flex: 1 }}
        onPress={this.onPress}
        underlayColor="transparent"
      >
        <View style={itemContainerStyle}>
          <View style={styles.icon}>
            {this.renderCastButton(selected ? activeColor : inactiveColor)}
          </View>
          <Text style={[textStyle, { color: textColor }]}>
            {title}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}
