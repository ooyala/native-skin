// @flow

import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { MARKERS_SIZES } from '../../../../../constants';
import createStyles from './TextMarker.styles';

const TEXT_MARKER_COLLAPSED_LENGTH = 8;

type Props = {
  backgroundColor?: string,
  containerWidth: number,
  leftPosition: number,
  onSeek: () => void,
  onTouch: () => void,
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
    this.setState(({ isExpanded }, { onSeek, onTouch, text }) => {
      onTouch();

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
    const {
      backgroundColor, containerWidth, leftPosition, style, text,
    } = this.props;
    const { isExpanded } = this.state;

    const styles = createStyles(leftPosition, containerWidth);

    let shownText = text;

    if (!isExpanded && text.length > TEXT_MARKER_COLLAPSED_LENGTH) {
      shownText = text.slice(0, TEXT_MARKER_COLLAPSED_LENGTH - 3)
        .concat('...'); // 3 is the dots length
    }

    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <View
          style={[
            styles.root,
            style,
            backgroundColor && { backgroundColor },
            isExpanded && text.length > TEXT_MARKER_COLLAPSED_LENGTH && styles.expanded,
          ]}
        >
          <Text
            numberOfLines={MARKERS_SIZES.TEXT_NUMBER_OF_LINES}
            style={styles.text}
            suppressHighlighting
          >
            {shownText}
          </Text>
          <View
            style={[
              styles.triangle,
              backgroundColor && { borderTopColor: backgroundColor },
              isExpanded && text.length > TEXT_MARKER_COLLAPSED_LENGTH && styles.triangleExpanded,
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
