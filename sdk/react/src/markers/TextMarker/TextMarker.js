// @flow

import * as React from 'react';
import { Text, TouchableWithoutFeedback } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import styles from './TextMarker.styles';

const TEXT_MARKER_COLLAPSED_LENGTH = 8;

type Props = {
  backgroundColor?: ?string,
  onSeek: () => void,
  text: string,
  style?: ViewStyleProp,
};

type State = {
  isExpanded: boolean,
};

export default class TextMarker extends React.Component<Props, State> {
  static defaultProps = {
    backgroundColor: undefined,
    style: undefined,
  };

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
    const { backgroundColor, style, text } = this.props;
    const { isExpanded } = this.state;

    let shownText = text;

    if (!isExpanded && text.length > TEXT_MARKER_COLLAPSED_LENGTH) {
      shownText = text.slice(0, TEXT_MARKER_COLLAPSED_LENGTH - 3).concat('...'); // 3 is the dots length
    }

    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <Text
          style={[
            styles.root,
            style,
            backgroundColor && { backgroundColor },
            isExpanded && styles.expanded,
          ]}
          suppressHighlighting
        >
          {shownText}
        </Text>
      </TouchableWithoutFeedback>
    );
  }
}
