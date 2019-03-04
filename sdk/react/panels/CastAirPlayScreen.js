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

          {/* fill space at the top */}
          <View style={{ flex: 1, justifyContent: 'flex-start' }} />

          <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'transparent' }}>
            {/* content goes here */}
            <View style={{
              height: this.props.height,
              width: this.props.width,
              backgroundColor: 'skyblue',
              borderRadius: 10
            }}>
              <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent' }}>
                <AirPlayView style={{ height: 100, width: 100, color: '#8E8E8E', fontSize: iconFontSize }}>
                </AirPlayView>
                <Text>Airplay</Text>
              </View>
              <TouchableHighlight 
                onPress={this.props.onPress}
                style={{padding: 8}}>
                <Text style={{
                  height: iconFontSize,
                  width: iconFontSize,
                  color: '#8E8E8E',
                  fontSize: iconFontSize,
                  fontFamily: this.props.config.icons['chromecast-disconnected'].fontFamilyStyle}}>
                    {this.props.config.icons['chromecast-disconnected'].fontString} Chromecast
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ flex: 1 }}
                onPress={() => {
                  this.props.onDismiss();
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
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
