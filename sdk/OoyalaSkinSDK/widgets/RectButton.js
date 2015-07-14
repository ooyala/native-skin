var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));

var RectButton = React.createClass({
  propTypes: {
    icon: React.PropTypes.string,
    position: React.PropTypes.string,
    onPress: React.PropTypes.func,
    opacity: React.PropTypes.number,
    frameWidth: React.PropTypes.number,
    frameHeight: React.PropTypes.number,
    buttonWidth: React.PropTypes.number,
    buttonHeight: React.PropTypes.number,
    buttonColor: React.PropTypes.string,
    buttonOpacity: React.PropTypes.string,
    fontSize: React.PropTypes.number,
    style:React.PropTypes.object,
  },

  // Gets the play button based on the current config settings
  render: function() {
    var fontStyle = {fontSize: this.props.fontSize};
    var sizeStyle = {width: this.props.buttonWidth, heightv: this.props.buttonHeight};
    var buttonColor = {color: this.props.buttonColor == null? "white": this.props.buttonColor};
    var buttonOpacity = {opacity: this.props.buttonOpacity};
    var positionStyle;

    if(this.props.style != null) {
      positionStyle = this.props.style;
    } else if (this.props.position == "center") {
      var topOffset = Math.round((this.props.frameHeight - this.props.buttonHeight) * 0.5);
      var leftOffset = Math.round((this.props.frameWidth - this.props.buttonWidth) * 0.5);
      
      positionStyle = 
        {position: 'absolute', top: topOffset, left: leftOffset};
    } else {    
      positionStyle = styles[this.props.position];
    }

    return (
      <TouchableHighlight  
        style={positionStyle}
        onPress={this.props.onPress}
        underlayColor="transparent"
        activeOpacity={this.props.opacity}>
        <View style={[styles.buttonArea, sizeStyle]}>
          <Text style={[styles.buttonTextStyle, fontStyle, buttonColor, buttonOpacity]}>{this.props.icon}</Text>
        </View>
      </TouchableHighlight>);
  },
});

module.exports = RectButton;