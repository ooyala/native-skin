/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  Animated,
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView
} = React;

var Utils = require('./utils');
var ResponsiveList = require('./widgets/ResponsiveList');
var CountdownView = require('./widgets/countdownTimer');
var styles = Utils.getStyles(require('./style/discoveryPanelStyles.json'));
var Constants = require('./constants');
var {
  SCREEN_TYPES,
} = Constants;
// TODO: read this from config.
var itemRect;
var thumbnailStyle;
var columnContainerStyle;
var animationDuration = 1000;

var rectWidth = 176;
var rectHeight = 160;

var DiscoveryPanel = React.createClass({

  propTypes: {
    localizableStrings: React.PropTypes.object,
    locale: React.PropTypes.string,
    dataSource: React.PropTypes.array,
    onRowAction: React.PropTypes.func,
    config: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    screenType: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      opacity: new Animated.Value(0),
      showCountdownTimer: false,
      counterTime: 0,
    };
  },

  componentDidMount:function () {
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
  },

  onRowSelected: function(row) {
  	if (this.props.onRowAction) {
  	  this.props.onRowAction({action:"click", embedCode:row.embedCode, bucketInfo:row.bucketInfo});
  	}
  },

  onRowImpressed: function(row) {
    if (this.props.onRowAction) {
      this.props.onRowAction({action:"impress", embedCode:row.embedCode, bucketInfo:row.bucketInfo});
    }
  },

  onStatusPressed: function() {
    this.setState({showCountdownTimer: false});
  },

  setCounterTime: function(time) {
    this.setState({
      counterTime: time,
      showCountdownTimer: true,
    });
  },

  setRectInRow: function(widthRect, heightRec, thumbnailStyleRec, columnContainerStyleRec) {
    var numOfRectsInRow = Math.floor(this.props.width / widthRect);
    itemRect = {width: this.props.width / numOfRectsInRow, height: heightRec};
    thumbnailStyle = thumbnailStyleRec;
    columnContainerStyle = columnContainerStyleRec;
  },

  render: function() {
    var panelHeight = this.props.height - 40;
    var margin;

    // landscape
    if (this.props.width > this.props.height) {
      this.setRectInRow(rectWidth, rectHeight, styles.thumbnailLandscape, styles.columnContainerLandscape); 
    // portrait
    } else {
      this.setRectInRow(rectWidth, rectHeight, styles.thumbnailPortrait, styles.columnContainerPortrait);
    }

    var animationStyle = {opacity:this.state.opacity};
    return (
      <Animated.View style={[styles.panel, animationStyle]}>
        {this.renderHeader()}
        <ResponsiveList
          horizontal={false}
          data={this.props.dataSource}
          itemRender={this.renderItem}
          width={this.props.width}
          height={panelHeight}
          itemWidth={itemRect.width}
          itemHeight={itemRect.height}>
        </ResponsiveList>
      </Animated.View>
    );
  },

  renderCountdownTimer: function(item) {
    return (
      <CountdownView
        style={{
          width: 44,
          height: 44,
        }}
        automatic={true}
        time={this.state.counterLimit}
        timeLeft={this.state.counterLimit}
        radius={22}
        fillColor={'#000000'}
        strokeColor={'#ffffff'}
        fillAlpha={0.7}
        tapCancel={true}
        onPress={this.onStatusPressed}
        onTimerCompleted={() => this.onRowSelected(item)} />);
  },

  renderItem: function(item: object, sectionID: number, itemID: number) {
    var title;
    if (this.props.config.discoveryScreen.contentTitle && this.props.config.discoveryScreen.contentTitle.show) {
      title = <Text style={[styles.contentText, this.props.config.discoveryScreen.contentTitle.font]} numberOfLines={1}>{item.name}</Text>;
    }

    var circularStatus;
    if (itemID === 0 && this.props.screenType === SCREEN_TYPES.END_SCREEN && this.state.showCountdownTimer) {
      circularStatus = this.renderCountdownTimer(item);
    }

    var thumbnail = (
      <Image
        source={{uri:item.imageUrl}}
        style={[thumbnailStyle, styles.thumbnailContainer]}>
        {circularStatus}
      </Image>);
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
  },

  renderHeader: function() {
    var title;
    if (this.props.config.discoveryScreen.panelTitle) {
      if (this.props.config.discoveryScreen.panelTitle.imageUri && this.props.config.discoveryScreen.panelTitle.showImage) {
        return (<Image style={styles.waterMarkImage} source={{uri: this.props.config.discoveryScreen.panelTitle.imageUri}} />);
      }
    }

    title = Utils.localizedString(this.props.locale, "Discovery", this.props.localizableStrings);
    return (
      <View style={styles.panelTitle}>
        <Text style={[styles.panelTitleText,this.props.config.discoveryScreen.panelTitle.titleFont]}>
        {title} <Text style={styles.icon}>{this.props.config.icons.discovery.fontString}</Text>
        </Text>
      </View>);
  },
});

module.exports = DiscoveryPanel;