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

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

var LanguageSelectionPanel = React.createClass({
  propTypes: {
    dataSource: React.PropTypes.array,
    selectedLanguage: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
  },

  getInitialState: function() {
    return {dataSource:ds.cloneWithRows(this.props.dataSource), 
            switchOn: false
          };
  },

  onRowSelected: function(row) {
  	if (this.props.onRowAction) {
  	  this.props.onSelect({row});
  	}
  },

  onSwitchToggled: function() {
    var nextState = !this.state.switchOn;
    this.setState({switchOn: nextState});
  },

  getCloseButton: function() {
    return (
      <TouchableHighlight
        onPress={() => this.onRowSelected(row)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>row</Text>
        </View>
      </TouchableHighlight>);
  },

  getToggleSwitch: function() {
    var icon = this.state.switchOn ? ICONS.TOGGLEON : ICONS.TOGGLEOFF;
    return (
      <View style={styles.toggleSwitch}>
        <Text style={styles.buttonText}>{UI_TEXT.OFF}</Text>
        <TouchableHighlight
          onPress={this.onSwitchToggled}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{icon}</Text>
          </View>
        </TouchableHighlight>
        <Text style={styles.buttonText}>{UI_TEXT.OFF}</Text>
      </View>);
  },

  render: function() {
    return (
      <View style={styles.fullscreenContainer}>
        <View style={styles.panelTitleRow}>
          <Text style={styles.panelTitle}>{UI_TEXT.CC_OPTIONS}</Text>
          <View style={styles.placeHolder}></View>
          {this.getCloseButton()}
        </View>
        {this.getToggleSwitch()}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={styles.listView}>
        </ListView>
      </View>
    );
  },

  renderRow: function(row: object, sectionID: number, rowID: number) {
    return (
    <TouchableHighlight
      onPress={() => this.onRowSelected(row)}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>row</Text>
      </View>
    </TouchableHighlight>
    );
  },
});

var styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  placeHolder: {
    flex: 1,
  },
  panelTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleSwitch: {
    flex: 1,
    flexDirection: 'row',
  },
  panelTitle: {
  	flex: 1,
  	fontSize: 40,
  	textAlign: 'left',
  	color: 'white',
  	padding: 20
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 6,
    marginTop: 6,
    marginLeft: 12,
  },
  listView: {
    backgroundColor: '#333333',
  },
  button: {
    backgroundColor: '#F9F4F6',
    padding: 6,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#030303',
    fontSize: 16,
    fontFamily: 'AvenirNext-DemiBold',
  },
});

module.exports = LanguageSelectionPanel;