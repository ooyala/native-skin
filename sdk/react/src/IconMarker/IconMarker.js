// @flow

import * as React from 'react';
import { Image, TouchableWithoutFeedback } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import styles from './IconMarker.styles';

type Props = {
  iconUrl: ?string,
  imageUrl: ?string,
  onSeek: () => void,
  style?: ViewStyleProp,
};

type State = {
  isExpanded: boolean,
};

export default class IconMarker extends React.Component<Props, State> {
  static defaultProps = {
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
    const { iconUrl, imageUrl, style } = this.props;
    const { isExpanded } = this.state;

    // If the marker is expanded and there is `imageUrl`, we have to use it.
    const image = (isExpanded && imageUrl ? imageUrl : iconUrl);

    // Image can still be absent.
    if (!image) {
      return null;
    }

    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <Image source={{ uri: image }} style={[styles.root, style]} />
      </TouchableWithoutFeedback>
    );
  }
}
