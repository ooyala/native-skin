var React = require('react-native');
var {
  Image,
  Text,
  StyleSheet,
  Animated,
  View,
} = React;
var ResponsiveDesignManager = require('../responsiveDesignManager');
var Constants = require('../constants');
var styles = require('../utils').getStyles(require('./style/videoWaterMarkStyles.json'));
var {
  BUTTON_NAMES,
  IMG_URLS,
  UI_SIZES
} = Constants;



var logo = React.createClass({
  propTypes: {
    buttonWidth: React.PropTypes.number,
    buttonHeight: React.PropTypes.number,
    waterMarkName: React.PropTypes.string,
    isShow: React.PropTypes.bool,
  },

getInitialState: function() {
    return {
      touch: false,
      opacity: new Animated.Value(1),
      height: new Animated.Value(0),
    };
  },

renderLogo: function(){
  var waterMarkName = this.props.waterMarkName;
  var sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
  return (
        <View style={[styles.watermarkContainer]}>
          <Image
            style={sizeStyle}
            source={{uri: waterMarkName}}/>
        </View>
      );
  },

  render: function() {
    return this.renderLogo();
  }
});
module.exports = logo;
