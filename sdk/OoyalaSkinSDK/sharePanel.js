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
		onPress: React.PropTypes.func,
	},

	onTwitterPress: function(){
		this.props.onPress('TwitterShare');
	},

	onFacebookPress: function(){
		this.props.onPress('FacebookShare');
	},

	onGooglePlusPress: function(){
		this.props.onPress('GooglePlusShare');
	},

	onEmailPress: function(){
		this.props.onPress('EmailShare');
	},

	render: function() {
		var sharePanel;

		var twitterBtn = (
			<TouchableHighlight
				onPress={this.onTwitterPress}
   				underlayColor="transparent"
   				activeOpacity={0.5}>

   				<Image style={styles.socialButton}
			       	source={{uri: 'https://g.twimg.com/ios_homescreen_icon.png'}}
			       	resizeMode={Image.resizeMode.contain}>
			   	</Image>

   			</TouchableHighlight>
		);

		var facebookBtn = (
			<TouchableHighlight
				onPress={this.onFacebookPress}
   				underlayColor="transparent"
   				activeOpacity={0.5}>

   				<Image style={styles.socialButton}
			       	source={{uri: 'http://static1.squarespace.com/static/54823afbe4b023af78555735/549860e4e4b03ff49a6f3da6/549860e5e4b01fe317edf760/1419276283280/facebook+logo+png+transparent+background.png'}}
			       	resizeMode={Image.resizeMode.contain}>
			   	</Image>

   			</TouchableHighlight>
		);

		var googlePlusBtn = (
			<TouchableHighlight
				onPress={this.onGooglePlusPress}
   				underlayColor="transparent"
   				activeOpacity={0.5}>

				<Image style={styles.socialButton}
			       	source={{uri: 'https://lh3.ggpht.com/1Ug9gpwI16ARkDni8VYezbIaETcukEtwrnzRyzqWKV2u15SGpZGSmHQDVX0uPlzmgg=w300'}}
			       	resizeMode={Image.resizeMode.contain}>
				</Image>
			   	
   			</TouchableHighlight>
		);

		var emailBtn = (
			<TouchableHighlight
				onPress={this.onEmailPress}
   				underlayColor="transparent"
   				activeOpacity={0.5}>

				<Image style={styles.socialButton}
			        source={{uri: 'http://www.themissionsuite.com/wp-content/uploads/2014/06/large.png'}}
			        resizeMode={Image.resizeMode.contain}>
			    </Image>
			   	
   			</TouchableHighlight>
		);

		if(this.props.isShow){
			sharePanel = (
				<View style={styles.sharePanelNW}>
					<Text style={styles.sharePanelTitle}>{"Invest In Social Change"}</Text>

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