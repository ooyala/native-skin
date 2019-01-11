'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {
  Animated,
  StyleSheet,
  PanResponder,
  Text,
  TouchableHighlight,
  View
} from 'react-native';


const Utils = require('../utils');
const styles = Utils.getStyles(require('./style/VolumePanelStyles'));

const constants = {
  animationDuration: 1000,
  scrubberSize: 14,
  scrubTouchableDistance: 45
}

class VolumePanel extends React.Component {
  static propTypes = {
    onDismiss: PropTypes.func,
    onVolumeChanged: PropTypes.func.isRequired,
    volume: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    config: PropTypes.object,
  };

  state = {
    volume: this.props.volume,
    opacity: new Animated.Value(0),
    touch: false,
    x: 0,
    sliderWidth: 0,
    sliderHeight: 0
  };

  componentDidMount() {
    this.state.opacity.setValue(0);
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: constants.animationDuration
        }),
    ]).start();
  };

  _onVolumeChange = (volume) => {
    this.props.onVolumeChanged(volume);
    this.setState({
      volume: volume
    });
  };

  _renderVolumeIcon = () => {
    const iconConfig = (this.state.volume > 0) ? this.props.config.icons.volume : this.props.config.icons.volumeOff;
    const fontFamilyStyle = {fontFamily: iconConfig.fontFamilyName};

    return (
      <View style={styles.volumeIconContainer}>
        <Text style={[styles.volumeIcon, fontFamilyStyle]}>
          {iconConfig.fontString}
        </Text>
      </View>
    );
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
    }
  });

  handleTouchStart = (event) => {
    const volume = this._touchPercent(event.nativeEvent.locationX);
    this._onVolumeChange(volume);
    this.setState({
      touch: true,
      x: event.nativeEvent.locationX
    });
  };

  handleTouchMove = (event) => {
    const locationX = event.nativeEvent.pageX - this.locationPageOffset;
    const volume = this._touchPercent(locationX);
    this._onVolumeChange(volume);
    this.setState({
      x: locationX
    });
  };

  handleTouchEnd = (event) => {
    this.setState({
      touch: false,
      x: null
    });
  };

  onDismissPress = () => {
    this.props.onDismiss();
  };

  // Volume slider

  _touchPercent = (x) => {
    let percent = x / (this.state.sliderWidth);

    if (percent > 1) {
      percent = 1;
    } else if (percent < 0) {
      percent = 0;
    }
    return percent;
  };

  _calculateTopOffset = (componentSize, sliderHeight) => {
    return sliderHeight / 2 - componentSize / 2;
  };

  _calculateLeftOffset = (componentSize, percent, sliderWidth) => {
    return percent * sliderWidth - componentSize * percent;
  };

  _thumbStyle = () => {
    return {
      flex: 0,
      position: 'absolute',
      backgroundColor: 'white',
      borderRadius: 100,
      width: constants.scrubberSize,
      height: constants.scrubberSize,
    };
  };

  _renderVolumeThumb = (volume) => {
    const sliderWidth = this.state.sliderWidth;
    const sliderHeight = this.state.sliderHeight;
    const topOffset = this._calculateTopOffset(constants.scrubberSize, sliderHeight);
    const leftOffset = this._calculateLeftOffset(constants.scrubberSize, volume, sliderWidth);
    const positionStyle = {top: topOffset, left: leftOffset};
    const thumbStyle = this._thumbStyle();

    return (
      <View pointerEvents='none' style={[thumbStyle, positionStyle]}/>
    );
  }

  _renderVolumeSlider = (volume) => {
    const volumeValue = volume;
    const backgroundValue = 1 - volumeValue;

    const filledColor = 'white';
    const backgroundColor = 'rgb(62, 62, 62)';

    const filledStyle = {backgroundColor: filledColor, flex: volumeValue};
    const backgroundStyle = {backgroundColor: backgroundColor, flex: backgroundValue};
    const style = StyleSheet.create({filled: filledStyle, background: backgroundStyle});

    return (
      <View 
        style={styles.sliderContainer}
        {...this._panResponder.panHandlers}
        onLayout={(event) => {
          this.setState({
            sliderWidth: event.nativeEvent.layout.width,
            sliderHeight: event.nativeEvent.layout.height
          });
        }}>
          <View pointerEvents='none' style={styles.slider}>
            <View style={style.filled}/>
            <View style={style.background}/>
          </View>
          {this._renderVolumeThumb(this.state.touch ? this._touchPercent(this.state.x) : this.state.volume)}
      </View>
    );
  };
  
  _renderDismissButton = () => {
    return (
      <TouchableHighlight style={styles.dismissButton}
        underlayColor="transparent" // Can't move this property to json style file because it doesn't works
        onPress={this.onDismissPress}>
          <Text style={styles.dismissIcon}>
            {this.props.config.icons.dismiss.fontString}
          </Text>
      </TouchableHighlight>
    );
  }

  render() {
    const animationStyle = {opacity: this.state.opacity};

    return (
      <Animated.View style={[styles.container, animationStyle, {height: this.props.height, width: this.props.width}]}>
        {this._renderDismissButton()}
        {this._renderVolumeIcon()}
        {this._renderVolumeSlider(this.state.volume)}
      </Animated.View>
    );
  }

}

export default VolumePanel;
