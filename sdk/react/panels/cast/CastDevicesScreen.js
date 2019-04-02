import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Text,
  View,
  FlatList,
} from 'react-native';

import {
  BUTTON_NAMES,
} from '../../constants';
import CastDeviceListItem from './CastDeviceListItem';
import Utils from '../../utils';
import castDevicesStyles from '../style/CastDevicesStyles.json';

const styles = Utils.getStyles(castDevicesStyles);
const dismissButtonSize = 20;

export default class CastDevicesScreen extends Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onDeviceSelected: PropTypes.func.isRequired,
    config: PropTypes.shape({
      castControls: PropTypes.shape({
        iconStyle: PropTypes.shape({
          active: PropTypes.shape({
            color: PropTypes.string,
          }),
          inactive: PropTypes.shape({
            color: PropTypes.string,
          }),
        }),
      }),
      icons: PropTypes.shape({
        'chromecast-disconnected': PropTypes.shape({
          fontString: PropTypes.string,
          fontFamilyName: PropTypes.string,
        }),
        dismiss: PropTypes.shape({
          fontString: PropTypes.string,
          fontFamilyName: PropTypes.string,
        }),
      }),
    }).isRequired,
    devices: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })).isRequired,
    selectedDeviceId: PropTypes.string,
  };

  static defaultProps = {
    selectedDeviceId: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      selectedID: -1,
    };
  }

  componentDidMount() {
    const { opacity } = this.state;

    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 500,
          delay: 0,
        },
      ),
    ]).start();
  }

  onDismissBtnPress = () => {
    const { onDismiss } = this.props;
    onDismiss();
  };

  onDismissPress = () => {
    const { opacity } = this.state;
    Animated.timing(
      opacity,
      {
        toValue: 0,
        duration: 500,
        delay: 0,
      },
    ).start(this.onDismissBtnPress);
  };

  onPressButton = (deviceId) => {
    const { onDeviceSelected } = this.props;

    this.setState({
      selectedID: deviceId,
    });
    onDeviceSelected(deviceId);
  }

  renderCastDevicesScreen(animationStyle, dismissButtonRow) {
    const { height, width, devices } = this.props;
    const { selectedID } = this.state;
    return (
      <Animated.View
        style={[styles.fullscreenContainer, animationStyle, {
          height,
          width,
        }]}
      >
        <Animated.View
          style={[animationStyle, {
            height,
            width,
            marginTop: 20,
          }]}
        >
          <FlatList
            style={styles.listViewContainer}
            data={devices}
            extraData={selectedID}
            keyExtractor={item => item.id}
            renderItem={this.renderItem}
          />
        </Animated.View>
        <Text style={styles.title}>
          {'Remote playback'}
        </Text>
        {dismissButtonRow}
      </Animated.View>
    );
  }

  renderItem = ({ item }) => {
    const { selectedID } = this.state;
    const { config, selectedDeviceId } = this.props;
    const { iconStyle } = config.castControls;
    return (
      <CastDeviceListItem
        id={item.id}
        title={item.title}
        onPressItem={this.onPressButton}
        selected={item.id === selectedID || item.id === selectedDeviceId}
        activeColor={iconStyle.active.color}
        inactiveColor={iconStyle.inactive.color}
        castIcon={config.icons['chromecast-disconnected']}
      />
    );
  }

  render() {
    const { config } = this.props;
    const { opacity } = this.state;

    const dismissButton = Utils.renderRectButton(BUTTON_NAMES.DISMISS,
      styles.iconDismiss,
      config.icons.dismiss.fontString,
      this.onDismissPress, dismissButtonSize,
      config.castControls.iconStyle.inactive.color,
      config.icons.dismiss.fontFamilyName);

    const dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );
    const animationStyle = { opacity };
    return this.renderCastDevicesScreen(animationStyle, dismissButtonRow);
  }
}
