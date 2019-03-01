import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Modal,
    TouchableHighlight,
    View,
    Text
} from 'react-native';

import AirPlayView from '../widgets/AirPlayView'

class CastAirPlayScreen extends Component {
  static PropTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    onDismiss: PropTypes.func
  }

  render() {
    return (
      <Modal transparent>
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>

          {/* fill space at the top */}
          <View style={{ flex: 1, justifyContent: 'flex-start' }} />

          <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            {/* content goes here */}
            <View style={{
              width: this.props.width,
              height: this.props.height,
              backgroundColor: 'skyblue',
              borderRadius: 10
            }}>
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
