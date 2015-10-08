var React = require('react-native');
var {
	Animated,
	StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableHighlight,
  AlertIOS,
} = React;

var Utils = require('./utils');

var ResponsiveList = require('./widgets/ResponsiveList');
var styles = Utils.getStyles(require('./style/sharePanelStyles.json'));
var animationDuration = 1000;

var SharePanel = React.createClass ({
	propTypes: {
		socialButtons: React.PropTypes.array,
		onSocialButtonPress: React.PropTypes.func,
		width: React.PropTypes.number,
    height: React.PropTypes.number,
    alertTitle: React.PropTypes.string,
    alertMessage: React.PropTypes.string
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

		var postShareSuccessAlert;

		if(this.props.alertTitle != ""){
			postShareSuccessAlert = AlertIOS.alert(
				this.props.alertTitle,
  			this.props.alertMessage,
  			[
    			{text: 'Ok', onPress: () => console.log('Ok Pressed!')},
  			]
			);
		}
		
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
		// screen height - title
		var itemPanelHeight = this.props.height  - 30;
		return (
		<Animated.View style={[styles.container, animationStyle]}>
			<View style={styles.sharePanelTitleRow}>
				<Text style={styles.sharePanelTitle}>{"Social"}</Text>
			</View>
			{postShareSuccessAlert}
			<ResponsiveList
          horizontal={false}
          data={socialButtons}
          itemRender={this.renderItem}
          width={this.props.width}
          height={itemPanelHeight}
          itemWidth={90}
          itemHeight={54}>
      </ResponsiveList>
		</Animated.View>);
	},

	renderItem: function(item: object, itemId: number) {
		return (
      <TouchableHighlight 
        style={styles.item}
        onPress={() => this.onSocialButtonPress(item)}>
        <View style = {styles.socialButton}>
        	{item}
        </View>
      </TouchableHighlight>
    );
	},
});

module.exports = SharePanel;