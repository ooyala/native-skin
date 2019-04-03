import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	requireNativeComponent,
	View,
  TouchableHighlight
} from 'react-native';

const NativeCountdownView = requireNativeComponent('CountdownView', CountdownView, {
  nativeOnly: {
    onTimerUpdate: true,
    onTimerCompleted: true,
    canceled: true
  }
});

export default class CountdownTimerIos extends Component {
  static propTypes = {
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
    onPress: PropTypes.func
  }

  static defaultProps = {
    time: 10,
    radius: 20,
    fillColor: '#000000',
    fillAlpha: 1.0,
    strokeColor: '#ffffff',
    tapCancel: false,
    automatic: true,
    timeLeft: 10
  }

  state = {
    canceled: false
  }

  _onTimerUpdate = (event) => {
    this.props.onTimerUpdate && this.props.onTimerUpdate(event.nativeEvent);
  }

  _onTimerCompleted = (event) => {
    this.props.onTimerCompleted && this.props.onTimerCompleted(event.nativeEvent);
  }

  _onPress = () => {
  if (this.props.tapCancel) {
    this.setState({
      canceled: true
    });
  }
    this.props.onPress && this.props.onPress();
  }

  renderCountdownView() {
    return (
      <NativeCountdownView
        {...this.props}
        canceled={this.state.canceled}
        onTimerUpdate={this._onTimerUpdate}
        onTimerCompleted={this._onTimerCompleted}>
      </NativeCountdownView>
    );
  }

  renderClickableView() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={() => this._onPress()}>
        {this.renderCountdownView()}
      </TouchableHighlight>
    );
  }

  render() {
    if (this.props.onPress) {
      return this.renderClickableView();
    } else {
      return this.renderCountdownView();
    }
  }
};
