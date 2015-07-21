var React = require('react-native');
var {
  StyleSheet,
  View,
  TouchableHighlight,
  ScrollView
} = React;

var styles=require('../utils').getStyles(require('./style/ResponsiveListStyles.json'));
var placeHolderItem = "ResponsiveListPlaceHolder";
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
        } else {
          rows[i][j] = placeHolderItem;
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
    
    var numberOfColumns = Math.ceil(this.props.data.length / itemsPerColumn);
    console.log("numberOfColumns"+numberOfColumns+"itemsPerColumn"+itemsPerColumn);
    var columns = [];
    for (var i = 0; i  < numberOfColumns; i++) {
      columns[i] = [];
      for (j = 0; j < itemsPerColumn; j++) {
        if (i + j * numberOfColumns < this.props.data.length) {
          columns[i][j] = this.props.data[i + j * numberOfColumns];
        } else {
          columns[i][j] = placeHolderItem;
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
    var sliceStyle = this.props.horizontal ? styles.column : styles.row;
    return (<View
      key={i} 
      style={sliceStyle}>
      {slice.map(this.renderItem)}
    </View>);
  },

  renderItem: function(item: object, i: number) {
    var placeHolderStyle = 
      {backgroundColor: "transparent", width:this.props.itemWidth, height: this.props.itemHeight};
    if (item === placeHolderItem) {
      return (<View style={placeHolderStyle}></View>);
    } else {
      console.log("item"+item+"i"+i);
      return this.props.itemRender(item, i);
    }
  }
});

module.exports = ResponsiveList;