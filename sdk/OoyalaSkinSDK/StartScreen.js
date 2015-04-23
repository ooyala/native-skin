
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
           </View>
           <View style={styles.startScreenPlayButtonContainer}>
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
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'green'
  },
  startScreentitle: {
    padding: 0,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'transparent',
    color: 'white'
  },
  startScreenPlayButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'black'
  },

  startScreenPlayButton: {
    fontSize: 80,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'fontawesome',

  },
  promoImageContainer: {
    flex: 1,
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: 'white'
  },
  promoImage: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'yellow',
  },
  logoImageContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderColor: 'red'
  },
  logoImage: {
    width:200,
    height: 32,
    backgroundColor: 'transparent'
  }
});