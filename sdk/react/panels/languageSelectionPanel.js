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
  renderHeader: function(hasCC) {
    var title = Utils.localizedString(this.props.config.locale, "CC Options", this.props.config.localizableStrings);
    var switchOnText = Utils.localizedString(this.props.config.locale, "On", this.props.config.localizableStrings);
    var switchOffText = Utils.localizedString(this.props.config.locale, "Off", this.props.config.localizableStrings);
    var panelIcon =  this.props.config.icons.cc.fontString;

    var minimumWidthPanelIcon = 320;
    var mediumWidthSwitchText = 360;
    var fullWidthPanelIcon = 380;

    var width = this.props.width;

    // ToggleSwitch without text + panelIcon + dismiss button
    if (width < minimumWidthPanelIcon) {
      title = "";
      switchOnText = "";
      switchOffText = "";
    }
    // ToggleSwitch with text + panelIcon + dismiss button
    else if (title.length > 10 && width < fullWidthPanelIcon) {
      title = "";
    }
    // ToggleSwitch without text + title + dismiss button
    else if (width < mediumWidthSwitchText) {
      switchOnText = "";
      switchOffText = "";
      panelIcon = "";
    }
    // ToggleSwitch with text + title + dismiss button
    else if (width < fullWidthPanelIcon) {
      panelIcon = "";
    }
    // TO-DO for line (136-140) we can not change accessibility label value for text tags.
    // This ability is added in latest react native 0.46 onwards
    // so we can remove this piece of code once we upgrade.
    return (
    <View style={panelStyles.panelTitleView}>
      <ToggleSwitch
        switchOn={hasCC}
        areClosedCaptionsAvailable={this.props.languages.length > 0}
        onValueChanged={(value)=>this.onSwitchToggled(value)}
        switchOnText={switchOnText}
        switchOffText={switchOffText}
        config={this.props.config}>
      </ToggleSwitch>
      <Text style={[panelStyles.panelTitleText]}>
      {title}
      </Text>
      <TouchableHighlight accessible={true} accessibilityLabel={BUTTON_NAMES.CLOSED_CAPTIONS}>
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
            config={this.props.config}
            selectedLanguage={this.props.selectedLanguage}>
          </PreviewWidget>
        );
    }

    return (
      <Animated.View style={[styles.panelContainer, panelStyles.panel, animationStyle]}>
        {this.renderHeader(hasCC)}
        <ScrollView>
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
        </ScrollView>
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
