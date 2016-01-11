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
    frameWidth: React.PropTypes.number,
    frameHeight: React.PropTypes.number,
    buttonWidth: React.PropTypes.number,
    buttonHeight: React.PropTypes.number,
    platform: React.PropTypes.string,
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

 componentDidUpdate: function(prevProps, prevState) {
    if(prevProps.width != this.props.width && this.props.isShow) {
      this.state.height.setValue(ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT));
    }
    if(prevProps.isShow != this.props.isShow ) {
      this.state.opacity.setValue(this.props.isShow? 1 : 1);
      this.state.height.setValue(this.props.isShow? 0 : ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT));
      Animated.parallel([
        Animated.timing(
          this.state.opacity,
          {
            toValue: this.props.isShow ? 1 : UI_SIZES.CONTROLBAR_HEIGHT,
            duration: 500,
            delay: 0
          }),
        Animated.timing(
          this.state.height,
          {
            toValue: this.props.isShow ? ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_HEIGHT) : this.props.buttonHeight,
            duration: 500,
            delay: 0
          })
      ]).start();
    }
  },

renderLogo: function(){
  var widthStyle = {width:this.props.buttonWidth, opacity:this.state.opacity};
  var topOffset = Math.round((this.props.frameHeight - this.props.buttonHeight) * 0.15);
  var leftOffset = Math.round((this.props.frameWidth - this.props.buttonWidth) * 0.03);
  var waterMarkName = this.props.waterMarkName;
  positionStyle = {
    position: 'absolute', bottom: topOffset, right: leftOffset
  };  
  var sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
      return (
        <Animated.View style={[[positionStyle], widthStyle, {"height": this.state.height}]}>
          <Animated.View style={[styles.buttonArea, sizeStyle]}>
            <Image
              style={sizeStyle}
              source={{uri: waterMarkName}}/>
          </Animated.View>
        </Animated.View>
      );
  },

render: function() {
return this.renderLogo();
}
});
module.exports = logo;
