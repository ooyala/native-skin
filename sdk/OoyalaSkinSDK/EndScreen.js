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

var ICONS = require('./constants').ICONS;

var EndScreen = React.createClass({
	getInitialState: function() {
    	return {showControls:true};
  	},

	propTypes: {
	    config: React.PropTypes.object,
	    title: React.PropTypes.string,
	    description: React.PropTypes.string,
	    promoUrl: React.PropTypes.string,
	    onPress: React.PropTypes.func,
	},

	handlePress: function(name) {
    	this.props.onPress(name);
  	},

  	toggleControlBar: function() {
	    console.log("toggleControlBar pressed")
	    var showControls = !this.state.showControls;
	    this.setState({showControls:showControls});
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
	      infoPanel = (
	        <View style={styles.infoPanelNW}>
	          <Text style={styles.infoPanelTitle}>{this.props.title}</Text>
	          <Text style={styles.infoPanelDescription}>{this.props.description}</Text>
	        </View>
	      );
	    }

	    var progressBar;
    	var controlBar;
    	if (this.state.showControls) {
    		progressBar = (<ProgressBar playhead={this.props.duration} duration={this.props.duration} />);
      		controlBar = (
        		<ControlBar showPlay={this.props.showPlay} isPlayEnd={true} playhead={this.props.playhead} duration={this.props.duration} onPress={(name) => this.handlePress(name)} />
        	);
        }

        var waterMark = (<WaterMark />);

	    
	    if (fullscreenPromoImage) {   
	      return (
	        <Image 
	          source={{uri: this.props.promoUrl}}
	          style={styles.fullscreenContainer}
	          resizeMode={Image.resizeMode.contain}>
	          <View style={styles.placeholder}>
          		<TouchableHighlight style={styles.placeholder} onPress={this.toggleControlBar}>
              	  <View />
          		</TouchableHighlight>
        	  </View>
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

  infoPanelNW: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },

  infoPanelSW: {
    position: 'absolute',    
    bottom: 0,
    left: 0
  },

  infoPanelTitle: {
    textAlign: 'left',
    fontSize: 20,
    fontFamily: 'Arial-BoldMT',
    color: 'white',
    marginTop: 20,
    marginLeft: 10
  },

  infoPanelDescription: {
    textAlign: 'left',
    fontSize: 16,
    fontFamily: 'ArialMT',
    color: 'white',
    margin: 10
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
