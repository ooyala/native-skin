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
var rowRect = {width:360, height:64}
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
    return (
      <View style={styles.panel}>
        {this.renderHeader()}
        <ResponsiveList
          horizontal={false}
          data={this.props.dataSource}
          itemRender={this.renderRow}
          width={this.props.width}
          height={this.props.height}
          itemWidth={rowRect.width}
          itemHeight={rowRect.height}>
        </ResponsiveList>
      </View>
    );
  },

  renderRow: function(row: object, sectionID: number, rowID: number) {
    var title;
    if (this.props.config.showContentTitle) {
      title = <Text style={styles.title}>{row.name}</Text>;
    }
  	var duration;
    if (this.props.config.showContentDuration) {
      duration = <Text style={styles.description}>{Utils.secondsToString(row.duration)}</Text>;
    };
    this.onRowImpressed(row);

    return (
    <TouchableHighlight
      underlayColor='#37455B'
      onPress={() => this.onRowSelected(row)}
      style={rowRect}>
      <View style={styles.container}>
        <Image
          source={{uri: row.imageUrl}}
          style={styles.thumbnail} >
        </Image>
        
        <View style={styles.rightContainer}>
          {title}
          {duration}
        </View>
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
    return (<Text style={styles.panelTitle}>{title}</Text>);
  },
});

module.exports = DiscoveryPanel;