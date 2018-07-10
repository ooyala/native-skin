
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import createReactClass from 'create-react-class';
import {
	requireNativeComponent,
	NativeMethodsMixin,
  StyleSheet,
	View,
  TouchableHighlight,
  Platform
} from 'react-native';

var CountdownView = createReactClass({
  displayName: 'CountdownView',
  mixins: [NativeMethodsMixin],

  propTypes: {
      ...View.propTypes,

      time: PropTypes.number,
  timeLeft: PropTypes.number,
      radius: PropTypes.number,
      fillColor: PropTypes.string,
      fillAlpha: PropTypes.number,
      strokeColor: PropTypes.string,
      tapCancel: PropTypes.bool,
  automatic: PropTypes.bool,

      onTimerUpdate: PropTypes.func,
      onTimerCompleted: PropTypes.func,
  onPress: PropTypes.func,
  },

  getDefaultProps: function() {
      return {
    time: 10,
    radius: 20,
    fillColor: '#000000',
    fillAlpha: 1.0,
    strokeColor: '#ffffff',
    tapCancel: false,
    automatic: true,
    timeLeft: 10,
      };
  },

  getInitialState: function() {
    return {
      canceled: false,
    };
  },

  _onTimerUpdate: function(event: Event) {
      this.props.onTimerUpdate && this.props.onTimerUpdate(event.nativeEvent);
  },

  _onTimerCompleted: function(event: Event) {
      this.props.onTimerCompleted && this.props.onTimerCompleted(event.nativeEvent);
  },

  _onPress: function() {
  if (this.props.tapCancel) {
    this.setState({canceled: true});
  }

      this.props.onPress && this.props.onPress();
  },

  renderCountdownView: function() {
      return <NativeCountdownView
          {...this.props}
    canceled={this.state.canceled}
          onTimerUpdate={this._onTimerUpdate}
          onTimerCompleted={this._onTimerCompleted} />
  },

  renderClickableView: function() {
    return (<TouchableHighlight
      underlayColor='transparent'
      onPress={() => this._onPress()}>
      {this.renderCountdownView()}
    </TouchableHighlight>);
  },

  render: function() {
    if (this.props.onPress) {
      return this.renderClickableView();
    } else {
      return this.renderCountdownView();
    }
  },
});

if (Platform.OS === 'ios') {
  var NativeCountdownView = requireNativeComponent('CountdownView', CountdownView, {
  	nativeOnly: {
  		onTimerUpdate: true,
  		onTimerCompleted: true,
      canceled: true,
  	},
  });

  module.exports = CountdownView;
}