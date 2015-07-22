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
var LanguageSelectionPanel = React.createClass({
  propTypes: {
    languages: React.PropTypes.array,
    selectedLanguage: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    localizableStrings: React.PropTypes.object,
    locale: React.PropTypes.string,
    config: React.PropTypes.object
  },

  isSelected: function(name) {
    return name && name !== '' && name == this.props.selectedLanguage;
  },

  generateRows() {
    console.log('generateRows:'+this.props.selectedLanguage);
    var rows = [];
    for (var i = 0; i < this.props.languages.length;) {
      var left = this.props.languages[i++];
      var right = "";
      if (i < this.props.languages.length) {
        right = this.props.languages[i++];
      }
      rows.push({left:left, right:right, selected:this.props.selectedLanguage});
      i = i + 2;
    }
    return rows;
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
        <Text style={styles.buttonText}>{Utils.localizedString(this.props.locale, "CLOSE CAPTION PREVIEW", this.props.localizableStrings)}</Text>
        <Text style={styles.buttonText}>{Utils.localizedString(this.props.locale, "Sample Text", this.props.localizableStrings)}</Text>
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

    return (
      <View style={styles.panelContainer}>
        <View style={styles.panelTitleRow}>
          <Text style={styles.panelTitle}>{Utils.localizedString(this.props.locale, "CC Options", this.props.localizableStrings)}</Text>
        </View>
        <ToggleSwitch
          switchOn={hasCC}
          onValueChanged={(value)=>this.onSwitchToggled(value)}
          switchOnText={Utils.localizedString(this.props.locale, "On", this.props.localizableStrings)}
          switchOffText={Utils.localizedString(this.props.locale, "Off", this.props.localizableStrings)}
          config={this.props.config}>
        </ToggleSwitch>
        <ListView
          dataSource={ds.cloneWithRows(this.generateRows())}
          renderRow={this.renderRow}
          style={styles.listView}>
        </ListView>
        {previewPanel}
      </View>
    );
  },

  renderRow: function(row: object, sectionID: number, rowID: number) {
    var leftStyle = this.isSelected(row.left) ? styles.selectedButton : styles.button;
    var rightStyle = this.isSelected(row.right) ? styles.selectedButton : styles.button;
    return (
      <View style= {styles.row}>
        <TouchableHighlight 
          style={styles.placeHolder}
          onPress={() => this.onSelected(row.left)}>
          <View style={leftStyle}>
            <Text style={styles.buttonText}>{row.left}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.placeHolder}
          onPress={() => this.onSelected(row.right)}>
          <View style={rightStyle}>
            <Text style={styles.buttonText}>{row.right}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  },
});

var styles = require('./utils').getStyles(require('./style/languageSelectionPanelStyles.json'));

module.exports = LanguageSelectionPanel;