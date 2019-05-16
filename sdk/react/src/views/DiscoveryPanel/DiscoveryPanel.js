// @flow

import PropTypes from 'prop-types';
import React from 'react';
import {
  Animated,
  DeviceEventEmitter,
  Image,
  ImageBackground,
  Platform,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { BUTTON_NAMES, SCREEN_TYPES } from '../../constants';
import * as Log from '../../lib/log';
import * as Utils from '../../lib/utils';
import ResponsiveList from './ResponsiveList';
import CountdownViewAndroid from '../../shared/CountdownTimerAndroid';
import CountdownViewiOS from '../../shared/CountdownTimerIos';

import styles from './DiscoveryPanel.styles';

// TODO: read this from config.
const animationDuration = 1000;

const rectWidth = 176;
const rectHeight = 160;
const widthThreshold = 300;

let timerListenerAndroid;

export default class DiscoveryPanel extends React.Component {
  static propTypes = {
    onDismiss: PropTypes.func,
    localizableStrings: PropTypes.shape({}),
    locale: PropTypes.string,
    dataSource: PropTypes.arrayOf(),
    onRowAction: PropTypes.func,
    config: PropTypes.shape({}),
    width: PropTypes.number,
    height: PropTypes.number,
    screenType: PropTypes.string,
    localizedString: PropTypes.string,
  };

  static defaultProps = {
    onDismiss: null,
    localizableStrings: [],
    locale: '',
    dataSource: [],
    onRowAction: null,
    config: null,
    width: 0,
    height: 0,
    screenType: SCREEN_TYPES.DISCOVERY_END_SCREEN,
    localizedString: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      showCountdownTimer: false,
      counterTime: 0,
      impressionsFired: false,
    };
  }

  componentWillMount() {
    timerListenerAndroid = DeviceEventEmitter.addListener('onTimerCompleted', this.onTimerCompleted);
  }

  componentDidMount() {
    // After the first render, we don't want to fire any more impressions requests
    this.setImpressionsFired(true);

    const { opacity } = this.state;

    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: animationDuration,
          delay: 0,
        },
      ),
    ])
      .start();

    const { screenType, config } = this.props;
    const { showCountDownTimerOnEndScreen, countDownTime } = config.discoveryScreen;

    if (screenType === SCREEN_TYPES.END_SCREEN && showCountDownTimerOnEndScreen) {
      this.setCounterTime(parseInt(countDownTime, 10));
    }
  }

  componentWillUnmount() {
    timerListenerAndroid.remove();
  }

  /*
onTimerCompleted is emitted by native CountdownViewAndroid component.
Regular CountdownView uses onTimerCompleted callback defined in jsx
*/
  onTimerCompleted = (e) => {
    this.onRowSelected(e);
  };

  onRowSelected = (row) => {
    const { onRowAction } = this.props;

    if (onRowAction) {
      onRowAction({
        action: 'click',
        embedCode: row.embedCode,
        bucketInfo: row.bucketInfo,
      });
      this.setState({
        showCountdownTimer: false,
      });
      timerListenerAndroid.remove();
    }
  };

  onRowImpressed = (row) => {
    const { onRowAction } = this.props;
    const { impressionsFired } = this.state;

    if (onRowAction && !impressionsFired) {
      onRowAction({
        action: 'impress',
        embedCode: row.embedCode,
        bucketInfo: row.bucketInfo,
      });
    }
  };

  onStatusPressed = () => {
    this.setState({
      showCountdownTimer: false,
    });
  };

  setCounterTime = (time) => {
    this.setState({
      counterTime: time,
      showCountdownTimer: true,
    });
  };

  setImpressionsFired = (value) => {
    this.setState({
      impressionsFired: value,
    });
  };

  onDismissPress = () => {
    const { onDismiss } = this.props;
    onDismiss();
  };

  isDiscoveryError = () => {
    const { dataSource } = this.props;

    return dataSource === null || dataSource.length === 0;
  };

  renderList = (itemRect, thumbnailStyle, containerStyle) => {
    const { height, width, dataSource } = this.props;
    const panelHeight = height - 40;
    const renderHorizontal = Utils.shouldShowLandscape(width, height);
    if (this.isDiscoveryError()) {
      return (
        <ResponsiveList
          horizontal={false}
          data={null}
          itemRender={(a, b, c) => this.renderItem(a, b, c, itemRect, thumbnailStyle, containerStyle)}
          width={width}
          height={panelHeight}
          itemWidth={itemRect.width}
          itemHeight={itemRect.height}
        />
      );
    }

    return (
      <ResponsiveList
        horizontal={renderHorizontal}
        data={dataSource}
        itemRender={(a, b, c) => this.renderItem(a, b, c, itemRect, thumbnailStyle, containerStyle)}
        width={width}
        height={panelHeight}
        itemWidth={itemRect.width}
        itemHeight={itemRect.height}
      />
    );
  };

  renderCountdownTimer = (item) => {
    const { counterTime } = this.state;

    Platform.select({
      ios: (
        <CountdownViewiOS
          style={{
            width: 44,
            height: 44,
          }}
          automatic
          time={counterTime}
          timeLeft={counterTime}
          radius={22}
          fillColor="#000000"
          strokeColor="#ffffff"
          fillAlpha={0.7}
          tapCancel
          onPress={this.onStatusPressed}
          onTimerCompleted={() => this.onRowSelected(item)}
        />
      ),
      android: (
        <CountdownViewAndroid
          style={{
            width: 44,
            height: 44,
          }}
          countdown={{
            main_color: '#AAffffff',
            secondary_color: '#AA808080',
            fill_color: '#AA000000',
            text_color: '#AAffffff',
            stroke_width: 10,
            text_size: 75,
            max_time: counterTime,
            progress: 0,
            automatic: true,
          }}
          data={{
            embedCode: item.embedCode,
            bucketInfo: item.bucketInfo,
          }}
        />
      ),
    });
  };

  renderItem = (item, sectionID, itemID, itemRect, thumbnailStyle, columnContainerStyle) => {
    const { config, screenType } = this.props;
    const { contentTitle } = config.discoveryScreen;
    const { showCountdownTimer } = this.state;
    let title;
    if (contentTitle && contentTitle.show) {
      title = <Text style={[styles.contentText, contentTitle.font]} numberOfLines={1}>{item.name}</Text>;
    }

    let circularStatus;
    if (itemID === 0 && screenType === SCREEN_TYPES.END_SCREEN && showCountdownTimer) {
      circularStatus = this.renderCountdownTimer(item);
    }

    const thumbnail = (
      <ImageBackground
        source={{ uri: item.imageUrl }}
        style={[thumbnailStyle, styles.thumbnailContainer]}
      >
        {circularStatus}
      </ImageBackground>
    );

    this.onRowImpressed(item);

    return (
      <TouchableHighlight
        key={sectionID}
        underlayColor="#37455B"
        onPress={() => this.onRowSelected(item)}
        style={itemRect}
      >
        <View style={columnContainerStyle}>
          {thumbnail}
          {title}
        </View>
      </TouchableHighlight>
    );
  };

  renderHeader = () => {
    const { config, locale, localizableStrings } = this.props;
    const { panelTitle } = config.discoveryScreen;
    const { icons } = config;

    if (panelTitle) {
      if (panelTitle.imageUri && panelTitle.showImage) {
        return (<Image style={styles.waterMarkImage} source={{ uri: panelTitle.imageUri }} />);
      }
    }

    const title = Utils.localizedString(locale, 'Discover', localizableStrings);
    const panelIcon = icons.discovery.fontString;

    // TO-DO for line (277-280) we can not change accessibility label value for text tags.
    // This ability is added in latest react native 0.46 onwards
    // so we can remove this piece of code once we upgrade.
    return (
      <View style={styles.panelTitleView}>
        <Text style={[styles.panelTitleText]}>
          {title}
        </Text>
        <TouchableHighlight accessible accessibilityLabel={BUTTON_NAMES.DISCOVERY}>
          <View>
            <Text style={styles.panelIcon}>{panelIcon}</Text>
          </View>
        </TouchableHighlight>
        <View style={styles.headerFlexibleSpace} />
        <TouchableHighlight
          accessible
          accessibilityLabel={BUTTON_NAMES.DISMISS}
          accessibilityComponentType="button"
          style={[styles.dismissButton]}
          onPress={this.onDismissPress}
        >
          <Text style={styles.dismissIcon}>{icons.dismiss.fontString}</Text>
        </TouchableHighlight>
      </View>
    );
  };

  renderError = () => {
    const errorTitleText = 'SOMETHING NOT RIGHT! THERE SHOULD BE VIDEOS HERE.';
    const errorContentText = '(Try Clicking The Discover Button Again On Reload Your Page)';
    let errorFlexDirectionStyle = { flexDirection: 'row' };
    const { width, locale, localizedString } = this.props;

    if (width < widthThreshold) {
      errorFlexDirectionStyle = { flexDirection: 'column' };
    }

    const errorTitle = Utils.localizedString(locale, errorTitleText, localizedString);
    const errorContent = Utils.localizedString(locale, errorContentText, localizedString);
    if (this.isDiscoveryError()) {
      return (
        <View style={[styles.panelErrorPanel, errorFlexDirectionStyle]}>
          <View style={styles.panelErrorInfo}>
            <Text style={styles.panelErrorTitleText}>
              {errorTitle}
            </Text>
            <Text style={styles.panelErrorContentText}>
              {errorContent}
            </Text>
          </View>
        </View>
      );
    }

    return null;
  };

  render() {
    const { width, height, dataSource } = this.props;
    const { impressionsFired, opacity } = this.state;

    const numOfRectsInRow = Math.floor(width / rectWidth);
    const itemRect = {
      width: width / numOfRectsInRow,
      height: rectHeight,
    };
    const thumbnailStyle = (width > height) ? styles.thumbnailLandscape : styles.thumbnailPortrait;
    const columnContainerStyle = (width > height) ? styles.columnContainerLandscape : styles.columnContainerPortrait;

    if (!impressionsFired) {
      Log.log(`Firing Impressions for all ${dataSource.length} discovery entries`);
    }
    const animationStyle = { opacity };

    return (
      <Animated.View style={[styles.panel, animationStyle]}>
        {this.renderHeader()}
        {this.renderList(itemRect, thumbnailStyle, columnContainerStyle)}
        {this.renderError()}
      </Animated.View>
    );
  }
}
