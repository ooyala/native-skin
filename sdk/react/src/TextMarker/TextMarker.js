// @flow

import * as React from 'react';
import { Text, TouchableWithoutFeedback } from 'react-native';

import styles from './TextMarker.styles';

const TEXT_MARKER_COLLAPSED_LENGTH = 80;

type Props = {
  onSeek: () => void,
  text: string,
};

type State = {
  isExpanded: boolean,
};

export default class TextMarker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isExpanded: false,
    };

    (this: Object).handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    const { onSeek, text } = this.props;
    const { isExpanded } = this.state;

    // Trigger seek callback if the marker text is shorter than maximum or has been expanded. If there the text is
    // longer we have to expand it first and only after the second click on that text trigger the callback.
    if (text.length <= TEXT_MARKER_COLLAPSED_LENGTH || isExpanded) {
      onSeek();
    }

    this.setState({
      isExpanded: !isExpanded,
    });
  }

  render() {
    const { text } = this.props;
    const { isExpanded } = this.state;

    let shownText = text;

    if (!isExpanded && text.length > TEXT_MARKER_COLLAPSED_LENGTH) {
      shownText = text.slice(0, TEXT_MARKER_COLLAPSED_LENGTH).concat('...');
    }

    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <Text style={styles.root} suppressHighlighting>{shownText}</Text>
      </TouchableWithoutFeedback>
    );
  }
}
