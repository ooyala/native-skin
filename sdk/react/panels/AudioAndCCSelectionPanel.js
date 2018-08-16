'use strict';

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
import PropTypes from 'prop-types';

import React from 'react';
import {
  Animated,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

const animationDuration = 1000;
const Constants = require('../constants');
const {
  BUTTON_NAMES,
  CELL_TYPES
} = Constants;

const Utils = require('../utils');
const styles = require('../utils').getStyles(require('./style/AudioAndCCSelectionPanel'));
const ItemSelectionScrollView = require('./ItemSelectionScrollView');

const stringConstants = {
  undefinedLanguageTitle: "Undefined language",
  noLinguisticContentTitle: "No linguistic content",
  offButtonTitle: "Off",
  audioHeaderViewSectionTitle: "Audio",
  subtitlesHeaderViewSectionTitle: "Subtitles"
}

class AudioAndCCSelectionPanel extends React.Component {
  static propTypes = {
    audioTracksTitles: PropTypes.array,
    selectedAudioTrackTitle: PropTypes.string,
    closedCaptionsLanguages: PropTypes.array,
    selectedClosedCaptionsLanguage: PropTypes.string,
    onSelectAudioTrack: PropTypes.func,
    onSelectClosedCaptions: PropTypes.func,
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


  onAudioTrackSelected = (name) => {
    const localizedTitleForUndefinedLanguage = Utils.localizedString(this.props.config.locale, stringConstants.undefinedLanguageTitle, this.props.config.localizableStrings);
    const localizedTitleForNoLinguisticContent = Utils.localizedString(this.props.config.locale, stringConstants.noLinguisticContentTitle, this.props.config.localizableStrings);
    let originalName = name;

    originalName = originalName.replace(localizedTitleForUndefinedLanguage, stringConstants.undefinedLanguageTitle);
    originalName = originalName.replace(localizedTitleForNoLinguisticContent, stringConstants.noLinguisticContentTitle);

    if (this.props.selectedAudioTrackTitle !== originalName) {
      this.props.onSelectAudioTrack(originalName);
    }
  };


  onClosedCaptionsLanguageSelected = (name) => {
    const offButtonLocalizedTitle = Utils.localizedString(this.props.config.locale, stringConstants.offButtonTitle, this.props.config.localizableStrings);

    if (name === offButtonLocalizedTitle) {
      this.props.onSelectClosedCaptions("");
    } else if (this.props.selectedClosedCaptionsLanguage !== name) {
      this.props.onSelectClosedCaptions(name);
    }
  };

  onDismissPress = () => {
    this.props.onDismiss();
  };

  renderHeaderView = (hasMultiAudioTracks, hasClosedCaptions) => {
    let leftTitle;
    let rightTitle;

    const localizedAudioTitle = Utils.localizedString(this.props.config.locale, stringConstants.audioHeaderViewSectionTitle, this.props.config.localizableStrings);
    const localizedSubtitlesTitle = Utils.localizedString(this.props.config.locale, stringConstants.subtitlesHeaderViewSectionTitle, this.props.config.localizableStrings);

    if (hasMultiAudioTracks && hasClosedCaptions) {
       leftTitle = localizedAudioTitle;
       rightTitle = localizedSubtitlesTitle;
    } else if (hasMultiAudioTracks) {
      leftTitle = localizedAudioTitle;
      rightTitle = "";
    } else {
      leftTitle = localizedSubtitlesTitle;
      rightTitle = "";
    }

    return (
      <View style={styles.panelHeaderView}>
        <View style={styles.panelHeaderViewLeftView}>
          <Text style={[styles.panelHeaderViewLeftText]}>{leftTitle}</Text>
        </View>
        <View style={styles.panelHeaderViewRightView}>
          <Text style={[styles.panelHeaderViewRightText]}>{rightTitle}</Text>
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
      </View>
    );
  };

  renderAudioSelectionScrollView = () => {
    const localizedTitleForUndefinedLanguage = Utils.localizedString(this.props.config.locale, stringConstants.undefinedLanguageTitle, this.props.config.localizableStrings);
    const localizedTitleForNoLinguisticContent = Utils.localizedString(this.props.config.locale, stringConstants.noLinguisticContentTitle, this.props.config.localizableStrings);

    // Localize selected item

    let selectedLocalizedItem = this.props.selectedAudioTrackTitle;
    if (selectedLocalizedItem !== undefined) {
      selectedLocalizedItem = selectedLocalizedItem.replace(stringConstants.undefinedLanguageTitle, localizedTitleForUndefinedLanguage);
      selectedLocalizedItem = selectedLocalizedItem.replace(stringConstants.noLinguisticContentTitle, localizedTitleForUndefinedLanguage);
    }

    // Localize other items

    const itemsWithLocalizedUndefinedLanguage = this.props.audioTracksTitles.map(function(item) {
      let localizedItem = item;

      localizedItem = localizedItem.replace(stringConstants.undefinedLanguageTitle, localizedTitleForUndefinedLanguage);
      localizedItem = localizedItem.replace(stringConstants.noLinguisticContentTitle, localizedTitleForNoLinguisticContent);

      return localizedItem;
    });

    return (
      <ItemSelectionScrollView
        style={styles.panelItemSelectionView}
        items={itemsWithLocalizedUndefinedLanguage}
        selectedItem={selectedLocalizedItem}
        onSelect={(item) => this.onAudioTrackSelected(item)}
        config={this.props.config}
        cellType={CELL_TYPES.MULTI_AUDIO}>
      </ItemSelectionScrollView>
    );
  };

  renderCCSelectionScrollView = () => {
    const offButtonTitle = Utils.localizedString(this.props.config.locale, stringConstants.offButtonTitle, this.props.config.localizableStrings);
    let selectedClosedCaptionsLanguage = this.props.selectedClosedCaptionsLanguage;
    if (typeof(this.props.closedCaptionsLanguages) !== "undefined") {
      if (!this.props.closedCaptionsLanguages || this.props.closedCaptionsLanguages[0] !== offButtonTitle) {
        this.props.closedCaptionsLanguages.splice(0, 0, offButtonTitle)
      }
    }

    if (!selectedClosedCaptionsLanguage || selectedClosedCaptionsLanguage === offButtonTitle || selectedClosedCaptionsLanguage === "") {
      selectedClosedCaptionsLanguage = offButtonTitle;
    }

    return (
      <ItemSelectionScrollView
        style={styles.panelItemSelectionView}
        items={this.props.closedCaptionsLanguages}
        selectedItem={selectedClosedCaptionsLanguage}
        onSelect={(item) => this.onClosedCaptionsLanguageSelected(item)}
        config={this.props.config}
        cellType={CELL_TYPES.SUBTITLES}>
      </ItemSelectionScrollView>
    );
  };

  renderPanelsContainerView = (hasMultiAudioTracks, hasClosedCaptions) => {
    if (hasMultiAudioTracks && hasClosedCaptions) {
      // Return mixed panels with audio and CC
      return (
        <View style={styles.panelItemSelectionContainerView}>
          {this.renderAudioSelectionScrollView()}
          <View style={styles.panelItemSelectionContainerSeparationView}/>
          {this.renderCCSelectionScrollView()}
        </View>
      );
    } else if (hasMultiAudioTracks) {
      // Return only audio panel
      return (
        <View style={styles.panelItemSelectionContainerView}>
          {this.renderAudioSelectionScrollView()}
        </View>
      );
    } else {
      // Return only CC panel
      return (
        <View style={styles.panelItemSelectionContainerView}>
          {this.renderCCSelectionScrollView()}
        </View>
      );
    }
  };

  render() {
    const hasMultiAudioTracks = this.props.audioTracksTitles && this.props.audioTracksTitles.length > 1;
    const hasClosedCaptions = this.props.closedCaptionsLanguages && this.props.closedCaptionsLanguages.length > 0;
    const animationStyle = {opacity:this.state.opacity};

    return (
      <Animated.View style={[styles.panelContainer, styles.panel, animationStyle]}>
        {this.renderHeaderView(hasMultiAudioTracks, hasClosedCaptions)}
        {this.renderPanelsContainerView(hasMultiAudioTracks, hasClosedCaptions)}
      </Animated.View>
    );
  }
}

module.exports = AudioAndCCSelectionPanel;
