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
  ScrollView,
  DeviceEventEmitter
} = React;

var Utils = require('./utils');
var ResponsiveList = require('./widgets/ResponsiveList');
var CountdownView = require('./widgets/countdownTimer');
var CountdownViewAndroid = require('./widgets/countdownTimerAndroid');
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
var widthThreshold = 300;

var DiscoveryPanel = React.createClass({

  propTypes: {
    localizableStrings: React.PropTypes.object,
    locale: React.PropTypes.string,
    dataSource: React.PropTypes.array,
    onRowAction: React.PropTypes.func,
    config: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    platform: React.PropTypes.string,
    screenType: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      opacity: new Animated.Value(0),
      showCountdownTimer: false,
      counterTime: 0,
    };
  },
  
  /*
    onTimerCompleted is emitted by native CountdownViewAndroid component. 
    Regular CountdownView uses onTimerCompleted callback defined in jsx
  */
  onTimerCompleted: function(e: Event) {
    var item = {embedCode:e}
    item.embedCode = e
    this.onRowSelected(item);
  },

  componentWillMount: function(e: Event) {
    DeviceEventEmitter.addListener('onTimerCompleted', this.onTimerCompleted)
  },

  componentWillUnMount: function() {
    DeviceEventEmitter.removeListener('onTimerCompleted', this.onTimerCompleted);
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
        {this.renderList()}
        {this.renderError()}
      </Animated.View>
    );
  },

  _isDiscoveryError: function() {
    return this.props.dataSource === null || this.props.dataSource.length === 0;
  },

  renderList: function() {
    var panelHeight = this.props.height - 40;
    var renderHorizontal = Utils.shouldShowLandscape(this.props.width, this.props.height);
    if (this._isDiscoveryError()) {
      return (
        <ResponsiveList
          horizontal={false}
          data={null}
          itemRender={this.renderItem}
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
          itemRender={this.renderItem}
          width={this.props.width}
          height={panelHeight}
          itemWidth={itemRect.width}
          itemHeight={itemRect.height}>
        </ResponsiveList>
      );
    }
  },

  renderCountdownTimer: function(item) {
    if(this.props.platform == Constants.PLATFORMS.ANDROID) {
      return (
          <CountdownViewAndroid 
            style={{width:44,height:44}} 
            countdown={{
              main_color:"#AAffffff",
              secondary_color:"#AA808080",
              fill_color:"#AA000000",
              text_color:"#AAffffff",
              stroke_width:10,
              text_size:75,
              max_time:10,
              progress:0}}
            embedCode={item.embedCode}/>);
    }
    if(this.props.platform == Constants.PLATFORMS.IOS) {
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
    }
                      
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

  renderError: function() {
    var errorTitleText = "SOMETHING NOT RIGHT! THERE SHOULD BE VIDEOS HERE.";
    var errorContentText = "(Try Clicking The Discover Button Again On Reload Your Page)";
    var errorFlexDirectionStyle = {flexDirection: "row"};

    if (this.props.width < widthThreshold) {
      errorFlexDirectionStyle = {flexDirection: "column"};
    }

    var errorTitle = Utils.localizedString(this.props.locale, errorTitleText, this.props.localizedString);
    var errorContent = Utils.localizedString(this.props.locale, errorContentText, this.props.localizedString);
    var warningIcon = this.props.config.icons.warning ? this.props.config.icons.warning.fontString : null;
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

          <View style={styles.panelWarning}>
            <Text style={styles.warningIcon}>
              {warningIcon}
            </Text>
          </View>
        </View>
      );
    }
  },
});

module.exports = DiscoveryPanel;