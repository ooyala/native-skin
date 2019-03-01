import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  ImageBackground,
  Image,
  Text,
  TouchableHighlight,
  View,
  DeviceEventEmitter
} from 'react-native';

import {
  BUTTON_NAMES,
  SCREEN_TYPES
} from '../constants';
import Utils from '../utils';
import Log from '../log';
import ResponsiveList from '../widgets/ResponsiveList';
import CountdownView from '../widgets/countdownTimer';
import CountdownViewAndroid from '../widgets/countdownTimerAndroid';

import panelStyles from './style/panelStyles.json';
import discoveryPanelStyles from './style/discoveryPanelStyles.json';
const styles = Utils.getStyles(discoveryPanelStyles);

// TODO: read this from config.
const animationDuration = 1000;

const rectWidth = 176;
const rectHeight = 160;
const widthThreshold = 300;

let timerListenerAndroid;

class DiscoveryPanel extends Component {
  static propTypes = {
    onDismiss: PropTypes.func,
    localizableStrings: PropTypes.object,
    locale: PropTypes.string,
    dataSource: PropTypes.array,
    onRowAction: PropTypes.func,
    config: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    screenType: PropTypes.string,
  };

  state = {
    opacity: new Animated.Value(0),
    showCountdownTimer: false,
    counterTime: 0,
    impressionsFired:false,
  };

  /*
    onTimerCompleted is emitted by native CountdownViewAndroid component.
    Regular CountdownView uses onTimerCompleted callback defined in jsx
  */
  onTimerCompleted = (e) => {
    this.onRowSelected(e);
  };

  componentWillMount(e) {
    timerListenerAndroid = DeviceEventEmitter.addListener('onTimerCompleted', this.onTimerCompleted)
  }

  componentWillUnmount() {
    timerListenerAndroid.remove();
  }

