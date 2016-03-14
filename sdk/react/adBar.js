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

var Log = require('./log');
var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/adBarStyles.json'));
var Constants = require('./constants');
var {
  BUTTON_NAMES
} = Constants;

var Utils = require('./utils');

var AdBar = React.createClass({
  propTypes: {
    ad: React.PropTypes.object,
    playhead: React.PropTypes.number,
    duration: React.PropTypes.number,
    onPress: React.PropTypes.func,
    width: React.PropTypes.number,
    localizableStrings: React.PropTypes.object,
    locale: React.PropTypes.string
  },

  onLearnMore: function() { 
    this.props.onPress(BUTTON_NAMES.LEARNMORE);
  }, 

  onSkip: function() {
    this.props.onPress(BUTTON_NAMES.SKIP);
  },

  generateResponsiveText: function(showLearnMore,showSkip) {
    var textString;
    var adTitle = this.props.ad.title ? this.props.ad.title + " ": " ";
    var count = this.props.ad.count ? this.props.ad.count : 1;
    var unplayed = this.props.ad.unplayedCount ? this.props.ad.unplayedCount : 0;

    var remainingString = 
      Utils.secondsToString(this.props.duration - this.props.playhead);

    var prefixString = Utils.localizedString(this.props.locale, "Ad Playing", this.props.localizableStrings);
    if (this.props.ad.title && this.props.ad.title.length > 0) {
      prefixString = prefixString + ":";
    }

    var countString = "(" + (count - unplayed) + "/" + count + ")";
    
    var allowedTextLength = this.props.width - 32;
    if (showLearnMore) {
      allowedTextLength -= this.props.ad.measures.learnmore + 32;
    }

    Log.verbose("width: "+this.props.width + ". allowed: "+allowedTextLength+ ". learnmore: "+this.props.ad.measures.learnmore);
    Log.verbose(". duration: "+ this.props.ad.measures.duration+
      ". count: "+this.props.ad.measures.count+". title: "+this.props.ad.measures.title+". prefix: "+this.props.ad.measures.prefix);
    if (this.props.ad.skipoffset >= 0) {
      if(showSkip) {
        allowedTextLength -= this.props.ad.measures.skipad + 32;  
      } 
      else {
        allowedTextLength -= this.props.ad.measures.skipadintime + 32;  
      }
    }
      
    if (this.props.ad.measures.duration <= allowedTextLength) {
      textString = remainingString;
      allowedTextLength -= this.props.ad.measures.duration;
      Log.verbose("allowedAfterDuration: "+allowedTextLength);
      if (this.props.ad.measures.count <= allowedTextLength) {
        textString = countString + textString;
        allowedTextLength -= this.props.ad.measures.count;
        Log.verbose("allowedAfterCount: "+allowedTextLength);
        if (this.props.ad.measures.title <= allowedTextLength) {
          textString = this.props.ad.title + textString;
          allowedTextLength -= this.props.ad.measures.title;
          Log.verbose("allowedAfterTitle: "+allowedTextLength);
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
    var showSkip = this.props.playhead >= this.props.ad.skipoffset;
    var textString = this.generateResponsiveText(showLearnMore, showSkip);
    var learnMoreText = Utils.localizedString(this.props.locale, "Learn more", this.props.localizableStrings);

    var skipButton;
    var skipLabel;
    var skipLabelText = Utils.localizedString(this.props.locale, "Skip Ad in ", this.props.localizableStrings);
    var skipText = Utils.localizedString(this.props.locale, "Skip Ad", this.props.localizableStrings);

    if (showLearnMore) {
      learnMoreButton = (
        <TouchableHighlight 
          onPress={this.onLearnMore}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{learnMoreText}</Text>
          </View>
        </TouchableHighlight>);
    }
    
    if (this.props.ad.skipoffset >= 0) {
      if (showSkip) {
        skipButton = (
          <TouchableHighlight 
            onPress={this.onSkip}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>{skipText}</Text>
            </View>
          </TouchableHighlight>);
      } else{
        skipLabel = (
          <Text allowFontScaling={true} style={styles.label}>
          {skipLabelText + Utils.getTimerLabel(this.props.ad.skipoffset - this.props.playhead)}
          </Text>
        );
      }
    }

    return (
      <View style={styles.container}>
          <Text allowFontScaling={true} style={styles.label}>{textString}</Text>
          <View style={styles.placeholder} />
          {learnMoreButton}
          {skipLabel}
          {skipButton}
      </View>
      );
  }
});

module.exports = AdBar;
