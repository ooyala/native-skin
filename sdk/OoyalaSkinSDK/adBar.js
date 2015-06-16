/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} = React;

var Constants = require('./constants');
var {
  BUTTON_NAMES,
  UI_TEXT
} = Constants;

var Utils = require('./utils');

var AdBar = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    count: React.PropTypes.number,
    index: React.PropTypes.number,
    onPress: React.PropTypes.func,
    showLearnMore: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {playhead: 0, duration: 0, title:'', count: 1, index: 0};
  },

  onLearnMore: function() { 
    this.props.onPress(BUTTON_NAMES.LEARNMORE);
  }, 

  render: function() {
    var remainingString = 
      Utils.secondsToString(this.props.duration - this.props.playhead);
    
    var titleString = 
      this.props.title.length > 0 ? UI_TEXT.AD_PLAYING + ": " + this.props.title : UI_TEXT.AD_PLAYING;

    var countString = "(" + this.props.index + "/" + this.props.count + ")";

    var learnMoreButton;
    if (this.props.showLearnMore) {
      learnMoreButton = (
        <TouchableHighlight 
          onPress={this.onLearnMore}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{UI_TEXT.LEARNMORE}</Text>
          </View>
        </TouchableHighlight>);
    }
    return (
      <View style={styles.container}>
          <Text style={styles.label}>{titleString + countString + ' | ' + remainingString}</Text>
          <View style={styles.placeholder} />
          {learnMoreButton}
      </View>
      );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  label: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    margin: 10,
    padding: 6,
    fontFamily: 'AvenirNext-DemiBold',
  },
  placeholder: {
    flex: 1,
  },
  button: {
    backgroundColor: '#F9F4F6',
    padding: 6,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#030303',
    fontSize: 16,
    fontFamily: 'AvenirNext-DemiBold',
  },
});

module.exports = AdBar;
