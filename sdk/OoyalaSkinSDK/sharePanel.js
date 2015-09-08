var React = require('react-native');
var {
	Animated,
	StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/sharePanelStyles.json'));
var animationDuration = 1000;

var SharePanel = React.createClass ({
	propTypes: {
		socialButtons: React.PropTypes.array,
		onSocialButtonPress: React.PropTypes.func,
	},

	getInitialState: function() {
    return {
      opacity: new Animated.Value(0)
    };
  },

  componentDidMount:function () {
    this.state.opacity.setValue(0);
    Animated.parallel([
      Animated.timing(                      
        this.state.opacity,                 
        {
          toValue: 1,                         
          duration: animationDuration,
          delay: 0  
        }),
    ]).start();
  },

	onSocialButtonPress: function(serviceType){
		this.props.onSocialButtonPress(serviceType);
	},

	render: function() {
		var sharePanel;
		var socialButtons = [];
		
		for (var i = 0; i < this.props.socialButtons.length; i++){

			var socialButton;
			var buttonName = this.props.socialButtons[i].buttonName;
			var buttonFont = {fontFamily: this.props.socialButtons[i].icon.fontFamilyName, color: "white", fontSize: 50, margin: 10};
      var buttonIcon = this.props.socialButtons[i].icon.fontString;

			// handle javascript reference issue
			var onPressButton = function(buttonName, f){
				return function(){
					f(buttonName);
				};
			}(buttonName, this.onSocialButtonPress);

			socialButton = (
				<TouchableHighlight
					onPress = {onPressButton}
	   				underlayColor="transparent"
	   				activeOpacity={0.5}>
          <Text
            style={buttonFont}>
        {buttonIcon}
          </Text>
	   			</TouchableHighlight>
			);

			socialButtons.push(socialButton);
		}
		var animationStyle = {opacity:this.state.opacity};
		return (
		<Animated.View style={styles.container, animationStyle}>

			<View style={styles.sharePanelNW}>
				<Text style={styles.sharePanelTitle}>{"Check out this video"}</Text>

				<View style={styles.sharePanelButtonRow}>
					{socialButtons}
				</View>
			</View>
		</Animated.View>);
	}
});

module.exports = SharePanel;