// @flow

import * as React from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import styles from './IconMarker.styles';

type Props = {
  backgroundColor?: ?string,
  iconUrl: ?string,
  imageUrl: ?string,
  onSeek: () => void,
  style?: ViewStyleProp,
  touchColor?: ?string,
};

type State = {
  isExpanded: boolean,
};

export default class IconMarker extends React.Component<Props, State> {
  static defaultProps = {
    backgroundColor: undefined,
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
    const { imageUrl, onSeek } = this.props;
    const { isExpanded } = this.state;

    // Trigger seek callback if the marker has no image or has been expanded. If there is an image we have to show it
    // first and only after the second click on that image trigger the callback.
    if (!imageUrl || isExpanded) {
      onSeek();
    }

    this.setState({
      isExpanded: !isExpanded,
    });
  }

  render() {
    const {
      backgroundColor, iconUrl, imageUrl, style, touchColor,
    } = this.props;
    const { isExpanded } = this.state;

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
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
