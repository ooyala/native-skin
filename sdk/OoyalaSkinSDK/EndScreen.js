var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/endScreenStyles.json'));
var ProgressBar = require('./progressBar');
var ControlBar = require('./controlBar');
var WaterMark = require('./waterMark');
var InfoPanel = require('./infoPanel');
var SharePanel = require('./sharePanel');

var Constants = require('./constants');

var {
  BUTTON_NAMES,
  IMG_URLS,
} = Constants;

var EndScreen = React.createClass({
	getInitialState: function() {
    return {
      showControls:true, 
      showSharePanel:false,
    };
  },

  propTypes: {
   config: React.PropTypes.object,
   title: React.PropTypes.string,
   duration: React.PropTypes.number,
   description: React.PropTypes.string,
   promoUrl: React.PropTypes.string,
   onPress: React.PropTypes.func,
   onSocialButtonPress: React.PropTypes.func,
   width: React.PropTypes.number,
   height: React.PropTypes.number,
   discoveryPanel: React.PropTypes.object
 },

handleClick: function(name) {
  if(name === "SocialShare"){
    this.setState({showSharePanel:!this.state.showSharePanel});
  } else {
    this.props.onPress(name);
  } 
},

onSocialButtonPress: function(socialType){
  this.props.onSocialButtonPress(socialType);
},

handleTouchEnd: function(event) {
  this.toggleControlBar();
},

render: function() {
 var fullscreenPromoImage = (this.props.config.endScreen.mode == 'default');
 var replaybuttonLocation = styles.replaybuttonCenter;
 var socialButtonsArray = [{buttonName: BUTTON_NAMES.TWITTER, imgUrl: IMG_URLS.TWITTER},
                           {buttonName: BUTTON_NAMES.FACEBOOK, imgUrl: IMG_URLS.FACEBOOK}];
                           // {buttonName: BUTTON_NAMES.GOOGLEPLUS, imgUrl: IMG_URLS.GOOGLEPLUS},
                           // {buttonName: BUTTON_NAMES.EMAIL, imgUrl: IMG_URLS.EMAIL}];

  var replaybutton;
  if(this.props.config.endScreen.showReplayButton) {
    var fontFamilyStyle = {fontFamily: this.props.config.icons.replay.fontFamilyName};
    replaybutton = (
      <TouchableHighlight
      onPress={(name) => this.handleClick('PlayPause')}
      underlayColor="transparent"
      activeOpacity={0.5}>
      <Text style={[styles.replaybutton, fontFamilyStyle]}>{this.props.config.icons.replay.fontString}</Text>
      </TouchableHighlight>
    );
  }

  var title = this.props.config.endScreen.showTitle ? this.props.title : null;
  var description = this.props.config.endScreen.showDescription ? this.props.description : null;

  var infoPanel;
  infoPanel = (<InfoPanel title={title} description={description} />);

 var sharePanel;
 sharePanel = (<SharePanel 
  ref='sharePanel' 
  isShow= {this.state.showSharePanel}
  socialButtons={socialButtonsArray}
  onSocialButtonPress={(socialType) => this.onSocialButtonPress(socialType)} />);

 var progressBar;
 progressBar = (<ProgressBar 
  ref='progressBar' 
  playhead={this.props.duration} 
  duration={this.props.duration} 
  isShow={this.state.showControls} />);

 var controlBar;
 controlBar = (<ControlBar 
  ref='controlBar'
  primaryButton="replay"
  height={this.props.height}
  width={this.props.width}
  isShow='true'
  playhead={this.props.duration}
  duration={this.props.duration}
  onPress={(name) => this.handleClick(name)}
   config={{
     controlBar: this.props.config.controlBar,
     buttons: this.props.config.buttons,
     icons: this.props.config.icons
   }}/>);

 var waterMark = (<WaterMark />);

  switch(this.props.config.endScreen.screenToShowOnEnd) {
    case 'discovery':
      return (
        <View style={styles.fullscreenContainer}>
          {this.props.discoveryPanel}
          {progressBar}
          {controlBar}
        </View>
      );
    default:
      return (

        <Image
          source={{uri: this.props.promoUrl}}
          style={styles.fullscreenContainer}
          resizeMode={Image.resizeMode.contain}
        >
          <View
            style={styles.fullscreenContainer}>
            {infoPanel}
            {sharePanel}
            <View style={replaybuttonLocation}>
              {replaybutton}
            </View>
            {waterMark}
          </View>
         {progressBar}
         {controlBar}
        </Image>

      );
  }


}
});

module.exports = EndScreen;