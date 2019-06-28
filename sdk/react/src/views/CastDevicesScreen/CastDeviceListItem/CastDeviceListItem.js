// @flow

import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import { BUTTON_NAMES } from '../../../constants';
import RectangularButton from '../../../shared/RectangularButton';

import styles from './CastDeviceListItem.styles';

const castButtonSize = 35;

type Props = {
  id: string,
  title: string,
  onPressItem: () => void,
  selected?: boolean,
  activeColor: string,
  inactiveColor: string,
  castIcon: {
    'chromecast-disconnected': {
      fontString: string,
      fontFamilyName: string,
    },
  },
};

export default class DeviceListItem extends React.Component<Props> {
  static defaultProps = {
    selected: false,
  };

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