  componentDidMount() {
    // After the first render, we don't want to fire any more impressions requests
    this.setImpressionsFired(true);

    this.state.opacity.setValue(0);
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: animationDuration,
          delay: 0
        }),
    ]).start();

    if (this.props.screenType === SCREEN_TYPES.END_SCREEN && this.props.config.discoveryScreen.showCountDownTimerOnEndScreen) {
      this.setCounterTime(parseInt(this.props.config.discoveryScreen.countDownTime));
    }
  }

  onRowSelected = (row) => {
  	if (this.props.onRowAction) {
      this.props.onRowAction({action:"click", embedCode:row.embedCode, bucketInfo:row.bucketInfo});
      this.setState({showCountdownTimer: false});
      timerListenerAndroid.remove();
  	}
  };

  onRowImpressed = (row) => {
    if (this.props.onRowAction && !this.state.impressionsFired) {
      this.props.onRowAction({action:"impress", embedCode:row.embedCode, bucketInfo:row.bucketInfo});
    }
  };

  onStatusPressed = () => {
    this.setState({showCountdownTimer: false});
  };

  setCounterTime = (time) => {
    this.setState({
      counterTime: time,
      showCountdownTimer: true,
    });
  };

  setImpressionsFired = (value) => {
    this.setState({
      impressionsFired:value,
    });
  };

  onDismissPress = () => {
    this.props.onDismiss();
  };

  render() {
    const numOfRectsInRow = Math.floor(this.props.width / rectWidth);
    const itemRect = {width: this.props.width / numOfRectsInRow, height: rectHeight};
    const thumbnailStyle = (this.props.width > this.props.height) ? styles.thumbnailLandscape : styles.thumbnailPortrait;
    const columnContainerStyle = (this.props.width > this.props.height) ? styles.columnContainerLandscape : styles.columnContainerPortrait;

    if (!this.state.impressionsFired) {
      Log.log("Firing Impressions for all " + this.props.dataSource.length + " discovery entries")
    }
    const animationStyle = {opacity:this.state.opacity};
    return (
      <Animated.View style={[panelStyles.panel, animationStyle]}>
        {this.renderHeader()}
        {this.renderList(itemRect, thumbnailStyle, columnContainerStyle)}
        {this.renderError()}
      </Animated.View>
    );
  }

  _isDiscoveryError = () => {
    return this.props.dataSource === null || this.props.dataSource.length === 0;
  };

  renderList = (itemRect, thumbnailStyle, containerStyle) => {
    const panelHeight = this.props.height - 40;
    const renderHorizontal = Utils.shouldShowLandscape(this.props.width, this.props.height);
    if (this._isDiscoveryError()) {
      return (
        <ResponsiveList
          horizontal={false}
          data={null}
          itemRender={(a, b, c) => this.renderItem(a, b, c, itemRect, thumbnailStyle, containerStyle)}
          width={this.props.width}
          height={panelHeight}
          itemWidth={itemRect.width}
          itemHeight={itemRect.height}>
        </ResponsiveList>
      );    } else {
      return (
        <ResponsiveList
          horizontal={renderHorizontal}
          data={this.props.dataSource}
          itemRender={(a, b, c) => this.renderItem(a, b, c, itemRect, thumbnailStyle, containerStyle)}
          width={this.props.width}
          height={panelHeight}
          itemWidth={itemRect.width}
          itemHeight={itemRect.height}>
        </ResponsiveList>
      );
    }
  };

  renderCountdownTimer = (item) => Platform.select({
    ios:
      <CountdownView
        style={{width: 44, height: 44}}
        automatic={true}
        time={this.state.counterTime}
        timeLeft={this.state.counterTime}
        radius={22}
        fillColor={'#000000'}
        strokeColor={'#ffffff'}
        fillAlpha={0.7}
        tapCancel={true}
        onPress={this.onStatusPressed}
        onTimerCompleted={() => this.onRowSelected(item)} />,
    android:
      <CountdownViewAndroid
        style={{width: 44, height: 44}}
        countdown={{
          main_color:"#AAffffff",
          secondary_color:"#AA808080",
          fill_color:"#AA000000",
          text_color:"#AAffffff",
          stroke_width:10,
          text_size:75,
          max_time:this.state.counterTime,
          progress:0,
          automatic:true}}
        data={{embedCode:item.embedCode,
               bucketInfo:item.bucketInfo}}/>
  });

  renderItem = (item, sectionID, itemID, itemRect, thumbnailStyle, columnContainerStyle) => {
    let title;
    if (this.props.config.discoveryScreen.contentTitle && this.props.config.discoveryScreen.contentTitle.show) {
      title = <Text style={[styles.contentText, this.props.config.discoveryScreen.contentTitle.font]} numberOfLines={1}>{item.name}</Text>;
    }

    let circularStatus;
    if (itemID === 0 && this.props.screenType === SCREEN_TYPES.END_SCREEN && this.state.showCountdownTimer) {
      circularStatus = this.renderCountdownTimer(item);
    }

    let thumbnail = (
      <ImageBackground
        source={{uri:item.imageUrl}}
        style={[thumbnailStyle, styles.thumbnailContainer]}>
        {circularStatus}
      </ImageBackground>);

    this.onRowImpressed(item);

    return (
    <TouchableHighlight
      key={sectionID}
      underlayColor='#37455B'
      onPress={() => this.onRowSelected(item)}
      style={itemRect}>
      <View style={columnContainerStyle}>
        {thumbnail}
        {title}
      </View>
     </TouchableHighlight>
    );
  };

  renderHeader = () => {
    if (this.props.config.discoveryScreen.panelTitle) {
      if (this.props.config.discoveryScreen.panelTitle.imageUri && this.props.config.discoveryScreen.panelTitle.showImage) {
        return (<Image style={styles.waterMarkImage} source={{uri: this.props.config.discoveryScreen.panelTitle.imageUri}} />);
      }
    }

    const title = Utils.localizedString(this.props.locale, "Discover", this.props.localizableStrings);
    const panelIcon = this.props.config.icons.discovery.fontString;

    // TO-DO for line (277-280) we can not change accessibility label value for text tags.
    // This ability is added in latest react native 0.46 onwards
    // so we can remove this piece of code once we upgrade.
    return (
    <View style={panelStyles.panelTitleView}>
      <Text style={[panelStyles.panelTitleText]}>
      {title}
      </Text>
      <TouchableHighlight accessible={true} accessibilityLabel={BUTTON_NAMES.DISCOVERY}>
        <View>
          <Text style={panelStyles.panelIcon}>{panelIcon}</Text>
        </View>
      </TouchableHighlight>
      <View style={panelStyles.headerFlexibleSpace}></View>
      <TouchableHighlight
        accessible={true} accessibilityLabel={BUTTON_NAMES.DISMISS} accessibilityComponentType="button"
        style = {[panelStyles.dismissButton]}
        onPress={this.onDismissPress}>
        <Text style={panelStyles.dismissIcon}>{this.props.config.icons.dismiss.fontString}</Text>
      </TouchableHighlight>
    </View>);
  };

  renderError = () => {
    const errorTitleText = "SOMETHING NOT RIGHT! THERE SHOULD BE VIDEOS HERE.";
    const errorContentText = "(Try Clicking The Discover Button Again On Reload Your Page)";
    const errorFlexDirectionStyle = {flexDirection: "row"};

    if (this.props.width < widthThreshold) {
      errorFlexDirectionStyle = {flexDirection: "column"};
    }

    const errorTitle = Utils.localizedString(this.props.locale, errorTitleText, this.props.localizedString);
    const errorContent = Utils.localizedString(this.props.locale, errorContentText, this.props.localizedString);
    if (this._isDiscoveryError()) {
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
  };
}

module.exports = DiscoveryPanel;
