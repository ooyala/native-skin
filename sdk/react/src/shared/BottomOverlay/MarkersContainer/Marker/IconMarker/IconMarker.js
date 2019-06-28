// @flow

import React from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import createStyles from './IconMarker.styles';

type Props = {
  backgroundColor?: string,
  containerWidth: number,
  iconUrl?: string,
  imageUrl?: string,
  leftPosition: number,
  onSeek: () => void,
  onTouch: () => void,
  style?: ViewStyleProp,
  touchColor?: string,
};

type State = {
  isExpanded: boolean,
};

export default class IconMarker extends React.Component<Props, State> {
  static defaultProps = {
    backgroundColor: undefined,
    iconUrl: undefined,
    imageUrl: undefined,
    style: undefined,
    touchColor: undefined,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isExpanded: false,
    };

    (this: Object).handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    this.setState(({ isExpanded }, { imageUrl, onSeek, onTouch }) => {
      onTouch();

      // Trigger seek callback if the marker has no image or has been expanded. If there is an image we have to show it
      // first and only after the second click on that image trigger the callback.
      if (!imageUrl || isExpanded) {
        onSeek();
      }

      return {
        isExpanded: !isExpanded,
      };
    });
  }

  render() {
    const {
      backgroundColor, containerWidth, iconUrl, imageUrl, leftPosition, style, touchColor,
    } = this.props;
    const { isExpanded } = this.state;

    const styles = createStyles(leftPosition, containerWidth);

    // If the marker is expanded and there is `imageUrl`, we have to use it.
    const image = (isExpanded && imageUrl ? imageUrl : iconUrl);

    // Image can still be absent.
    if (!image) {
      return null;
    }

    const expandedStyles = [];

    // Apply expanded style only if the larger image is present.
    if (isExpanded && imageUrl) {
      expandedStyles.push(styles.expanded);

      if (touchColor) {
        expandedStyles.push({ backgroundColor: touchColor });
      }
    }

    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <View
          style={[
            styles.root,
            style,
            backgroundColor && { backgroundColor },
            ...expandedStyles,
          ]}
        >
          <Image source={{ uri: image }} style={styles.image} />
          <View
            style={[
              styles.triangle,
              // Apply expanded style only if the larger image is present.
              isExpanded && imageUrl && touchColor && { borderTopColor: touchColor },
              isExpanded && imageUrl && styles.triangleExpanded,
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
