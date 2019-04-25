import PropTypes from 'prop-types';
import React from 'react';
import {
  Animated, Text, TouchableHighlight, View,
} from 'react-native';

import { BUTTON_NAMES, CELL_TYPES } from '../../constants';
import * as Utils from '../../lib/utils';
import ItemSelectionScrollView from '../../shared/ItemSelectionScrollView';

import styles from './AudioAndCcSelectionPanel.styles';

const animationDuration = 1000;

const stringConstants = {
  undefinedLanguageTitle: 'Undefined language',
  noLinguisticContentTitle: 'No linguistic content',
  offButtonTitle: 'Off',
  audioHeaderViewSectionTitle: 'Audio',
  subtitlesHeaderViewSectionTitle: 'Subtitles',
};

export default class AudioAndCcSelectionPanel extends React.Component {
  static propTypes = {
    audioTracksTitles: PropTypes.array,
    selectedAudioTrackTitle: PropTypes.string,
    closedCaptionsLanguages: PropTypes.array,
    selectedClosedCaptionsLanguage: PropTypes.string,
    onSelectAudioTrack: PropTypes.func,
    onSelectClosedCaptions: PropTypes.func,
    onDismiss: PropTypes.func,
    config: PropTypes.object,
  };

  state = {
    opacity: new Animated.Value(0),
  };

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

  onAudioTrackSelected = (name) => {
    const { onSelectAudioTrack, selectedAudioTrackTitle } = this.props;

    if (selectedAudioTrackTitle !== name) {
      onSelectAudioTrack(name);
    }
  };

  onClosedCaptionsLanguageSelected = (name) => {
    const { config, selectedClosedCaptionsLanguage, onSelectClosedCaptions } = this.props;

    const offButtonLocalizedTitle = Utils.localizedString(config.locale, stringConstants.offButtonTitle,
      config.localizableStrings);

    if (name === offButtonLocalizedTitle) {
      onSelectClosedCaptions('');
    } else if (selectedClosedCaptionsLanguage !== name) {
      onSelectClosedCaptions(name);
    }
  };

  onDismissPress = () => {
    const { onDismiss } = this.props;

    onDismiss();
  };

  renderHeaderView = (hasMultiAudioTracks, hasClosedCaptions) => {
    const { config } = this.props;

    let leftTitle;
    let rightTitle;

    const localizedAudioTitle = Utils.localizedString(config.locale,
      stringConstants.audioHeaderViewSectionTitle, config.localizableStrings);
    const localizedSubtitlesTitle = Utils.localizedString(config.locale,
      stringConstants.subtitlesHeaderViewSectionTitle, config.localizableStrings);

    if (hasMultiAudioTracks && hasClosedCaptions) {
      leftTitle = localizedAudioTitle;
      rightTitle = localizedSubtitlesTitle;
    } else if (hasMultiAudioTracks) {
      leftTitle = localizedAudioTitle;
      rightTitle = '';
    } else {
      leftTitle = localizedSubtitlesTitle;
      rightTitle = '';
    }

    const isLeftTitleAccessible = !(leftTitle === '');
    const isRightTitleAccessible = !(rightTitle === '');

    return (
      <View style={styles.panelHeaderView}>
        <View style={styles.panelHeaderViewLeftView}>
          <Text style={[styles.panelHeaderViewLeftText]} accessible={isLeftTitleAccessible}>{leftTitle}</Text>
        </View>
        <View style={styles.panelHeaderViewRightView}>
          <Text style={[styles.panelHeaderViewRightText]} accessible={isRightTitleAccessible}>{rightTitle}</Text>
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
      </View>
    );
  };

  renderAudioSelectionScrollView = () => {
    const { audioTracksTitles, config, selectedAudioTrackTitle } = this.props;

    return (
      <ItemSelectionScrollView
        style={styles.panelItemSelectionView}
        items={audioTracksTitles}
        selectedItem={selectedAudioTrackTitle}
        onSelect={item => this.onAudioTrackSelected(item)}
        config={config}
        cellType={CELL_TYPES.MULTI_AUDIO}
      />
    );
  };

  renderCCSelectionScrollView = () => {
    const { closedCaptionsLanguages, config } = this.props;

    const offButtonTitle = Utils.localizedString(config.locale, stringConstants.offButtonTitle,
      config.localizableStrings);
    let { selectedClosedCaptionsLanguage } = this.props;

    if (typeof closedCaptionsLanguages !== 'undefined') {
      if (!closedCaptionsLanguages || closedCaptionsLanguages[0] !== offButtonTitle) {
        closedCaptionsLanguages.splice(0, 0, offButtonTitle);
      }
    }

    if (!selectedClosedCaptionsLanguage || selectedClosedCaptionsLanguage === offButtonTitle
      || selectedClosedCaptionsLanguage === ''
      || !closedCaptionsLanguages.includes(selectedClosedCaptionsLanguage, 0)) {
      selectedClosedCaptionsLanguage = offButtonTitle;
    }

    return (
      <ItemSelectionScrollView
        style={styles.panelItemSelectionView}
        items={closedCaptionsLanguages}
        selectedItem={selectedClosedCaptionsLanguage}
        onSelect={item => this.onClosedCaptionsLanguageSelected(item)}
        config={config}
        cellType={CELL_TYPES.SUBTITLES}
      />
    );
  };

  renderPanelsContainerView = (hasMultiAudioTracks, hasClosedCaptions) => {
    if (hasMultiAudioTracks && hasClosedCaptions) {
      // Return mixed panels with audio and CC
      return (
        <View style={styles.panelItemSelectionContainerView}>
          {this.renderAudioSelectionScrollView()}
          <View style={styles.panelItemSelectionContainerSeparationView} />
          {this.renderCCSelectionScrollView()}
        </View>
      );
    }
    if (hasMultiAudioTracks) {
      // Return only audio panel
      return (
        <View style={styles.panelItemSelectionContainerView}>
          {this.renderAudioSelectionScrollView()}
        </View>
      );
    }
    // Return only CC panel
    return (
      <View style={styles.panelItemSelectionContainerView}>
        {this.renderCCSelectionScrollView()}
      </View>
    );
  };

  render() {
    const { audioTracksTitles, closedCaptionsLanguages } = this.props;
    const { opacity } = this.state;

    const hasMultiAudioTracks = audioTracksTitles && audioTracksTitles.length > 1;
    const hasClosedCaptions = closedCaptionsLanguages && closedCaptionsLanguages.length > 0;

    return (
      <Animated.View style={[styles.panelContainer, styles.panel, { opacity }]}>
        {this.renderHeaderView(hasMultiAudioTracks, hasClosedCaptions)}
        {this.renderPanelsContainerView(hasMultiAudioTracks, hasClosedCaptions)}
      </Animated.View>
    );
  }
}
