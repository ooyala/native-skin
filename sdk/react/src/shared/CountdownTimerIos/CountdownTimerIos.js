import React from 'react';
import PropTypes from 'prop-types';
import { requireNativeComponent, TouchableHighlight, View } from 'react-native';

export default class CountdownTimerIos extends React.Component {
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
    onPress: PropTypes.func,
  };

  static defaultProps = {
    time: 10,
    radius: 20,
    fillColor: '#000000',
    fillAlpha: 1.0,
    strokeColor: '#ffffff',
    tapCancel: false,
    automatic: true,
    timeLeft: 10,
  };

  constructor(props) {
    super(props);

    this.state = {
      canceled: false,
    };
  }

  onTimerUpdate = (event) => {
    const { onTimerUpdate } = this.props;

    if (onTimerUpdate) {
      onTimerUpdate(event.nativeEvent);
    }
  };

  onTimerCompleted = (event) => {
    const { onTimerCompleted } = this.props;

    if (onTimerCompleted) {
      onTimerCompleted(event.nativeEvent);
    }
  };

  onPress = () => {
    const { onPress, tapCancel } = this.props;

    if (tapCancel) {
      this.setState({
        canceled: true,
      });
    }

    if (onPress) {
      onPress();
    }
  };

  renderCountdownView() {
    const { canceled } = this.state;

    return (
      <NativeCountdownView
        {...this.props}
        canceled={canceled}
        onTimerUpdate={this.onTimerUpdate}
        onTimerCompleted={this.onTimerCompleted}
      />
    );
  }

  renderClickableView() {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => this.onPress()}
      >
        {this.renderCountdownView()}
      </TouchableHighlight>
    );
  }

  render() {
    const { onPress } = this.props;

    if (onPress) {
      return this.renderClickableView();
    }

    return this.renderCountdownView();
  }
}

const NativeCountdownView = requireNativeComponent('CountdownView', CountdownTimerIos, {
  nativeOnly: {
    onTimerUpdate: true,
    onTimerCompleted: true,
    canceled: true,
  },
});
