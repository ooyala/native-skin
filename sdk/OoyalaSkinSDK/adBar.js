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

  render: function() {
    var adTitle = this.props.ad.title ? this.props.ad.title : "";
    var count = this.props.ad.count ? this.props.ad.count : 1;
    var unplayed = this.props.ad.unplayedCount ? this.props.ad.unplayedCount : 0;
    var showLearnMore = this.props.ad.clickUrl && this.props.ad.clickUrl.length > 0;

    var remainingString = 
      Utils.secondsToString(this.props.duration - this.props.playhead);
    
    var prefixString = 
      this.props.ad.title && this.props.ad.title.length > 0 ? UI_TEXT.AD_PLAYING + ":" : UI_TEXT.AD_PLAYING;

    var countString = "(" + (count - unplayed) + "/" + count + ")";
    var learnMoreButtonWidthStyle = {width: this.props.width * 0.25};
    var allowedTextLength = showLearnMore ? this.props.width * 0.5 : this.props.width * 0.8;
    var textString;

    console.log("width"+this.props.width+"allowed"+allowedTextLength+"count"+this.props.ad.countWidth+"title"+this.props.ad.titleWidth+"prefix"+this.props.ad.prefixWidth);
    if (this.props.ad.countWidth <= allowedTextLength) {
      textString = countString;
      allowedTextLength -= this.props.ad.countWidth;
      if (this.props.ad.titleWidth <= allowedTextLength) {
        textString = this.props.ad.title + textString;
        allowedTextLength -= this.props.ad.titleWidth;
        if (this.props.ad.prefixWidth <= allowedTextLength) {
          textString = prefixString + textString;
        } 
      }
    } 

    var labelString = textString ? textString + " | " + remainingString : remainingString;

    var learnMoreButton;
    if (showLearnMore) {
      learnMoreButton = (
        <TouchableHighlight 
          onPress={this.onLearnMore}>
          <View style={[styles.button, learnMoreButtonWidthStyle]}>
            <Text style={styles.buttonText}>{UI_TEXT.LEARNMORE}</Text>
          </View>
        </TouchableHighlight>);
    }
    return (
      <View style={styles.container}>
          <Text allowFontScaling={true} style={styles.label}>{labelString}</Text>
          <View style={styles.placeholder} />
          {learnMoreButton}
      </View>
      );
  }
});

module.exports = AdBar;
