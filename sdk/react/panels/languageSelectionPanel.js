/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react';
import {
  Animated,
  ListView,
  StyleSheet,
  SwitchIOS,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

var animationDuration = 1000;
var Constants = require('../constants');
var {
  ICONS
} = Constants;

var ToggleSwitch = require('../widgets/ToggleSwitch');
var Utils = require('../utils');
var ResponsiveList = require('../widgets/ResponsiveList');
var PreviewWidget = require('../languageSelectionPreview');
var styles = require('../utils').getStyles(require('./style/languageSelectionPanelStyles'));
var panelStyles = require('./style/panelStyles');

var LanguageSelectionPanel = React.createClass({
  propTypes: {
    languages: React.PropTypes.array,
    selectedLanguage: React.PropTypes.string,
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
    return name && name !== '' && name == this.props.selectedLanguage;
  },

  onSelected: function(name) {
    if (this.props.selectedLanguage !== name) {
      this.props.onSelect(name);
    }
  },

  onDismissPress: function() {
    this.props.onDismiss();
  },

  onSwitchToggled: function(switchOn) {
    if (switchOn) {
      this.onSelected(this.props.languages[0]);
    } else {
      this.onSelected('');
    }
  },

  onTouchEnd: function(event) {
    // ignore.
  },
  renderHeader: function() {
    var title = Utils.localizedString(this.props.config.locale, "CC Options", this.props.config.localizableStrings);
    var panelIcon = this.props.config.icons.cc.fontString;

    return (
    <View style={panelStyles.panelTitleView}>
      <Text style={[panelStyles.panelTitleText]}>
      {title}
      </Text>
      <Text style={panelStyles.panelIcon}>{panelIcon}</Text>
      <View style={panelStyles.headerFlexibleSpace}></View>
      <TouchableHighlight style = {[panelStyles.dismissButton]}
        onPress={this.onDismissPress}>
        <Text style={panelStyles.dismissIcon}>{this.props.config.icons.dismiss.fontString}</Text>
      </TouchableHighlight>
    </View>);
  },

  render: function() {
    var hasCC = false;
    if (this.props.selectedLanguage && this.props.selectedLanguage !== '') {
      hasCC = true;
    }

    var renderHorizontal = Utils.shouldShowLandscape(this.props.width, this.props.height);

    // screen height - title - toggle switch - preview - option bar
    var itemPanelHeight = this.props.height  - 30 - 30 - 60;
    var animationStyle = {opacity:this.state.opacity};

    if (this.props.selectedLanguage) {
      var previewText = 
        ( <PreviewWidget
            isVisible={hasCC}
            config={this.props.config}>
          </PreviewWidget>
        );
    }
  
    return (
      <Animated.View style={[styles.panelContainer, panelStyles.panel, animationStyle]}>
        {this.renderHeader()}
        <ToggleSwitch
          switchOn={hasCC}
          areClosedCaptionsAvailable={this.props.languages.length > 0}
          onValueChanged={(value)=>this.onSwitchToggled(value)}
          switchOnText={Utils.localizedString(this.props.config.locale, "On", this.props.config.localizableStrings)}
          switchOffText={Utils.localizedString(this.props.config.locale, "Off", this.props.config.localizableStrings)}
          config={this.props.config}>
        </ToggleSwitch>
        <ResponsiveList
          horizontal={renderHorizontal}
          data={this.props.languages}
          itemRender={this.renderItem}
          width={this.props.width}
          height={itemPanelHeight}
          itemWidth={160}
          itemHeight={88}>
        </ResponsiveList>
        {previewText}
      </Animated.View>
    );
  },

  getSelectedStyle: function() {
    if (this.props.config.general.accentColor) {
      return [styles.selectedButton, {"backgroundColor" : this.props.config.general.accentColor}];
    } else {
      return styles.selectedButton;
    }
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
});

module.exports = LanguageSelectionPanel;