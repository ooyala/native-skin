import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Modal,
    TouchableHighlight,
    View,
    Text
} from 'react-native';

import {
  UI_SIZES
} from '../constants';
import AirPlayView from '../widgets/AirPlayView'
import ResponsiveDesignManager from '../responsiveDesignManager';

class CastAirPlayScreen extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    onDismiss: PropTypes.func,
    onPress: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired
  }

  render() {
    let iconFontSize = ResponsiveDesignManager.makeResponsiveMultiplier(this.props.width, UI_SIZES.CONTROLBAR_ICONSIZE);

    return (
      <Modal transparent>
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          {/* <TouchableHighlight
            onPress={this.props.onPress}
            style={{
              backgroundColor: 'transparent'
            }}>
          </TouchableHighlight> */}
          {/* fill space at the top */}
          <View style={{ flex: 1, justifyContent: 'flex-start' }} />

          <View style={{
            flex: 1, 
            flexDirection: 'column',
            alignItems: 'stretch',
            backgroundColor: 'transparent'}}>
            {/* content goes here */}

            <View style={{
              height: this.props.height,
              width: this.props.width,
              backgroundColor: 'transparent',
              borderRadius: 10
            }}>
              <View style={{
                height: this.props.height / 2,
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: 10,
                flex: 1,
                flexDirection: 'row'}}>
                <AirPlayView style={{
                  padding: 4,
                  height: this.props.height / 2 - 8,
                  width: this.props.height / 2 - 8,
                  color: '#8E8E8E'}}>
                </AirPlayView>
                <View style={{
                  height: this.props.height / 2,
                  width: this.props.width - this.props.height / 2 - 8,
                  justifyContent: 'center', 
                  alignItems: 'flex-start'}}>
                  <Text style={{
                    textAlign: 'left',
                    color: '#FFFFFF',
                    fontSize: 36,
                    fontFamily: 'AvenirNext-DemiBold'}}>Airplay
                  </Text>
                </View>
              </View>

              <View style={{
                height: this.props.height / 2,
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: 10,
                flex: 1,
                flexDirection: 'row'}}>
                <View style={{
                  padding: 4,
                  height: this.props.height / 2 - 8,
                  width: this.props.height / 2 - 8,
                  color: '#8E8E8E'
                }}>
                </View>
                <View style={{
                  height: this.props.height / 2,
                  width: this.props.width - this.props.height / 2 - 8,
                  justifyContent: 'center',
                  alignItems: 'flex-start'
                }}>
                  <Text style={{
                    textAlign: 'left',
                    color: '#FFFFFF',
                    fontSize: 36,
                    fontFamily: 'AvenirNext-DemiBold'
                  }}>Chromecast
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* fill space at the bottom*/}
          <View style={{ flex: 1, justifyContent: 'flex-end' }} />
        </View>
      </Modal>
    );
  }
}

module.exports = CastAirPlayScreen;
