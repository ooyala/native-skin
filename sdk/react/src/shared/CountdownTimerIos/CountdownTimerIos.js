// @flow

import React from 'react';
import { requireNativeComponent, TouchableHighlight } from 'react-native';

type Props = {
  time?: number,
  timeLeft?: number,
  radius?: number,
  fillColor?: string,
  fillAlpha?: number,
  strokeColor?: string,
  tapCancel?: boolean,
  automatic?: boolean,
  onTimerUpdate?: () => void,
  onTimerCompleted?: () => void,
  onPress?: () => void,
};

type State = {
  canceled: boolean,
};

export default class CountdownTimerIos extends React.Component<Props, State> {
  static defaultProps = {
    time: 10,
    radius: 20,
    fillColor: '#000000',
    fillAlpha: 1.0,
    strokeColor: '#ffffff',
    tapCancel: false,
    automatic: true,
    timeLeft: 10,
    onTimerUpdate: undefined,
    onTimerCompleted: undefined,
    onPress: undefined,
  };

  constructor(props: Props) {
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
