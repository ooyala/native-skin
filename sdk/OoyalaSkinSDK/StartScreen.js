
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

var eventBridge = require('NativeModules').OOReactBridge;

var StartScreen = React.createClass({
  getInitialState: function() {
    DeviceEventEmitter.addListener(
      'currentItemInfo', 
      (currentItemInfo) => this.currentItemChanged(currentItemInfo)
    );

    DeviceEventEmitter.addListener(
      'startScreenConfig', 
      (startScreenConfig) => this.startScreenConfigLoaded(startScreenConfig)
    );

    return {title:"", promo_url:"", description:""};
  },

  handleClick: function() {
    eventBridge.onPress();
  },

  startScreenConfigLoaded: function(startScreenConfig) {
    console.log("startScreenConfig = " + startScreenConfig.mode);
    var mode = startScreenConfig.mode;
    var infoPanel = startScreenConfig.infoPanel;
    var logoPosition = startScreenConfig.logoPosition;
    this.setState({mode: mode, infoPanel: infoPanel, logoPosition: logoPosition});
  },

  currentItemChanged: function(currentItemInfo) {
    var promo_url = currentItemInfo.promo_url;
    var title = currentItemInfo.title;
    var description = currentItemInfo.description;
    var config = currentItemInfo.startScreen;
    this.setState({title:currentItemInfo.title, promo_url:currentItemInfo.promo_url, description:currentItemInfo.description});
    console.log("Updated current item information: promo_url = " + promo_url + ", title = " + title + ", description = " + description + "startScreen: =" + config);
  },

  render: function() {
    var playIcon = '\uf04b';
    var playButtonStyle = null;
    var mode = this.state.mode;
    if (this.state.mode == "default") {
      // promo image as background

      if (this.state.infoPanel.visable == false) {
        // No info panel 
        // => currently the play button will always be on the center of the screen when no
        // info panel shows up.
        var promoImageContainerStyle = styles.promoImageDefaultContainer;
        var promoImageStyle = styles.promoImage;

        var waterMarkImageContainerStyle = styles.waterMarkImageContainer;
        var waterMarkImageStyle = styles.waterMarkImage;

        var playButtonContainerStyle = styles.playButtonContainerCenter;
        var playButtonStyle = styles.playButton;

        return (  
            <View style={promoImageContainerStyle}>
              <Image style={promoImageStyle}
              source={{uri: this.state.promo_url}} 
              resizeMode={Image.resizeMode.stretch}>
                <View style={playButtonContainerStyle}>
                  <TouchableHighlight
                        onPress={this.handleClick}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <Text style={playButtonStyle}>{playIcon}</Text>
                    </TouchableHighlight>
                 </View>

                  <View style={[waterMarkImageContainerStyle, styles.waterMarkImageContainerSW]}>
                   <Image style={waterMarkImageStyle} 
                    source={{uri: 'http://www.palantir.net/presentations/dcamsterdam2014-decoupled-drupal-silex/assets/ooyala-logo.png'}} 
                    resizeMode={Image.resizeMode.contain}>
                    </Image>
               </View>
              </Image>
            </View>
          );
      } else { 
        // Has info panel
        var promoImageContainerStyle = styles.promoImageDefaultContainer;
        var promoImageStyle = styles.promoImage;

        var infoPanelContainerStyle = styles.infoPanelContainerNW;
        var infoPanelStyle = styles.infoPanel;

        var waterMarkImageContainerStyle = styles.waterMarkImageContainerSE;
        var waterMarkImageStyle = styles.waterMarkImage;

        var playButtonContainerStyle = styles.playButtonContainerSW;
        var playButtonStyle = styles.playButton;

        return (  
          <View style={promoImageContainerStyle}>
            <Image style={promoImageStyle}
            source={{uri: this.state.promo_url}} 
            resizeMode={Image.resizeMode.stretch}>
              <View style={infoPanelContainerStyle}>
                <Text style={infoPanelStyle}>{this.state.title}</Text> 
              </View>

              <View style={playButtonContainerStyle}>
                <TouchableHighlight
                      onPress={this.handleClick}
                      underlayColor="transparent"
                      activeOpacity={0.5}>
                      <Text style={playButtonStyle}>{playIcon}</Text>
                </TouchableHighlight>
              </View>

              <View style={waterMarkImageContainerStyle}>
                <Image style={waterMarkImageStyle} 
                  source={{uri: 'http://www.palantir.net/presentations/dcamsterdam2014-decoupled-drupal-silex/assets/ooyala-logo.png'}} 
                  resizeMode={Image.resizeMode.contain}>
                </Image>
             </View>
            </Image>
          </View>
        );
      }
     
    } else {
      // Small promo image
      var promoImageContainerStyle = styles.promoImageSmallContainer;
      var promoImageStyle = styles.promoImage;

      var infoPanelContainerStyle = styles.infoPanelContainerSW;
      var infoPanelStyle = styles.infoPanel;

      var waterMarkImageContainerStyle = styles.waterMarkImageContainerSE;
      var waterMarkImageStyle = styles.waterMarkImage;

      var playButtonContainerStyle = styles.playButtonContainerCenter;
      var playButtonStyle = styles.playButton;

      return (
          <View style={styles.background}>
             <View style={promoImageContainerStyle}>
              <Image style={promoImageStyle}
              source={{uri: this.state.promo_url}} 
              resizeMode={Image.resizeMode.stretch}>
              </Image>
            </View>

            <View style={infoPanelContainerStyle}>
              <Text style={infoPanelStyle}>{this.state.title}</Text> 
            </View>

            <View style={playButtonContainerStyle}>
              <TouchableHighlight
                    onPress={this.handleClick}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <Text style={playButtonStyle}>{playIcon}</Text>
              </TouchableHighlight>
            </View>
            
            <View style={waterMarkImageContainerStyle}>
                 <Image style={waterMarkImageStyle} 
                  source={{uri: 'http://www.palantir.net/presentations/dcamsterdam2014-decoupled-drupal-silex/assets/ooyala-logo.png'}} 
                  resizeMode={Image.resizeMode.contain}>
                  </Image>
             </View>
          </View>
         
        );
    }
    
  }
});

var styles = StyleSheet.create({

  background: {
    flex: 1
  },

  promoImageDefaultContainer: {
    flex: 1
  },

  promoImageSmallContainer: {
    position: 'absolute',
    width: 180,
    height: 90,
    bottom: 50
  },

  promoImage: {
    flex: 1
  },


  infoPanelContainerNW: {
    position: 'absolute',    
    top: 0,
    left: 0
  },

  infoPanelContainerSW: {
    position: 'absolute',    
    bottom: 0,
    left: 0
  },

  infoPanel: {
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'transparent',
    color: 'white',
    margin: 10
  },

  playButtonContainerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center'
  },

  playButtonContainerSE: {
    position: 'absolute',    
    bottom: 0,
    right: 0
  },

  playButtonContainerSW: {
    position: 'absolute',    
    bottom: 0,
    left: 0
  },

  playButton: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'fontawesome',
    margin: 10
  },

  waterMarkImageContainerSW: {
    position: 'absolute',
    bottom: 0,
    left: 0
  },

  waterMarkImageContainerSE: {
    position: 'absolute',
    bottom: 0,
    right: 0
  },

  waterMarkImage: {
    width:100,
    height: 16,
    backgroundColor: 'transparent',
    margin: 10
  }
});

module.exports = StartScreen;