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
var TimerMixin = require('react-timer-mixin');

var Utils = require('./utils');
var ResponsiveList = require('./widgets/ResponsiveList');
var CircularStatus = require('./widgets/CircularStatus');
var styles = Utils.getStyles(require('./style/discoveryPanelStyles.json'));
var Constants = require('./constants');
var {
  SCREEN_TYPES,
} = Constants;
// TODO: read this from config.
var itemRect;
var thumbnailStyle;
var columnContainerStyle;
var widthPortrait = 375;
var animationDuration = 1000;

var DiscoveryPanel = React.createClass({
  mixins: [TimerMixin],

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
      showCircularStatus: false,
      currentCounterVal: 0,
      counterLimit: 0,
      timeout: null,
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

    if (this.props.screenType === SCREEN_TYPES.END_SCREEN && this.props.config.showCountDownTimerOnEndScreen) {
      this.setCounterTime(parseInt(this.props.config.countDownTime));
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
    this.setState({showCircularStatus: false});
  },

  setCounterTime: function(time) {
    this.setState({
      currentCounterVal: time,
      counterLimit: time,
      showCircularStatus: true,
    });
  },

  updateTimer: function(row) {
    if (this.state.currentCounterVal === 0) {
      this.onRowSelected(row);
    } else if (!this.state.timeout) {
      var timeout = this.setTimeout(() => {
        this.setState({currentCounterVal: this.state.currentCounterVal - 1});
        this.setState({timeout: null});
      }, 1000);
      this.setState({timeout: timeout});
    }
  },

  render: function() {
    var panelHeight = this.props.height - 40;

    if(this.props.width <= widthPortrait){
      itemRect = {width: 186, height:164};
      thumbnailStyle = styles.thumbnailPortrait;
      columnContainerStyle = styles.columnContainerPortrait;
    }else{
      itemRect = {width: 166, height:154};
      thumbnailStyle = styles.thumbnailLandscape;
      columnContainerStyle = styles.columnContainerLandscape;
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

  renderCircularStatus: function() {
    return (
      <CircularStatus
        onPress={() => this.onStatusPressed()}
        total={this.state.counterLimit}
        current={this.state.currentCounterVal}
        thickness={2}
        diameter={44} />);
  },

  renderItem: function(item: object, sectionID: number, itemID: number) {
    var title;
    if (this.props.config.contentTitle && this.props.config.contentTitle.show) {
      title = <Text style={[styles.contentText, this.props.config.contentTitle.font]} numberOfLines={1}>{item.name}</Text>;
    }
  	var duration;
    if (this.props.config.contentDuration && this.props.config.contentDuration.show) {
      duration = <Text style={[styles.contentText, this.props.config.contentDuration.font]} numberOfLines={1}>{Utils.secondsToString(item.duration)}</Text>;
    };

    var circularStatus;
    if (itemID === 0 && this.props.screenType === SCREEN_TYPES.END_SCREEN && this.state.showCircularStatus) {
      circularStatus = this.renderCircularStatus();
      this.updateTimer(item);
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
        {duration}
      </View>
     </TouchableHighlight>
    );
  },

  renderHeader: function() {
    var title;
    if (this.props.config.panelTitle) {
      if (this.props.config.panelTitle.imageUri && this.props.config.panelTitle.showImage) {
        return (<Image style={styles.waterMarkImage} source={{uri: this.props.config.panelTitle.imageUri}} />);
      }
    }

    title = Utils.localizedString(this.props.locale, "Discovery", this.props.localizableStrings);
    return (
      <View style={styles.panelTitle}>
        <Text style={[styles.panelTitleText,this.props.config.panelTitle.titleFont]}>{title}</Text>
      </View>);
  },
});

module.exports = DiscoveryPanel;