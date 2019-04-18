import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Animated, PanResponder, Text, TouchableHighlight, View,
} from 'react-native';

import styles from './VolumePanel.styles';

const constants = {
  animationDuration: 1000,
  scrubberSize: 14,
  scrubTouchableDistance: 45,
};

export default class VolumePanel extends Component {
  static propTypes = {
    onDismiss: PropTypes.func,
    onVolumeChanged: PropTypes.func.isRequired,
    volume: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    config: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      volume: props.volume,
      opacity: new Animated.Value(0),
      touch: false,
      x: 0,
      sliderWidth: 0,
      sliderHeight: 0,
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
          duration: constants.animationDuration,
        },
      ),
    ])
      .start();
  }

  _onVolumeChange = (volume) => {
    const { onVolumeChanged } = this.props;

    onVolumeChanged(volume);

    this.setState({
      volume,
    });
  };

  _renderVolumeIcon = () => {
    const { config } = this.props;
    const { volume } = this.state;

    const iconConfig = (volume > 0) ? config.icons.volume : config.icons.volumeOff;
    const fontFamilyStyle = { fontFamily: iconConfig.fontFamilyName };

    return (
      <View style={styles.volumeIconContainer}>
        <Text style={[styles.volumeIcon, fontFamilyStyle]}>
          {iconConfig.fontString}
        </Text>
      </View>
    );
  };

  handleTouchStart = (event) => {
    const volume = this._touchPercent(event.nativeEvent.locationX);
    this._onVolumeChange(volume);
    this.setState({
      touch: true,
      x: event.nativeEvent.locationX,
    });
  };

  handleTouchMove = (event) => {
    const locationX = event.nativeEvent.pageX - this.locationPageOffset;
    const volume = this._touchPercent(locationX);
    this._onVolumeChange(volume);
    this.setState({
      x: locationX,
    });
  };

  handleTouchEnd = (event) => {
    this.setState({
      touch: false,
      x: null,
    });
  };

  // Actions
  _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => true,
    onStartShouldSetPanResponderCapture: (event, gestureState) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (event, gestureState) => true,

    onPanResponderGrant: (event, gestureState) => {
      this.locationPageOffset = event.nativeEvent.pageX - event.nativeEvent.locationX;
      this.handleTouchStart(event);
    },
    onPanResponderMove: (event, gestureState) => {
      this.handleTouchMove(event);
    },
    onPanResponderTerminationRequest: (event, gestureState) => true,
    onPanResponderRelease: (event, gestureState) => {
      this.handleTouchEnd(event);
    },
  });

  onDismissPress = () => {
    const { onDismiss } = this.props;

    onDismiss();
  };

  // Volume slider
  _touchPercent = (x) => {
    const { sliderWidth } = this.state;

    let percent = x / sliderWidth;

    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }

    return percent;
  };

  _calculateTopOffset = (componentSize, sliderHeight) => sliderHeight / 2 - componentSize / 2;

  _calculateLeftOffset = (componentSize, percent, sliderWidth) => percent * sliderWidth - componentSize * percent;

  _thumbStyle = () => ({
    flex: 0,
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 100,
    width: constants.scrubberSize,
    height: constants.scrubberSize,
  });

  _renderVolumeThumb = (volume) => {
    const { sliderWidth } = this.state;
    const { sliderHeight } = this.state;
    const topOffset = this._calculateTopOffset(constants.scrubberSize, sliderHeight);
    const leftOffset = this._calculateLeftOffset(constants.scrubberSize, volume, sliderWidth);
    const positionStyle = {
      top: topOffset,
      left: leftOffset,
    };
    const thumbStyle = this._thumbStyle();

    return (
      <View
        pointerEvents="none"
        style={[thumbStyle, positionStyle]}
      />
    );
  };

  _renderVolumeSlider = (volume) => {
    const { touch, volume: stateVolume, x } = this.state;

    const volumeValue = volume;
    const backgroundValue = 1 - volumeValue;

    const filledColor = 'white';
    const backgroundColor = 'rgb(62, 62, 62)';

    const filledStyle = {
      backgroundColor: filledColor,
      flex: volumeValue,
    };
    const backgroundStyle = {
      backgroundColor,
      flex: backgroundValue,
    };

    return (
      <View
        style={styles.sliderContainer}
        {...this._panResponder.panHandlers}
        onLayout={(event) => {
          this.setState({
            sliderWidth: event.nativeEvent.layout.width,
            sliderHeight: event.nativeEvent.layout.height,
          });
        }}
      >
        <View pointerEvents="none" style={styles.slider}>
          <View style={filledStyle} />
          <View style={backgroundStyle} />
        </View>
        {this._renderVolumeThumb(touch ? this._touchPercent(x) : stateVolume)}
      </View>
    );
  };

  _renderDismissButton = () => {
    const { config } = this.props;

    return (
      <TouchableHighlight
        style={styles.dismissButton}
        underlayColor="transparent" // Can't move this property to json style file because it doesn't works
        onPress={this.onDismissPress}
      >
        <Text style={styles.dismissIcon}>
          {config.icons.dismiss.fontString}
        </Text>
      </TouchableHighlight>
    );
  };

  render() {
    const { height, width } = this.props;
    const { opacity, volume } = this.state;

    return (
      <Animated.View
        style={[
          styles.container,
          { height, opacity, width },
        ]}
      >
        {this._renderDismissButton()}
        {this._renderVolumeIcon()}
        {this._renderVolumeSlider(volume)}
      </Animated.View>
    );
  }
}
