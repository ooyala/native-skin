/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react';
import {
  Animated,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

var animationDuration = 1000;
var Constants = require('../constants');
var {
  BUTTON_NAMES
} = Constants;

var Utils = require('../utils');
var styles = require('../utils').getStyles(require('./style/AudioAndCCSelectionPanel'));
var ItemSelectionScrollView = require('./ItemSelectionScrollView');

var AudioAndCCSelectionPanel = React.createClass({
  propTypes: {
    audioTracksTitles: React.PropTypes.array,
    selectedAudioTrackTitle: React.PropTypes.string,
    closedCaptionsLanguages: React.PropTypes.array,
    selectedClosedCaptionsLanguage: React.PropTypes.string,
    onSelectAudioTrack: React.PropTypes.func,
    onSelectClosedCaptions: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    config: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      opacity: new Animated.Value(0)
    };
  },

  componentDidMount:function () {
    this.state.opacity.setValue(0);
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: animationDuration,
          delay: 0
        }),
    ]).start();
  },

  onAudioTrackSelected: function(name) {
    if (this.props.selectedAudioTrackTitle !== name) {
      this.props.onSelectAudioTrack(name);
    }
  },

  onClosedCaptionsLanguageSelected: function(name) {
    var offButtonLocalizedTitle = Utils.localizedString(this.props.config.locale, "Off", this.props.config.localizableStrings);

    if (name === offButtonLocalizedTitle) {
      this.props.onSelectClosedCaptions("");
    } else if (this.props.selectedClosedCaptionsLanguage !== name) {
      this.props.onSelectClosedCaptions(name);
    }
  },

  onDismissPress: function() {
    this.props.onDismiss();
  },

  renderHeaderView: function(hasMultiAudioTracks, hasClosedCaptions) {
    var leftTitle;
    var rightTitle;

    var localizedAudioTitle = Utils.localizedString(this.props.config.locale, "Audio", this.props.config.localizableStrings);
    var localizedSubtitlesTitle = Utils.localizedString(this.props.config.locale, "Subtitles", this.props.config.localizableStrings);

    if (hasMultiAudioTracks && hasClosedCaptions) {
       leftTitle = localizedAudioTitle;
       rightTitle = localizedSubtitlesTitle;
    } else if (hasMultiAudioTracks) {
      leftTitle = localizedAudioTitle;
      rightTitle = "";
    } else {
      leftTitle = localizedSubtitlesTitle;
      rightTitle = "";
    }
    
    return (
      <View style={styles.panelHeaderView}>
        <View style={styles.panelHeaderViewLeftView}>
          <Text style={[styles.panelHeaderViewLeftText]}>{leftTitle}</Text>
        </View>
        <View style={styles.panelHeaderViewRightView}>
          <Text style={[styles.panelHeaderViewRightText]}>{rightTitle}</Text>
          <TouchableHighlight style={styles.dismissButton}
            accessible={true}
            accessibilityLabel={BUTTON_NAMES.DISMISS} 
            accessibilityComponentType="button"
            underlayColor="transparent" // Can't move this property to json style file because it doesn't works
            onPress={this.onDismissPress}>
            <Text style={styles.dismissIcon}>
              {this.props.config.icons.dismiss.fontString}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },

  renderAudioSelectionScrollView: function() {
    return (
      <ItemSelectionScrollView 
        style={styles.panelItemSelectionView}
        items={this.props.audioTracksTitles}
        selectedItem={this.props.selectedAudioTrackTitle}
        onSelect={(item) => this.onAudioTrackSelected(item)}
        config={this.props.config}>
      </ItemSelectionScrollView>
    );
  },

  renderCCSelectionScrollView: function() {
    var selectedClosedCaptionsLanguage = this.props.selectedClosedCaptionsLanguage;
    var offButtonTitle = Utils.localizedString(this.props.config.locale, "Off", this.props.config.localizableStrings);

    if (!this.props.closedCaptionsLanguages || this.props.closedCaptionsLanguages[0] !== offButtonTitle) {
      this.props.closedCaptionsLanguages.splice(0, 0, offButtonTitle)
    }

    if (!selectedClosedCaptionsLanguage || selectedClosedCaptionsLanguage === offButtonTitle || selectedClosedCaptionsLanguage === "") {
      selectedClosedCaptionsLanguage = offButtonTitle;
    }

    return (
      <ItemSelectionScrollView
        style={styles.panelItemSelectionView}
        items={this.props.closedCaptionsLanguages}
        selectedItem={selectedClosedCaptionsLanguage}
        onSelect={(item) => this.onClosedCaptionsLanguageSelected(item)}
        config={this.props.config}>
      </ItemSelectionScrollView>
    );
  },

  renderPanelsContainerView: function(hasMultiAudioTracks, hasClosedCaptions) {
    if (hasMultiAudioTracks && hasClosedCaptions) {
      // Return mixed panels with audio and CC
      return (
        <View style={styles.panelItemSelectionContainerView}>
          {this.renderAudioSelectionScrollView()}
          <View style={styles.panelItemSelectionContainerSeparationView}/>
          {this.renderCCSelectionScrollView()}     
        </View>
      );
    } else if (hasMultiAudioTracks) {
      // Return only audio panel
      return (
        <View style={styles.panelItemSelectionContainerView}>
          {this.renderAudioSelectionScrollView()}
        </View>
      );
    } else {
      // Return only CC panel
      return (
        <View style={styles.panelItemSelectionContainerView}>
          {this.renderCCSelectionScrollView()}
        </View>
      );
    }
  },

  render: function() {
    var hasMultiAudioTracks = this.props.audioTracksTitles && this.props.audioTracksTitles.length > 1;
    var hasClosedCaptions = this.props.closedCaptionsLanguages && this.props.closedCaptionsLanguages.length > 0;
    var animationStyle = {opacity:this.state.opacity};

    return (
      <Animated.View style={[styles.panelContainer, styles.panel, animationStyle]}>
        {this.renderHeaderView(hasMultiAudioTracks, hasClosedCaptions)}
        {this.renderPanelsContainerView(hasMultiAudioTracks, hasClosedCaptions)}
      </Animated.View>
    );
  },
  

});

module.exports = AudioAndCCSelectionPanel;