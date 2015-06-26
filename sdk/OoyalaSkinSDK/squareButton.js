var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var SquareButton = React.createClass({
  propTypes: {
    icon: React.PropTypes.string,
    position: React.PropTypes.string,
    onPress: React.PropTypes.func,
    opacity: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    size: React.PropTypes.number,
  },

  // Gets the play button based on the current config settings
  render: function() {
    var sizeStyle = {width: this.props.size, height: this.props.size};
    var fontStyle = {fontSize: this.props.size};
    var positionStyle;

    if (this.props.position == "center") {
      var topOffset = Math.round((this.props.height - this.props.size) * 0.5);
      var leftOffset = Math.round((this.props.width - this.props.size) * 0.5);
      
      positionStyle = {position:'absolute', top: topOffset, left: leftOffset};
    } else {
      positionStyle = [styles[this.props.position], sizeStyle];
    }
    console.log("positionStyle is"+positionStyle);

    return (
      <TouchableHighlight
        style={positionStyle}
        onPress={this.props.onPress}
        underlayColor="transparent"
        activeOpacity={this.props.opacity}>
        <View>
          <Text style={[styles.buttonTextStyle, fontStyle]}>{this.props.icon}</Text>
        </View>
      </TouchableHighlight>);
  },
});

var buttonMargin = 10;

var styles = StyleSheet.create({
  topRight: {
    position: 'absolute',    
    top: buttonMargin,
    right: buttonMargin,
  },

  topLeft: {
    position: 'absolute',    
    top: buttonMargin,
    left: buttonMargin,
  },

  bottomRight: {
    position: 'absolute',    
    bottom: buttonMargin,
    right: buttonMargin,
  },

  bottomLeft: {
    position: 'absolute',    
    bottom: buttonMargin,
    left: buttonMargin,
  },

  buttonTextStyle: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'fontawesome',
  }
});

module.exports = SquareButton;