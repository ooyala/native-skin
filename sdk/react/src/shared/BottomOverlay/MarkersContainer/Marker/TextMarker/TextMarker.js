// @flow

import * as React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { MARKERS_SIZES } from '../../../../../constants';
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
    this.setState(({ isExpanded }, { onSeek, text }) => {
      // Trigger seek callback if the marker text is shorter than maximum or has been expanded. If there the text is
      // longer we have to expand it first and only after the second click on that text trigger the callback.
      if (text.length <= TEXT_MARKER_COLLAPSED_LENGTH || isExpanded) {
        onSeek();
      }

      return {
        isExpanded: !isExpanded,
      };
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
        <View
          style={[
            styles.root,
            style,
            backgroundColor && { backgroundColor },
            isExpanded && styles.expanded,
          ]}
        >
          <Text
            numberOfLines={MARKERS_SIZES.TEXT_NUMBER_OF_LINES}
            style={styles.text}
            suppressHighlighting
          >
            {shownText}
          </Text>
          <View style={[styles.triangle, backgroundColor && { borderTopColor: backgroundColor }]} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
