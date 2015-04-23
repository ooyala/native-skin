
var React = require('react-native');

var {
  ActivityIndicatorIOS,
  AppRegistry,
  DeviceEventEmitter,
  SliderIOS,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var StartScreen = React.createClass({
  getInitialState: function() {
    var subscription = DeviceEventEmitter.addListener(
      'currentItemInfo', 
      (currentItemInfo) => this.currentItemChanged(currentItemInfo)
    );
    return {title:"", promo_url:"", description:""};
  },

  handleClick: function() {
    eventBridge.onPress();
  },

  currentItemChanged: function(currentItemInfo) {
    var promo_url = currentItemInfo.promo_url;
    var title = currentItemInfo.title;
    var description = currentItemInfo.description;
    this.setState({title:currentItemInfo.title, promo_url:currentItemInfo.promo_url, description:currentItemInfo.description});
    console.log("Updated current item information: promo_url = " + promo_url + ", title = " + title + ", description = " + description);
  },

  render: function() {
    var playIcon = '\uf04b';
    return (  
      <View style={styles.promoImageContainer}>
        <Image style={styles.promoImage} 
        source={{uri: this.state.promo_url}} 
        resizeMode={Image.resizeMode.stretch}>
          <View style={styles.startScreenTextContainer}>
            <Text style={styles.startScreentitle}>{this.state.title}</Text> 
            <Text style={styles.startScreentitle}>description goes here</Text> 
            <TouchableHighlight
                  onPress={this.handleClick}
                  underlayColor="transparent"
                  activeOpacity={0.5}>
                  <Text style={styles.startScreenPlayButton}>{playIcon}</Text>
              </TouchableHighlight>
           </View>

            <View style={styles.logoImageContainer}>
             <Image style={styles.logoImage} 
              source={{uri: 'http://www.palantir.net/presentations/dcamsterdam2014-decoupled-drupal-silex/assets/ooyala-logo.png'}} 
              resizeMode={Image.resizeMode.contain}>
              </Image>
         </View>
        </Image>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  startScreenTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  startScreentitle: {
    padding: 0,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'transparent',
    color: 'white'
  },

  startScreenPlayButton: {
    fontSize: 80,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'fontawesome',

  },
  promoImageContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  promoImage: {
    flex: 1
  },
  logoImageContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  logoImage: {
    width:200,
    height: 32,
    backgroundColor: 'transparent'
  }
});

module.exports = StartScreen;