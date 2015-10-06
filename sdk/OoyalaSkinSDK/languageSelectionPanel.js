/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  Animated,
  ListView,
  StyleSheet,
  SwitchIOS,
  Text,
  TouchableHighlight,
  View,
} = React;

var animationDuration = 1000;
var Constants = require('./constants');
var {
  ICONS,
} = Constants;

var ToggleSwitch = require('./widgets/ToggleSwitch');
var ClosedCaptionsView = require('./closedCaptionsView');
var Utils = require('./utils');
var ResponsiveList = require('./widgets/ResponsiveList');
var LanguageSelectionPanel = React.createClass({
  propTypes: {
    languages: React.PropTypes.array,
    selectedLanguage: React.PropTypes.string,
    onSelect: React.PropTypes.func,
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

  getPreview: function() {
    return (
      <View style={styles.previewPanel}>
        <View style={styles.splitter} />
        <Text style={styles.buttonText}>{Utils.localizedString(this.props.config.locale, "CLOSE CAPTION PREVIEW", this.props.config.localizableStrings)}</Text>
        <Text style={styles.buttonText}>{Utils.localizedString(this.props.config.locale, "Sample Text", this.props.config.localizableStrings)}</Text>
      </View>
    )
  },

  render: function() {
    var hasCC = false;
    if (this.props.selectedLanguage && this.props.selectedLanguage !== '') {
      hasCC = true;
    }
    var previewPanel;
    if (hasCC) {
      previewPanel = this.getPreview();
    }
    // screen height - title - toggle switch - preview - option bar
    var itemPanelHeight = this.props.height  - 30 - 30 - 60;
    var animationStyle = {opacity:this.state.opacity};
    return (
      <Animated.View style={[styles.panelContainer, animationStyle]}>
        <View style={styles.panelTitleRow}>
          <Text style={styles.panelTitle}>{Utils.localizedString(this.props.config.locale, "CC Options", this.props.config.localizableStrings)}</Text>
        </View>
        <ToggleSwitch
          switchOn={hasCC}
          areClosedCaptionsAvailable={this.props.languages.length > 0}
          onValueChanged={(value)=>this.onSwitchToggled(value)}
          switchOnText={Utils.localizedString(this.props.config.locale, "On", this.props.config.localizableStrings)}
          switchOffText={Utils.localizedString(this.props.config.locale, "Off", this.props.config.localizableStrings)}
          config={this.props.config}>
        </ToggleSwitch>
        <ResponsiveList
          horizontal={false}
          data={this.props.languages}
          itemRender={this.renderItem}
          width={this.props.width}
          height={itemPanelHeight}
          itemWidth={160}
          itemHeight={88}>
        </ResponsiveList>
        {previewPanel}
      </Animated.View>
    );
  },

  renderItem: function(item: object, itemId: number) {
    var itemStyle = this.isSelected(item) ? styles.selectedButton : styles.button;
    return (
      <TouchableHighlight 
        style={styles.item}
        onPress={() => this.onSelected(item)}>
        <View style={itemStyle}>
          <Text style={styles.buttonText}>{item}</Text>
        </View>
      </TouchableHighlight>
    );
  },
});

var styles = require('./utils').getStyles(require('./style/languageSelectionPanelStyles.json'));

module.exports = LanguageSelectionPanel;