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
} = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/discoveryPanelStyles.json'));
var Utils = require('./utils');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.embedCode !== r2.embedCode})

var DiscoveryPanel = React.createClass({
  propTypes: {
    dataSource: React.PropTypes.array,
    onRowAction: React.PropTypes.func,
    config: React.PropTypes.object
  },

  getInitialState: function() {
    return {dataSource:ds.cloneWithRows(this.props.dataSource)};
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
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderHeader={this.renderHeader}
        style={styles.listView}>
      </ListView>
    );
  },

  renderRow: function(row: object, sectionID: number, rowID: number) {
    var title;
    if (this.props.config.showTitle) {
      title = <Text style={styles.title}>{row.name}</Text>;
    }
  	var duration;
    if (this.props.config.showDuration) {
      duration = <Text style={styles.description}>{Utils.secondsToString(row.duration)}</Text>;
    };
    this.onRowImpressed(row);

    return (
    <TouchableHighlight
      underlayColor='#37455B'
      onPress={() => this.onRowSelected(row)}>
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
  	return (
  	  <Text style={styles.panelTitle}>{this.props.config.title}</Text>);
  },
});

module.exports = DiscoveryPanel;