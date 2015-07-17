var React = require('react-native');
var {
  StyleSheet,
  View,
  TouchableHighlight,
  ScrollView
} = React;

var styles = require('../utils').getStyles(require('./style/ResponsiveList.json'));

var ResponsiveList = React.createClass({
  propTypes: {
    horizontal: React.PropTypes.bool,
    data: React.PropTypes.array
    itemRender: React.PropTypes.func
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    itemWidth: React.PropTypes.number,
    itemHeight: React.PropTypes.number
  },

  getRows: function() {
    var itemsPerRow = Math.floor(this.props.width / this.props.itemWidth);
    var numberOfRows = Math.ceil(this.props.data.length / itemsPerRow);
    var rows = [];
    for (var i = 0; i  < numberOfRows; i++) {
      rows[i] = [];
      for (var j = 0; j < itemsPerRow; j++) {
        if (i * itemsPerRow + j < this.props.data.length) {
          rows[rowIndex][] = this.props.data[i * itemsPerRow + j];
        }
      }
      rowIndex++;
    }
    return rows;
  }

  getColumns: function() {
    var itemsPerColumn = Math.floor(this.props.height/ this.props.itemHeight);
    var numberOfColumns = Math.ceil(this.props.data.length / itemsPerColumn);
    var columns = [];
    for (var i = 0; i  < numberOfColumns; i++) {
      columns[i] = [];
      for (j = 0; j < itemsPerColumn; j++) {
        if (i + j * numberOfColumns < this.props.data.length) {
          columns[i][] = this.props.data[i + j * numberOfColumns];
        }
      }
    }
    return columns;
  }

  getInitialState: function() {
    data = this.props.horizontal ? this.getRows : this.getColumns;
    return {
      data:data;
    }
  }

  // Gets the play button based on the current config settings
  render: function() {
    
    return (
      <ScrollView 
        style={{height:this.props.height}}
        horizontal={this.props.horizontal}> 
        {this.state.data.map(renderRow)}
      </ScrollView>);
  },

  renderRow: function(item, i) {
    var rowStyle = this.props.horizontal ? styles.row : styles.column;
    <View style={rowStyle}>
      {item.map(itemRender)}
    </View>
  }
});

module.exports = ResponsiveList;