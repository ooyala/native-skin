import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text
} from 'react-native';

import {
  BUTTON_NAMES
} from '../constants';
import AirPlayView from '../widgets/AirPlayView'
import Utils from '../utils';

import styles from './style/castAirPlayScreenStyles.json'

class CastAirPlayScreen extends Component {
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
      this.props.config.icons.cc.fontString,
      null,
      this.props.height / 2 - 8,
      color,
      this.props.config.icons.cc.fontFamilyName
    )
  };

  render() {
    const castButton = this._renderCastButton('white');
    const textContainerDimensions = { height: this.props.height / 2 - 8, width: this.props.width - this.props.height / 2 - 8 };
    const halfHeightWithMargin = { height: this.props.height / 2 - 8 };
    
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
              <View style={[styles.modalButton, halfHeightWithMargin]}>
                <AirPlayView style={{
                  height: this.props.height / 2 - 8,
                  width: this.props.height / 2 - 8,
                  color: '#8E8E8E'}}>
                </AirPlayView>
                <View style={[styles.textContainer, textContainerDimensions]}>
                <Text style={styles.textStyle}>Airplay</Text>
                </View>
              </View>

              <View style={[styles.modalButton, halfHeightWithMargin]}>
                {castButton}
                <View style={[styles.textContainer, textContainerDimensions]}>
                <Text style={styles.textStyle}>Chromecast</Text>
                </View>
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

module.exports = CastAirPlayScreen;
