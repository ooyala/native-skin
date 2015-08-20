var React = require('react-native');
var {
	StyleSheet,
  	Text,
  	View,
  	Image,
  	TouchableHighlight,
} = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/sharePanelStyles.json'));

var SharePanel = React.createClass ({
	propTypes: {
		socialButtons: React.PropTypes.array,
		onSocialButtonPress: React.PropTypes.func,
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
		
		return (
		<View style={styles.container}>

			<View style={styles.sharePanelNW}>
				<Text style={styles.sharePanelTitle}>{"Check out this video"}</Text>

				<View style={styles.sharePanelButtonRow}>
					{socialButtons}
				</View>
			</View>
		</View>);
	}
});

module.exports = SharePanel;