var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var ProgressBar = require('./progressBar');
var ControlBar = require('./controlBar');
var WaterMark = require('./waterMark');
var InfoPanel = require('./infoPanel');

var AnimationExperimental = require('AnimationExperimental');

var ICONS = require('./constants').ICONS;

var EndScreen = React.createClass({
	getInitialState: function() {
    return {showControls:true};
  },

  propTypes: {
   config: React.PropTypes.object,
   title: React.PropTypes.string,
   duration: React.PropTypes.number,
   description: React.PropTypes.string,
   promoUrl: React.PropTypes.string,
   onPress: React.PropTypes.func,
  },

 toggleControlBar: function() {
  for (var ref in this.refs) {
    console.log("ref is",ref);
    AnimationExperimental.startAnimation({
      node: this.refs[ref],
      duration: 500,
      property: 'opacity',
      easing: 'easingInOutExpo',
      toValue: this.state.showControls ? 0 : 1,
    });
  }
  this.setState({showControls:!this.state.showControls});
},

handleClick: function() {
  this.props.onPress('PlayPause');
},

handleTouchEnd: function(event) {
  this.toggleControlBar();
},

render: function() {
 var fullscreenPromoImage = (this.props.config.mode == 'default');
 var replaybuttonLocation = styles.replaybuttonCenter;
 var replaybutton = (
   <TouchableHighlight
    onPress={this.handleClick}
    underlayColor="transparent"
    activeOpacity={0.5}>
    <Text style={styles.replaybutton}>{ICONS.REPLAY}</Text>
   </TouchableHighlight>
   );

 var infoPanel;
 if (this.props.config.infoPanel) {
   infoPanel = (<InfoPanel title={this.props.title} description={this.props.description} />);
 }

 var progressBar;
 var controlBar;
 progressBar = (<ProgressBar ref='progressBar' 
  playhead={this.props.duration} 
  duration={this.props.duration}  />);

 controlBar = (<ControlBar 
  ref='controlBar' 
  showPlay={this.props.showPlay} 
  playhead={this.props.duration} 
  duration={this.props.duration} 
  primaryActionButton={ICONS.REPLAY}
  onPress={(name) => this.handleClick(name)} />);

 var waterMark = (<WaterMark />);

 if (fullscreenPromoImage) {   
   return (
     <Image 
     source={{uri: this.props.promoUrl}}
     style={styles.fullscreenContainer}
     resizeMode={Image.resizeMode.contain}
     onTouchEnd={(event) => this.handleTouchEnd(event)}>
     {infoPanel}

     <View style={replaybuttonLocation}>
     {replaybutton}
     </View>

     {waterMark}
     {progressBar}
     {controlBar}
     </Image>

     );
 } else {
   var promoImage = (
     <Image 
     source={{uri: this.props.promoUrl}}
     style={styles.promoImageSmall}
     resizeMode={Image.resizeMode.contain}>
     </Image>
     );

   return (
     <View style={styles.container}>
     <View style={replaybuttonLocation}>
     {replaybutton}
     </View>
     {promoImage}
     {infoPanel}
     </View>
     );
 }
}
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },

  fullscreenContainer: {
  	flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },

  promoImageSmall: {
    width: 180,
    height: 90,
    margin: 20,
  },

  replaybuttonCenter: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  replaybuttonSE: {
    position: 'absolute',    
    bottom: 0,
    right: 0
  },

  replaybuttonSW: {
    position: 'absolute',    
    bottom: 0,
    left: 0
  },

  replaybutton: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'fontawesome',
    margin: 10
  },
});

module.exports = EndScreen;