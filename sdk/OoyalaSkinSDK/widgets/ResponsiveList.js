var React = require('react-native');
var {
  StyleSheet,
  View,
  TouchableHighlight,
  ScrollView
} = React;

var styles=require('../utils').getStyles(require('./style/ResponsiveListStyles.json'));

var ResponsiveList = React.createClass({
  propTypes: {
    horizontal: React.PropTypes.bool,
    data: React.PropTypes.array,
    itemRender: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    itemWidth: React.PropTypes.number,
    itemHeight: React.PropTypes.number
  },

  getRows: function() {
    var itemsPerRow = Math.floor(this.props.width / this.props.itemWidth);
    if (itemsPerRow == 0) {
      itemsPerRow = 1;
    }
    var numberOfRows = Math.ceil(this.props.data.length / itemsPerRow);
    console.log("numberOfRows"+numberOfRows+"itemsPerRow"+itemsPerRow);
    var rows = [];
    for (var i = 0; i  < numberOfRows; i++) {
      rows[i] = [];
      for (var j = 0; j < itemsPerRow; j++) {
        if (i * itemsPerRow + j < this.props.data.length) {
          rows[i][j] = this.props.data[i * itemsPerRow + j];
        }
      }
    }
    return rows;
  },

  getColumns: function() {
    var itemsPerColumn = Math.floor(this.props.height/ this.props.itemHeight);
    if (itemsPerColumn == 0) {
      itemsPerColumn = 1;
    }
    console.log("numberOfRows"+numberOfRows+"itemsPerRow"+itemsPerRow);
    var numberOfColumns = Math.ceil(this.props.data.length / itemsPerColumn);
    var columns = [];
    for (var i = 0; i  < numberOfColumns; i++) {
      columns[i] = [];
      for (j = 0; j < itemsPerColumn; j++) {
        if (i + j * numberOfColumns < this.props.data.length) {
          columns[i][j] = this.props.data[i + j * numberOfColumns];
        }
      }
    }
    return columns;
  },

  getInitialState: function() {
    return {};
  },

  render: function() {  
    var slices = this.props.horizontal ? this.getColumns() : this.getRows();
    return (
      <ScrollView 
        style={{flex:1}}
        horizontal={this.props.horizontal}> 
        {slices.map(this.renderSlice)}
      </ScrollView>);
  },

  renderSlice: function(slice: object, i: number) {
    console.log("renderSlice" + i);
    var sliceStyle = this.props.horizontal ? styles.column : styles.row;
    return (<View
      key={i} 
      style={sliceStyle}>
      {slice.map(this.props.itemRender)}
    </View>);
  }
});

module.exports = ResponsiveList;