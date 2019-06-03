// @flow

import React from 'react';
import {
  Modal, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View,
} from 'react-native';

import { BUTTON_NAMES } from '../../constants';
import AirPlayView from './AirPlayView';
import RectangularButton from '../../shared/RectangularButton';
import type { Config } from '../../types/Config';

import styles from './CastAirPlayScreen.styles';

type Props = {
  width: number,
  height: number,
  onDismiss: () => void,
  onPress: () => void,
  config: Config,
};

export default class CastAirPlayScreen extends React.Component<Props> {
  renderCastButton = (color) => {
    const { config, height } = this.props;

    return (
      <RectangularButton
        name={BUTTON_NAMES.CAST}
        style={null}
        icon={config.icons['chromecast-disconnected'].fontString}
        onPress={null}
        fontSize={height / 2 - 8}
        buttonColor={color}
        fontFamily={config.icons['chromecast-disconnected'].fontFamilyName}
      />
    );
  };

  render() {
    const {
      height, onDismiss, onPress, width,
    } = this.props;

    const castButton = this.renderCastButton('white');
    const halfHeightWithMargin = height / 2 - 8;
    const textContainerDimensions = {
      height: halfHeightWithMargin,
      width: width - halfHeightWithMargin - 4,
    };
    const halfHeightWithMarginStyle = { height: height / 2 - 8 };

    return (
      <Modal transparent>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={onDismiss}
        >

          {/* fill space at the top */}
          <View style={styles.topView} />

          <View style={styles.content}>
            {/* content goes here */}

            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, { height, width }]}>

                <View style={[styles.modalButton, halfHeightWithMarginStyle]}>
                  <AirPlayView style={{
                    height: halfHeightWithMargin,
                    width: halfHeightWithMargin,
                  }}
                  />
                  <TouchableHighlight onPress={onDismiss}>
                    <View style={[styles.textContainer, textContainerDimensions]}>
                      <Text style={styles.textStyle}>Airplay</Text>
                    </View>
                  </TouchableHighlight>
                </View>

                <View style={[styles.modalButton, halfHeightWithMarginStyle]}>
                  {castButton}
                  <TouchableHighlight onPress={onPress}>
                    <View style={[styles.textContainer, textContainerDimensions]}>
                      <Text style={styles.textStyle}>Chromecast</Text>
                    </View>
                  </TouchableHighlight>
                </View>

              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* fill space at the bottom */}
          <View style={styles.bottomView} />
        </TouchableOpacity>
      </Modal>
    );
  }
}
