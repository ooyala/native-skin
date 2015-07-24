/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  ListView,
  StyleSheet,
  SwitchIOS,
  Text,
  TouchableHighlight,
  View,
} = React;

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
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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
    return (
      <View style={styles.panelContainer}>
        <View style={styles.panelTitleRow}>
          <Text style={styles.panelTitle}>{Utils.localizedString(this.props.config.locale, "CC Options", this.props.config.localizableStrings)}</Text>
        </View>
        <ToggleSwitch
          switchOn={hasCC}
          onValueChanged={(value)=>this.onSwitchToggled(value)}
          switchOnText={Utils.localizedString(this.props.config.locale, "On", this.props.config.localizableStrings)}
          switchOffText={Utils.localizedString(this.props.config.locale, "Off", this.props.config.localizableStrings)}
          config={this.props.config}>
        </ToggleSwitch>
        <ResponsiveList
          horizontal={true}
          data={this.props.languages}
          itemRender={this.renderItem}
          width={this.props.width}
          height={itemPanelHeight}
          itemWidth={100}
          itemHeight={65}>
        </ResponsiveList>
        {previewPanel}
      </View>
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