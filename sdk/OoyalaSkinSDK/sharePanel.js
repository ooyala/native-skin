var React = require('react-native');
var {
	StyleSheet,
  	Text,
  	View,
  	Image,
  	TouchableHighlight,
} = React;

var SharePanel = React.createClass ({
	propTypes: {
		isShow: React.PropTypes.boolean,
		socialButtons: React.PropTypes.array,
		onSocialButtonPress: React.PropTypes.func,
	},

	onSocialButtonPress: function(serviceType){
		this.props.onSocialButtonPress(serviceType);
	},

	render: function() {
		var sharePanel;
		var socialButtons = [];

		if(this.props.isShow){
			for (var i = 0; i < this.props.socialButtons.length; i++){

				var socialButton;
				var buttonName = this.props.socialButtons[i].buttonName;
				var buttonImgUrl = this.props.socialButtons[i].imgUrl;

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
		   				<Image style={styles.socialButton}
				       		source={{uri: buttonImgUrl}}
				       		resizeMode={Image.resizeMode.contain}>
				   		</Image>
		   			</TouchableHighlight>
				);

				socialButtons.push(socialButton);
			}
			
			sharePanel = (
				<View style={styles.sharePanelNW}>
					<Text style={styles.sharePanelTitle}>{"Check out this video"}</Text>

					<View style={styles.sharePanelButtonRow}>
						{socialButtons}
					</View>
				</View>
			);
		}

		return (
			<View style={styles.container}>
      			{sharePanel}
    		</View>
		)
	}
});

var styles = StyleSheet.create({
	container: {
    	flexDirection: 'column',
    	alignItems: 'center',
  	},

  	sharePanelNW: {
  		flexDirection: 'column',
    	backgroundColor: 'rgba(0,0,0,0.5)',
  	},

  	sharePanelTitle: {
  		textAlign: 'center',
	    fontSize: 18,
	    fontFamily: 'Arial-BoldMT',
	    color: 'white',
	    margin: 20
  	},

  	sharePanelButtonRow: {
  		flexDirection:'row',
  		alignItems: 'center',
  		alignSelf: 'center',
  		backgroundColor: 'transparent',
  		margin: 20
  	},

  	socialButton: {
  		width: 54,
  		height: 54,
  		alignItems: 'center',
    	backgroundColor: 'transparent',
    	margin: 10
  	}
});

module.exports = SharePanel;