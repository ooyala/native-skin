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
  View,
} = React;

var Utils = require('./utils');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.embedCode !== r2.embedCode})

var DiscoveryPanel = React.createClass({
  propTypes: {
    dataSource: React.PropTypes.array,
    onPress: React.PropTypes.func,
  },

  getInitialState: function() {
    return {dataSource:ds.cloneWithRows(this.props.dataSource)};
  },

  render: function() {
    return (
      <View style={styles.panel}>
      	<Text style={styles.panelTitle}>Discovery</Text>
      	<ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderMovie}
          style={styles.listView}
        />
      </View>
    );
  },

  renderMovie: function(movie) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: movie.imageUrl}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{movie.name}</Text>
          <Text style={styles.year}>{movie.embedCode}</Text>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  panel: {
  	flex: 1,
  	flexDirection: 'column',
  },
  panelTitle: {
  	fontSize: 40,
  	textAlign: 'left',
  	backgroundColor: 'black',
  	color: 'white',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
});

module.exports = DiscoveryPanel;