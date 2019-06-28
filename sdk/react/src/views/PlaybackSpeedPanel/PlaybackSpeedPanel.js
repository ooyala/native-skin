// @flow

import React from 'react';
import {
  Animated, Text, TouchableHighlight, View,
} from 'react-native';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';

import { BUTTON_NAMES, CELL_TYPES } from '../../constants';
import * as Utils from '../../lib/utils';
import ItemSelectionScrollView from '../../shared/ItemSelectionScrollView';
import type { Config } from '../../types/Config';

import styles from './PlaybackSpeedPanel.styles';

const animationDuration = 1000;

const constants = {
  headerViewSectionTitle: 'Playback Speed',
  normalPlaybackSpeedRateTitle: 'Normal',
  normalPlaybackSpeedRateValue: 1.0,
  maxPlaybackSpeedRateValue: 2.0,
  minPlaybackSpeedRateValue: 0.5,
  playbackSpeedRatePostfix: 'x',
};

type Props = {
  playbackSpeedRates: Array<string>,
  selectedPlaybackSpeedRate: number,
  onSelectPlaybackSpeedRate: () => void,
  onDismiss: () => void,
  width: number,
  height: number,
  config: Config,
};

type State = {
  opacity: AnimatedValue,
};

export default class PlaybackSpeedPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { opacity } = this.state;

    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: animationDuration,
          delay: 0,
        },
      ),
    ])
      .start();
  }

  onPlaybackSpeedRateSelected = (playbackSpeedRate) => {
    const { config, onSelectPlaybackSpeedRate, selectedPlaybackSpeedRate } = this.props;

    const localizedTitleForNormalPlaybackSpeedRate = Utils.localizedString(config.locale,
      constants.normalPlaybackSpeedRateTitle, config.localizableStrings);
    let originalPlaybackSpeedRate = playbackSpeedRate;

    if (playbackSpeedRate === localizedTitleForNormalPlaybackSpeedRate) {
      originalPlaybackSpeedRate = playbackSpeedRate.replace(
        localizedTitleForNormalPlaybackSpeedRate, constants.normalPlaybackSpeedRateValue,
      );
    } else {
      originalPlaybackSpeedRate = playbackSpeedRate.toString()
        .substring(0, playbackSpeedRate.toString().length - 1);
    }

    if (selectedPlaybackSpeedRate !== originalPlaybackSpeedRate) {
      onSelectPlaybackSpeedRate(originalPlaybackSpeedRate);
    }
  };

  onDismissPress = () => {
    const { onDismiss } = this.props;

    onDismiss();
  };

  renderHeaderView = () => {
    const { config } = this.props;

    const localizedTitle = Utils.localizedString(config.locale, constants.headerViewSectionTitle,
      config.localizableStrings);

    return (
      <View style={styles.panelHeaderView}>
        <Text style={[styles.panelHeaderViewText]}>{localizedTitle}</Text>
        <TouchableHighlight
          style={styles.dismissButton}
          accessible
          accessibilityLabel={BUTTON_NAMES.DISMISS}
          accessibilityComponentType="button"
          underlayColor="transparent" // Can't move this property to json style file because it doesn't works
          onPress={this.onDismissPress}
        >
          <Text style={styles.dismissIcon}>
            {config.icons.dismiss.fontString}
          </Text>
        </TouchableHighlight>
      </View>
    );
  };

  renderSelectionScrollView = () => {
    const {
      config, height, width, playbackSpeedRates, selectedPlaybackSpeedRate,
    } = this.props;

    const localizedTitleForNormalPlaybackSpeedRate = Utils.localizedString(config.locale,
      constants.normalPlaybackSpeedRateTitle, config.localizableStrings);

    // Localize selected item
    let selectedLocalizedItem = selectedPlaybackSpeedRate;

    if (selectedPlaybackSpeedRate === constants.normalPlaybackSpeedRateValue) {
      selectedLocalizedItem = localizedTitleForNormalPlaybackSpeedRate;
    } else {
      const selectedLocalizedItemNumber = parseFloat(String(selectedLocalizedItem));
      const selectedLocalizedItemString = parseFloat(selectedLocalizedItemNumber.toFixed(2));

      selectedLocalizedItem = parseFloat(selectedLocalizedItemString)
        .toString()
        .concat(constants.playbackSpeedRatePostfix);
    }

    // Validate playback speed rates
    const validatedPlaybackSpeedRates = playbackSpeedRates.reduce((result, item) => {
      const number = parseFloat(String(item));

      if (!Number.isNaN(number) && number >= constants.minPlaybackSpeedRateValue && number
        <= constants.maxPlaybackSpeedRateValue) {
        result.push(parseFloat(number.toFixed(2)));
      }

      return result;
    }, []);

    // Add a normal playback speed rate if needed
    if (!validatedPlaybackSpeedRates.includes(constants.normalPlaybackSpeedRateValue)) {
      validatedPlaybackSpeedRates.push(constants.normalPlaybackSpeedRateValue);
    }

    // Sort playback speed rates
    validatedPlaybackSpeedRates.sort((a, b) => a - b);

    // Add postfix for playback speed rates and remove duplicates if needed
    const convertedPlaybackSpeedRates = [...new Set(validatedPlaybackSpeedRates)].map((item) => {
      if (item === constants.normalPlaybackSpeedRateValue) {
        return localizedTitleForNormalPlaybackSpeedRate;
      }

      return item.toString().concat(constants.playbackSpeedRatePostfix);
    });

    return (
      <ItemSelectionScrollView
        width={width}
        height={height}
        style={styles.panelItemSelectionView}
        items={convertedPlaybackSpeedRates}
        selectedItem={selectedLocalizedItem}
        onSelect={item => this.onPlaybackSpeedRateSelected(item)}
        config={config}
        cellType={CELL_TYPES.PLAYBACK_SPEED_RATE}
      />
    );
  };

  renderPanelsContainerView = () => (
    <View style={styles.panelItemSelectionContainerView}>
      {this.renderSelectionScrollView()}
    </View>
  );

  render() {
    const { height, width } = this.props;
    const { opacity } = this.state;

    return (
      <Animated.View style={[
        styles.panelContainer,
        styles.panel,
        {
          height,
          opacity,
          width,
        },
      ]}
      >
        {this.renderHeaderView()}
        {this.renderPanelsContainerView()}
      </Animated.View>
    );
  }
}
