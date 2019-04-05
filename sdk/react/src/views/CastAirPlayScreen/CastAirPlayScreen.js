import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import {
  BUTTON_NAMES
} from '../../constants';
import AirPlayView from './AirPlayView'
import * as Utils from '../../lib/utils';

import styles from './CastAirPlayScreen.styles'

export default class CastAirPlayScreen extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    onDismiss: PropTypes.func,
    onPress: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired
  }

  _renderCastButton = (color) => {
    return Utils.renderRectButton(
      BUTTON_NAMES.CAST,
      null,
      this.props.config.icons['chromecast-disconnected'].fontString,
      null,
      this.props.height / 2 - 8,
      color,
      this.props.config.icons['chromecast-disconnected'].fontFamilyName
    )
  };

  render() {
    const castButton = this._renderCastButton('white');
    const halfHeightWithMargin = this.props.height / 2 - 8;
    const textContainerDimensions = { height: halfHeightWithMargin, width: this.props.width - halfHeightWithMargin - 4};
    const halfHeightWithMarginStyle = { height: this.props.height / 2 - 8 };

    return (
      <Modal transparent>
        <TouchableOpacity style={styles.touchableOpacity}
          onPress={this.props.onDismiss}>

          {/* fill space at the top */}
          <View style={styles.topView} />

          <View style={styles.content}>
            {/* content goes here */}

            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, { height: this.props.height, width: this.props.width }]}>

              <View style={[styles.modalButton, halfHeightWithMarginStyle]}>
                <AirPlayView style={{ height: halfHeightWithMargin, width: halfHeightWithMargin }}></AirPlayView>
                <TouchableHighlight onPress={this.props.onDismiss}>
                  <View style={[styles.textContainer, textContainerDimensions]}>
                    <Text style={styles.textStyle}>Airplay</Text>
                  </View>
                </TouchableHighlight>
              </View>

              <View style={[styles.modalButton, halfHeightWithMarginStyle]}>
                {castButton}
                <TouchableHighlight onPress={this.props.onPress}>
                  <View style={[styles.textContainer, textContainerDimensions]}>
                    <Text style={styles.textStyle}>Chromecast</Text>
                  </View>
                </TouchableHighlight>
              </View>

            </View>
            </TouchableWithoutFeedback>
          </View>

          {/* fill space at the bottom*/}
          <View style={styles.bottomView} />
        </TouchableOpacity>
      </Modal>
    );
  }
}
