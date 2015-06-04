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
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.embedCode !== r2.embedCode})

var DiscoveryPanel = React.createClass({
  propTypes: {
    isShow: React.PropTypes.bool,
    dataSource: React.PropTypes.array,
    onRowAction: React.PropTypes.func,
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
    var discoveryPanel;
    if(this.props.isShow){
      discoveryPanel=(
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderHeader={this.renderHeader}
          style={styles.listView}>
        </ListView>
      );
    }

    return (
      <View style={styles.fullscreenContainer}>
        {discoveryPanel}
      </View>
    );
  },

  renderRow: function(row: object, sectionID: number, rowID: number) {
  	var duration = Utils.secondsToString(row.duration);
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
          <Text style={styles.title}>{row.name}</Text>
          <Text style={styles.description}>{duration}</Text>
        </View>
      </View>
     </TouchableHighlight>
    );
  },

  renderHeader: function() {
  	return (
  	  <Text style={styles.panelTitle}>Discovery</Text>);
  },
});

var styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  panelTitle: {
  	flex: 1,
  	fontSize: 40,
  	textAlign: 'left',
  	color: 'white',
  	padding: 20
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 6,
    marginTop: 6,
    marginLeft: 12,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 8
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontFamily: 'Arial-BoldMT',
    textAlign: 'left',
    color: 'white',
  },
  description: {
  	fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Arial',
    textAlign: 'left',
    color: '#ADADAD',
  },
  thumbnail: {
    width: 112,
    height: 63,
  },
  listView: {
    backgroundColor: '#333333',
  },
});

module.exports = DiscoveryPanel;