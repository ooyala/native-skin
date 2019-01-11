'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {
  Animated,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  BUTTON_NAMES,
  CELL_TYPES
} from '../constants';

const Utils = require('../utils');
const styles = require('../utils').getStyles(require('./style/PlaybackSpeedPanelStyles'));
const ItemSelectionScrollView = require('./ItemSelectionScrollView');

const animationDuration = 1000;
const constants = {
  headerViewSectionTitle: "Playback Speed",
  normalPlaybackSpeedRateTitle: "Normal",
  normalPlaybackSpeedRateValue: 1.0,
  maxPlaybackSpeedRateValue: 2.0,
  minPlaybackSpeedRateValue: 0.5,
  playbackSpeedRatePostfix: "x"
};

class PlaybackSpeedPanel extends React.Component {

  static propTypes = {
    playbackSpeedRates: PropTypes.array,
    selectedPlaybackSpeedRate: PropTypes.string,
    onSelectPlaybackSpeedRate: PropTypes.func,
    onDismiss: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    config: PropTypes.object
  };

  state = {
    opacity: new Animated.Value(0)
  };

  componentDidMount() {
    this.state.opacity.setValue(0);
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: animationDuration,
          delay: 0
        }),
    ]).start();
  }

  onPlaybackSpeedRateSelected = (playbackSpeedRate) => {
    const localizedTitleForNormalPlaybackSpeedRate = Utils.localizedString(
      this.props.config.locale, constants.normalPlaybackSpeedRateTitle, this.props.config.localizableStrings);
    let originalPlaybackSpeedRate = playbackSpeedRate;

    if (playbackSpeedRate === localizedTitleForNormalPlaybackSpeedRate) {
      originalPlaybackSpeedRate = playbackSpeedRate.replace(
        localizedTitleForNormalPlaybackSpeedRate, constants.normalPlaybackSpeedRateValue);
    } else {
      originalPlaybackSpeedRate = playbackSpeedRate.toString().substring(0, playbackSpeedRate.toString().length - 1)
    }

    if (this.props.selectedPlaybackSpeedRate !== originalPlaybackSpeedRate) {
      this.props.onSelectPlaybackSpeedRate(originalPlaybackSpeedRate);
    }
  };

  onDismissPress = () => {
    this.props.onDismiss();
  };

  renderHeaderView = () => {
    const localizedTitle = Utils.localizedString(
      this.props.config.locale, constants.headerViewSectionTitle, this.props.config.localizableStrings);

    return (
      <View style={styles.panelHeaderView}>
        <Text style={[styles.panelHeaderViewText]}>{localizedTitle}</Text>
        <TouchableHighlight style={styles.dismissButton}
                            accessible={true}
                            accessibilityLabel={BUTTON_NAMES.DISMISS}
                            accessibilityComponentType="button"
                            underlayColor="transparent" // Can't move this property to json style file because it doesn't works
                            onPress={this.onDismissPress}>
          <Text style={styles.dismissIcon}>
            {this.props.config.icons.dismiss.fontString}
          </Text>
        </TouchableHighlight>
      </View>
    );
  };

  renderSelectionScrollView = () => {
    const localizedTitleForNormalPlaybackSpeedRate = Utils.localizedString(
      this.props.config.locale, constants.normalPlaybackSpeedRateTitle, this.props.config.localizableStrings);

    // Localize selected item
    let selectedLocalizedItem = this.props.selectedPlaybackSpeedRate;

    if (this.props.selectedPlaybackSpeedRate == constants.normalPlaybackSpeedRateValue) {
      selectedLocalizedItem = localizedTitleForNormalPlaybackSpeedRate;
    } else {
      const selectedLocalizedItemNumber = parseFloat(String(selectedLocalizedItem));
      const selectedLocalizedItemString = parseFloat(selectedLocalizedItemNumber.toFixed(2));

      selectedLocalizedItem = parseFloat(selectedLocalizedItemString).toString().concat(constants.playbackSpeedRatePostfix);
    }

    // Validate playback speed rates
    const validatedPlaybackSpeedRates = this.props.playbackSpeedRates.reduce((result, item) => {
      const number = parseFloat(String(item));

      if (!isNaN(number) && number >= constants.minPlaybackSpeedRateValue && number <= constants.maxPlaybackSpeedRateValue) {
        result.push(parseFloat(number.toFixed(2)));
      }
      return result;
    }, []);

    // Add a normal playback speed rate if needed
    if (!validatedPlaybackSpeedRates.includes(constants.normalPlaybackSpeedRateValue)) {
      validatedPlaybackSpeedRates.push(constants.normalPlaybackSpeedRateValue)
    }

    // Sort playback speed rates
    validatedPlaybackSpeedRates.sort((a, b) => a - b);

    // Add postfix for playback speed rates and remove duplicates if needed
    const convertedPlaybackSpeedRates = [...new Set(validatedPlaybackSpeedRates)].map(item => {
      if (item === constants.normalPlaybackSpeedRateValue) {
        return localizedTitleForNormalPlaybackSpeedRate;
      } else {
        return item.toString().concat(constants.playbackSpeedRatePostfix)
      }
    });

    return (
      <ItemSelectionScrollView
        width={this.props.width}
        height={this.props.height}
        style={styles.panelItemSelectionView}
        items={convertedPlaybackSpeedRates}
        selectedItem={selectedLocalizedItem}
        onSelect={(item) => this.onPlaybackSpeedRateSelected(item)}
        config={this.props.config}
        cellType={CELL_TYPES.PLAYBACK_SPEED_RATE}>
      </ItemSelectionScrollView>
    );
  };

  renderPanelsContainerView = () => {
    return(
      <View style={styles.panelItemSelectionContainerView}>
        {this.renderSelectionScrollView()}
      </View>
    );
  };

  render() {
    const animationStyle = {opacity:this.state.opacity};

    return (
      <Animated.View style={[styles.panelContainer, styles.panel, animationStyle, {height: this.props.height, width: this.props.width}]}>
        {this.renderHeaderView()}
        {this.renderPanelsContainerView()}
      </Animated.View>
    );
  }

}

module.exports = PlaybackSpeedPanel;
