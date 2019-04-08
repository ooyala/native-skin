import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import { BUTTON_NAMES } from '../../../constants';
import RectangularButton from '../../../shared/RectangularButton';

// TODO(styles): Prefer own styles instead.
import styles from '../CastDevicesScreen.styles';

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

    return (
      <RectangularButton
        name={BUTTON_NAMES.CAST}
        style={null}
        icon={castIcon.fontString}
        onPress={null}
        fontSize={castButtonSize}
        buttonColor={color}
        fontFamily={castIcon.fontFamilyName}
      />
    );
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
