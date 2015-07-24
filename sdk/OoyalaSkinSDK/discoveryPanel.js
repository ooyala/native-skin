/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
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
var styles = Utils.getStyles(require('./style/discoveryPanelStyles.json'));
// TODO: read this from config.
var itemRect = {width:160, height:120}
var DiscoveryPanel = React.createClass({
  propTypes: {
    dataSource: React.PropTypes.array,
    onRowAction: React.PropTypes.func,
    config: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number
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

  render: function() {
    var panelHeight = this.props.height - 40;
    return (
      <View style={styles.panel}>
        {this.renderHeader()}
        <ResponsiveList
          horizontal={true}
          data={this.props.dataSource}
          itemRender={this.renderItem}
          width={this.props.width}
          height={panelHeight}
          itemWidth={itemRect.width}
          itemHeight={itemRect.height}>
        </ResponsiveList>
      </View>
    );
  },

  renderItem: function(item: object, sectionID: number, itemID: number) {
    var title;
    if (this.props.config.showContentTitle) {
      title = <Text style={styles.title} numberOfLines={1}>{item.name}</Text>;
    }
  	var duration;
    if (this.props.config.showContentDuration) {
      duration = <Text style={styles.description} numberOfLines={1}>{Utils.secondsToString(item.duration)}</Text>;
    };
    var thumbnail = (
      <Image
        source={{uri:item.imageUrl}}
        style={styles.thumbnail} >
      </Image>);
    this.onRowImpressed(item);

    return (
    <TouchableHighlight
      underlayColor='#37455B'
      onPress={() => this.onRowSelected(item)}
      style={itemRect}>
      <View style={styles.columnContainer}>
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
      } else if (this.props.config.panelTitle.text) {
        title = this.props.config.panelTitle.text;
      }
    }
    return (
      <View style={styles.panelTitle}>
        <Text style={[styles.panelTitleText,this.props.config.titleFont]}>{title}</Text>
      </View>);
  },
});

module.exports = DiscoveryPanel;