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

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/adBarStyles.json'));
var Constants = require('./constants');
var {
  BUTTON_NAMES,
  UI_TEXT
} = Constants;

var Utils = require('./utils');

var AdBar = React.createClass({
  propTypes: {
    ad: React.PropTypes.object,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    onPress: React.PropTypes.func,
    width: React.PropTypes.number
  },

  onLearnMore: function() { 
    this.props.onPress(BUTTON_NAMES.LEARNMORE);
  }, 

  generateResponsiveText: function(showLearnMore) {
    var textString;
    var adTitle = this.props.ad.title ? this.props.ad.title + " ": " ";
    var count = this.props.ad.count ? this.props.ad.count : 1;
    var unplayed = this.props.ad.unplayedCount ? this.props.ad.unplayedCount : 0;

    var remainingString = 
      Utils.secondsToString(this.props.duration - this.props.playhead);
    
    var prefixString = 
      this.props.ad.title && this.props.ad.title.length > 0 ? UI_TEXT.AD_PLAYING + ":" : UI_TEXT.AD_PLAYING;

    var countString = "(" + (count - unplayed) + "/" + count + ")";
    
    var allowedTextLength = this.props.width - 32;
    if (showLearnMore) {
      allowedTextLength -= this.props.ad.measures.learnmore + 32;
    }

    console.log("width"+this.props.width + "allowed"+allowedTextLength+ "learnmore"+this.props.ad.measures.learnmore);
    console.log("duration"+ this.props.ad.measures.duration+
      "count"+this.props.ad.measures.count+"title"+this.props.ad.measures.title+"prefix"+this.props.ad.measures.prefix);
    if (this.props.ad.measures.duration <= allowedTextLength) {
      textString = remainingString;
      allowedTextLength -= this.props.ad.measures.duration;
      console.log("allowedAfterDuration"+allowedTextLength);
      if (this.props.ad.measures.count <= allowedTextLength) {
        textString = countString + textString;
        allowedTextLength -= this.props.ad.measures.count;
        console.log("allowedAfterCount"+allowedTextLength);
        if (this.props.ad.measures.title <= allowedTextLength) {
          textString = this.props.ad.title + textString;
          allowedTextLength -= this.props.ad.measures.title;
          console.log("allowedAfterTitle"+allowedTextLength);
          if (this.props.ad.measures.prefix <= allowedTextLength) {
            textString = prefixString + textString;
          }
        }
      }
    } 

    return textString;
  },

  render: function() {
    var learnMoreButton;
    var showLearnMore = this.props.ad.clickUrl && this.props.ad.clickUrl.length > 0;
    var textString = this.generateResponsiveText(showLearnMore);

    if (showLearnMore) {
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
          <Text allowFontScaling={true} style={styles.label}>{textString}</Text>
          <View style={styles.placeholder} />
          {learnMoreButton}
      </View>
      );
  }
});

module.exports = AdBar;
