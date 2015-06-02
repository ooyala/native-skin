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
		var buttonNames = [];
		var imgUrls = [];

		var sharePanel;
		var twitterBtn;
		var facebookBtn;
		var googlePlusBtn;
		var emailBtn;

		// handle socialButtons array
		for (var i = 0; i < this.props.socialButtons.length; i++){
			console.log("social buttons are", this.props.socialButtons[i]);
			buttonNames.push(this.props.socialButtons[i].buttonName);
			imgUrls.push(this.props.socialButtons[i].imgUrl);
		}

		if(buttonNames.indexOf("Twitter") != -1){
			twitterBtn = (
				<TouchableHighlight
					onPress={(serviceType) => this.onSocialButtonPress("Twitter")}
	   				underlayColor="transparent"
	   				activeOpacity={0.5}>

	   				<Image style={styles.socialButton}
				       	source={{uri: imgUrls[buttonNames.indexOf("Twitter")]}}
				       	resizeMode={Image.resizeMode.contain}>
				   	</Image>

	   			</TouchableHighlight>
			);
		}

		if(buttonNames.indexOf("Facebook") != -1){
			facebookBtn = (
				<TouchableHighlight
					onPress={(serviceType) => this.onSocialButtonPress("Facebook")}
	   				underlayColor="transparent"
	   				activeOpacity={0.5}>

	   				<Image style={styles.socialButton}
				       	source={{uri: imgUrls[buttonNames.indexOf("Facebook")]}}
				       	resizeMode={Image.resizeMode.contain}>
				   	</Image>

	   			</TouchableHighlight>
			);
		}

		if(buttonNames.indexOf("GooglePlus") != -1){
			googlePlusBtn = (
				<TouchableHighlight
					onPress={(serviceType) => this.onSocialButtonPress("GooglePlus")}
	   				underlayColor="transparent"
	   				activeOpacity={0.5}>

					<Image style={styles.socialButton}
				       	source={{uri: imgUrls[buttonNames.indexOf("GooglePlus")]}}
				       	resizeMode={Image.resizeMode.contain}>
					</Image>
				   	
	   			</TouchableHighlight>
			);
		}

		if(buttonNames.indexOf("Email") != -1){
			emailBtn = (
				<TouchableHighlight
					onPress={(serviceType) => this.onSocialButtonPress("Email")}
	   				underlayColor="transparent"
	   				activeOpacity={0.5}>

					<Image style={styles.socialButton}
				        source={{uri: imgUrls[buttonNames.indexOf("Email")]}}
				        resizeMode={Image.resizeMode.contain}>
				    </Image>
				   	
	   			</TouchableHighlight>
			);
		}

		if(this.props.isShow){
				sharePanel = (
					<View style={styles.sharePanelNW}>
						<Text style={styles.sharePanelTitle}>{"Share this video"}</Text>

						<View style={styles.sharePanelButtonRow}>
								{twitterBtn}
								{facebookBtn}
								{googlePlusBtn}
								{emailBtn}
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