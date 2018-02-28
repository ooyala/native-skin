/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react';
import {
  Animated,
  ListView,
  ScrollView,
  StyleSheet,
  SwitchIOS,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

var animationDuration = 1000;
var Constants = require('../constants');
var {
  BUTTON_NAMES,
  ICONS
} = Constants;

var Utils = require('../utils');
var ResponsiveList = require('../widgets/ResponsiveList');
var styles = require('../utils').getStyles(require('./style/MultiAudioSelectionPanelStyles'));
var panelStyles = require('./style/panelStyles');

var MultiAudioSelectionPanel = React.createClass({
  propTypes: {
    audioTracksTitles: React.PropTypes.array,
    selectedAudioTrackTitle: React.PropTypes.string,
    onSelect: React.PropTypes.func,
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

  getSelectedStyle: function() {
    if (this.props.config.general.accentColor) {
      return [styles.selectedButton, {"backgroundColor" : this.props.config.general.accentColor}];
    } else {
      return styles.selectedButton;
    }
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

  isSelected: function(name) {
    return name && name !== '' && name == this.props.selectedAudioTrackTitle;
  },

  onSelected: function(name) {
    if (this.props.selectedAudioTrackTitle !== name) {
      this.props.onSelect(name);
    }
  },

  onDismissPress: function() {
    this.props.onDismiss();
  },

  renderHeader: function(hasMultiAudioTracks) {
    var title = Utils.localizedString(this.props.config.locale, "Multi audio options", this.props.config.localizableStrings);
    var panelIcon = this.props.config.icons.multiAudio.fontString; // TODO: Create icon for multi audio if needed

    var minimumWidthPanelIcon = 320;
    var mediumWidthSwitchText = 360;
    var fullWidthPanelIcon = 380;

    var width = this.props.width;

    if (width < minimumWidthPanelIcon) {
      title = "";
    } else if (title.length > 10 && width < fullWidthPanelIcon) {
      title = "";
    } else if (width < mediumWidthSwitchText) {
      panelIcon = "";
    } else if (width < fullWidthPanelIcon) {
      panelIcon = "";
    }

    return (
    <View style={panelStyles.panelTitleView}>
      <Text style={[panelStyles.panelTitleText]}> {title} </Text>
      <TouchableHighlight accessible={true} accessibilityLabel={BUTTON_NAMES.MULTI_AUDIO}>
        <View>
          <Text style={panelStyles.panelIcon}>{panelIcon}</Text>
        </View>
      </TouchableHighlight>
      <View style={panelStyles.headerFlexibleSpace}></View>
      <TouchableHighlight
        accessible={true} accessibilityLabel={BUTTON_NAMES.DISMISS} accessibilityComponentType="button"
        style = {[panelStyles.dismissButton, {"paddingTop": 10, "paddingBottom": 0}]}
        onPress={this.onDismissPress}>
        <Text
          style={[panelStyles.dismissIcon, {"paddingBottom": 0}]}>
          {this.props.config.icons.dismiss.fontString}
        </Text>
      </TouchableHighlight>
    </View>);
  },

  renderItem: function(item: object, itemId: number) {
    var itemStyle = this.isSelected(item) ? this.getSelectedStyle() : styles.button;
    return (
      <TouchableHighlight
        key={itemId}
        style={styles.item}
        onPress={() => this.onSelected(item)}>
        <View style={itemStyle}>
          <View style={styles.itemContainer}>
            <Text style={styles.buttonText}>{item}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },

  render: function() {
    var hasMultiAudioTracks = false;

    if (this.props.selectedAudioTrackTitle && this.props.selectedAudioTrackTitle !== '') {
        hasMultiAudioTracks = true;
    }

    var renderHorizontal = Utils.shouldShowLandscape(this.props.width, this.props.height);

    // TODO: Create proportional sizes or move to constants
    // screen height - title - toggle switch - preview - option bar
    var itemPanelHeight = this.props.height - 30 - 30 - 60;
    var animationStyle = {opacity:this.state.opacity};

    return (
      <Animated.View style={[styles.panelContainer, panelStyles.panel, animationStyle]}>
        {this.renderHeader(hasMultiAudioTracks)}
        <ScrollView>
          <ResponsiveList
            horizontal={renderHorizontal}
            data={this.props.audioTracksTitles}
            itemRender={this.renderItem} // TODO: Check that realy not need func params.
            width={this.props.width}
            height={itemPanelHeight}
            itemWidth={160} // TODO: Move to constant or create proportional size
            itemHeight={88}>
          </ResponsiveList>
        </ScrollView>
      </Animated.View>
    );
  },

});

module.exports = MultiAudioSelectionPanel;