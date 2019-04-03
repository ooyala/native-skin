import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Text,
  View,
  Image,
  TouchableHighlight,
  Platform,
} from 'react-native';

import {
  BUTTON_NAMES,
  UI_SIZES,
} from '../../constants';
import Utils from '../../lib/utils';
import ResponsiveDesignManager from '../../lib/responsiveDesignManager';
import InfoPanel from './InfoPanel/InfoPanel';
import BottomOverlay from '../../shared/BottomOverlay';
import Log from '../../lib/log';
import endScreenStyles from './EndScreen.styles';

const styles = Utils.getStyles(endScreenStyles);

class EndScreen extends Component {
  static propTypes = {
    config: PropTypes.object,
    title: PropTypes.string,
    duration: PropTypes.number,
    description: PropTypes.string,
    promoUrl: PropTypes.string,
    onPress: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    volume: PropTypes.number,
    upNextDismissed: PropTypes.bool,
    fullscreen: PropTypes.bool,
    handleControlsTouch: PropTypes.func,
    loading: PropTypes.bool,
    onScrub: PropTypes.func,
    showAudioAndCCButton: PropTypes.bool,
    markers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  state = {
    showControls: true,
  };

  handleClick = (name) => {
    this.props.onPress(name);
  };

  handlePress = (name) => {
    Log.verbose('VideoView Handle Press: ' + name);
    this.setState({
      lastPressedTime: new Date().getTime(),
    });
    if (this.state.showControls) {
      if (name === 'LIVE') {
        this.props.onScrub(1);
      } else {
        this.props.onPress(name);
      }
    } else {
      this.props.onPress(name);
    }
  };

  renderDefaultScreen = () => {
    const endScreenConfig = this.props.config.endScreen || {};

    const replayMarginBottom = !this.props.config.controlBar.enabled ?
      ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT) : 1;

    const replayButtonLocation = styles.replayButtonCenter;
    let replayButton;

    if (endScreenConfig.showReplayButton) {
      const fontFamilyStyle = {fontFamily: this.props.config.icons.replay.fontFamilyName};
      replayButton = (
        <TouchableHighlight
          accessible={true}
          accessibilityLabel={BUTTON_NAMES.REPLAY}
          accessibilityComponentType="button"
          onPress={() => this.handleClick(BUTTON_NAMES.REPLAY)}
          underlayColor="transparent"
          activeOpacity={0.5}
        >
          <Text style={[styles.replayButton, fontFamilyStyle]}>{this.props.config.icons.replay.fontString}</Text>
        </TouchableHighlight>
      );
    }

    const title = endScreenConfig.showTitle ? this.props.title : null;
    const description = endScreenConfig.showDescription ? this.props.description : null;
    const infoPanel = (<InfoPanel title={title} description={description} />);

    return (
      <View style={[styles.fullscreenContainer, { width: this.props.width,height: this.props.height }]}>
        <Image
          source={{ uri: this.props.promoUrl }}
          style={
            [styles.fullscreenContainer, {
              position: 'absolute',
              top: 0,
              left: 0,
              width: this.props.width,
              height: this.props.height}]}
          resizeMode="contain"
        />
        {infoPanel}
        <View style={[replayButtonLocation, {marginBottom: replayMarginBottom}]}>
          {replayButton}
        </View>
        <View style={styles.controlBarPosition}>
          {this._renderBottomOverlay(true)}
        </View>
      </View>
    );
  };

  handleScrub = (value) => {
    this.props.onScrub(value);
    this.handleClick(BUTTON_NAMES.PLAY_PAUSE);
  };

  _renderBottomOverlay(show) {
    const {
      config, duration, fullscreen, handleControlsTouch, height, loading, markers, showAudioAndCCButton, showWatermark,
      volume, width,
    } = this.props;

    return (
      <BottomOverlay
        width={width}
        height={height}
        primaryButton="replay"
        playhead={duration}
        duration={duration}
        volume={volume}
        onPress={name => this.handlePress(name)}
        shouldShowProgressBar
        showWatermark={showWatermark}
        handleControlsTouch={() => handleControlsTouch()}
        onScrub={value => this.handleScrub(value)}
        fullscreen={fullscreen}
        isShow={show}
        loading={loading}
        showAudioAndCCButton={showAudioAndCCButton}
        config={{
          controlBar: config.controlBar,
          castControls: config.castControls,
          buttons: config.buttons,
          icons: config.icons,
          live: config.live,
          general: config.general,
        }}
        markers={markers}
      />
    );
  }

  renderLoading() {
    const loadingSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.LOADING_ICON);
    const scaleMultiplier = Platform.OS === 'android' ? 2 : 1;
    const topOffset = Math.round((this.props.height - loadingSize * scaleMultiplier) * 0.5);
    const leftOffset = Math.round((this.props.width - loadingSize * scaleMultiplier) * 0.5);
    const loadingStyle = {
      position: 'absolute',
      top: topOffset,
      left: leftOffset,
      width: loadingSize,
      height: loadingSize,
    };
    if (this.props.loading) {
      return (
        <ActivityIndicator
          style={loadingStyle}
          size="large"
        />
      );
    }
    return null;
  }

  render() {
    return (
      <View accessible={false} style={styles.container}>
        {this.renderDefaultScreen()}
        {this.renderLoading()}
      </View>
    );
  }

}

module.exports = EndScreen;
