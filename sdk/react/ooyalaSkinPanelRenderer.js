import React from 'react';
import {
  Platform,
  NativeModules,
} from 'react-native';

import {
  SCREEN_TYPES,
  OVERLAY_TYPES,
  DESIRED_STATES,
  BUTTON_NAMES,
  UI_SIZES,
} from './constants';

import AudioView from './panels/audioView';
import VolumePanel from './panels/VolumePanel';
import Log from './log';
import StartScreen from './panels/StartScreen';
import EndScreen from './panels/EndScreen';
import ErrorScreen from './panels/ErrorScreen';
import DiscoveryPanel from './panels/discoveryPanel';
import MoreOptionScreen from './panels/MoreOptionScreen';
import MoreDetailsScreen from './panels/MoreDetailsScreen';
import VideoView from './panels/videoView';
import AdPlaybackScreen from './panels/adPlaybackScreen';
import AudioAndCCSelectionPanel from './panels/AudioAndCCSelectionPanel';
import PlaybackSpeedPanel from './panels/PlaybackSpeedPanel';
import Utils from './utils';
import CastAirPlayScreen from './panels/CastAirPlayScreen';

import CastConnectingScreen from './panels/cast/CastConnectingScreen';
import CastDevicesScreen from './panels/cast/CastDevicesScreen';
import CastConnectedScreen from './panels/cast/CastConnectedScreen';

const ActivityView = NativeModules.OOActivityView;
const leftMargin = 20;

class OoyalaSkinPanelRenderer {
  constructor(ooyalaSkin, ooyalaCore) {
    Log.log('OoyalaSkinPanelRenderer created');
    this.skin = ooyalaSkin;
    this.core = ooyalaCore;
  }

  renderStartScreen() {
    return (
      <StartScreen
        config={{
          startScreen: this.skin.props.startScreen,
          icons: this.skin.props.icons
        }}
        title={this.skin.state.title}
        description={this.skin.state.description}
        promoUrl={this.skin.state.promoUrl}
        width={this.skin.state.width}
        height={this.skin.state.height}
        playhead={this.skin.state.playhead}
        screenReaderEnabled={this.skin.state.screenReaderEnabled}
        onPress={(name) => this.core.handlePress(name)}>
      </StartScreen>
    );
  }

  renderEndScreen() {
    const ccEnabled =
      this.skin.state.availableClosedCaptionsLanguages &&
      this.skin.state.availableClosedCaptionsLanguages.length > 0;
    return (
      <EndScreen
        config={{
          endScreen: this.skin.props.endScreen,
          controlBar: this.skin.props.controlBar,
          castControls: this.skin.props.castControls,
          castDevicesScreen: this.skin.props.castDevicesScreen,
          buttons: this.skin.props.buttons.mobileContent,
          icons: this.skin.props.icons,
          general: this.skin.props.general
        }}
        title={this.skin.state.title}
        width={this.skin.state.width}
        height={this.skin.state.height}
        volume={this.skin.state.volume}
        onScrub={(value) => this.core.handleScrub(value)}
        handleControlsTouch={() => this.core.handleControlsTouch()}
        fullscreen={this.skin.state.fullscreen}
        upNextDismissed={this.skin.state.upNextDismissed}
        description={this.skin.state.description}
        promoUrl={this.skin.state.promoUrl}
        duration={this.skin.state.duration}
        loading={this.skin.state.loading}
        showAudioAndCCButton={this.skin.state.multiAudioEnabled || ccEnabled}
        onPress={(name) => this.core.handlePress(name)}>
      </EndScreen>
    );
  }

  renderErrorScreen() {
    return (
      <ErrorScreen
        error={this.skin.state.error}
        localizableStrings={this.skin.props.localization}
        locale={this.skin.props.locale}
        isAudioOnly={this.skin.state.screenType === SCREEN_TYPES.ERROR_SCREEN_AUDIO}
        onPress={(name) => this.core.handlePress(name)}>
      </ErrorScreen>
    );
  }

  renderCastAirPlayScreen() {
    const castAirPlayerOffset = 40;
    return (
      <CastAirPlayScreen
        width={this.skin.state.width - castAirPlayerOffset}
        height={UI_SIZES.CAST_AIR_SCREEN_HEIGHT}
        onDismiss={() => this.core.dismissOverlay()}
        onPress={() => this.core.handlePress(BUTTON_NAMES.CAST)}
        config={{
          icons: this.skin.props.icons
        }}>
      </CastAirPlayScreen>
    );
  }

  renderCastDevicesScreen() {
    return (
      <CastDevicesScreen
        height={this.skin.state.height}
        width={this.skin.state.width}
        onDismiss={() => this.core.dismissOverlay()}
        onDeviceSelected={(deviceName, deviceId) => this.core.handleCastDeviceSelected(deviceName, deviceId)}
        config={{
          castDevicesScreen: this.skin.props.castDevicesScreen,
          icons: this.skin.props.icons,
        }}
        deviceIds={this.skin.state.castListIds}
        deviceNames={this.skin.state.castListNames}
        selectedItem={this.skin.state.connectedDeviceName}
      />
    );
  };

  renderCastConnectingScreen() {
    return (
      <CastConnectingScreen
        height={this.skin.state.height}
        width={this.skin.state.width}
        onDisconnect={() => this.core.handleCastDisconnect()}/>
    );
  };

  renderCastConnectedScreen() {
    const playbackSpeedEnabled = false;
    return (
      <CastConnectedScreen
        playhead={this.skin.state.playhead}
        duration={this.skin.state.duration}
        live={this.skin.state.live}
        width={this.skin.state.width}
        height={this.skin.state.height}
        volume={this.skin.state.volume}
        fullscreen={this.skin.state.fullscreen}
        cuePoints={this.skin.state.cuePoints}
        stereoSupported={this.skin.state.stereoSupported}
        multiAudioEnabled={this.skin.state.multiAudioEnabled}
        playbackSpeedEnabled={playbackSpeedEnabled}
        selectedPlaybackSpeedRate={this.skin.state.selectedPlaybackSpeedRate}
        handlers={{
          onSwitch: (isForward) => this.core.handleSwitch(isForward),
          onPress: (value) => this.core.handlePress(value),
          onAdOverlay: (value) => this.core.handleAdOverlayPress(value),
          onAdOverlayDismiss: () => this.core.handleAdOverlayDismiss(),
          onScrub: (value) => this.core.handleScrub(value),
          handleVideoTouchStart: (event) => this.core.handleVideoTouchStart(event),
          handleVideoTouchMove: (event) => this.core.handleVideoTouchMove(event),
          handleVideoTouchEnd: (event) => this.core.handleVideoTouchEnd(event),
          handleControlsTouch: () => this.core.handleControlsTouch(),
          handleShowControls: () => this.core.showControls(),
        }}
        screenReaderEnabled={false}
        availableClosedCaptionsLanguages={this.skin.state.availableClosedCaptionsLanguages}
        config={{
          controlBar: this.skin.props.controlBar,
          general: this.skin.props.general,
          buttons: this.skin.props.buttons.mobileContent,
          upNext: this.skin.props.upNext,
          icons: this.skin.props.icons,
          adScreen: this.skin.props.adScreen,
          live: this.skin.props.live,
          castControls: this.skin.props.castControls,
          castDevicesScreen: this.skin.props.castDevicesScreen,
        }}
        localizableStrings={this.skin.props.localization}
        locale={this.skin.props.locale}
        playing={this.skin.state.desiredState === DESIRED_STATES.DESIRED_PLAY}
        loading={this.skin.state.loading}
        initialPlay={this.skin.state.initialPlay}
        onDisconnect={() => this.core.handleCastDisconnect()}
        deviceName={this.skin.state.connectedDeviceName}
        inCastMode={this.skin.state.inCastMode}
        previewUrl={this.skin.state.previewUrl}
      />
    );
  };


  renderAudioView() {
    let playbackSpeedEnabled = false;
    if (this.skin.props.playbackSpeed && Array.isArray(this.skin.props.playbackSpeed.options)) {
      playbackSpeedEnabled = this.skin.state.playbackSpeedEnabled && this.skin.props.playbackSpeed.options.length > 2;
    }
    return (
      <AudioView
        playhead={this.skin.state.playhead}
        duration={this.skin.state.duration}
        live={this.skin.state.live}
        width={this.skin.state.width}
        height={this.skin.state.height}
        volume={this.skin.state.volume}
        playbackSpeedEnabled={playbackSpeedEnabled}
        selectedPlaybackSpeedRate={this.skin.state.selectedPlaybackSpeedRate}
        handlers={{
          onPress: (value) => this.core.handlePress(value),
          onScrub: (value) => this.core.handleScrub(value),
          handleControlsTouch: () => this.core.handleControlsTouch()
        }}
        config={{
          controlBar: this.skin.props.controlBar,
          castControls: this.skin.props.castControls,
          castDevicesScreen: this.skin.props.castDevicesScreen,
          general: this.skin.props.general,
          buttons: this.skin.props.buttons.audioOnly.mobile,
          upNext: this.skin.props.upNext,
          icons: this.skin.props.icons,
          live: this.skin.props.live,
          skipControls: this.skin.props.skipControls
        }}
        upNextDismissed={this.skin.state.upNextDismissed}
        localizableStrings={this.skin.props.localization}
        locale={this.skin.props.locale}
        playing={this.skin.state.desiredState === DESIRED_STATES.DESIRED_PLAY}
        title={this.skin.state.title}
        description={this.skin.state.description}
        onPlayComplete={this.skin.state.onPlayComplete}>
      </AudioView>
    );
  }

  renderVideoView() {
    let playbackSpeedEnabled = false;
    if (this.skin.props.playbackSpeed && Array.isArray(this.skin.props.playbackSpeed.options)) {
      playbackSpeedEnabled = this.skin.state.playbackSpeedEnabled && this.skin.props.playbackSpeed.options.length > 2;
    }
    return (
      <VideoView
        rate={this.skin.state.rate}
        playhead={this.skin.state.playhead}
        duration={this.skin.state.duration}
        adOverlay={this.skin.state.adOverlay}
        live={this.skin.state.live}
        width={this.skin.state.width}
        height={this.skin.state.height}
        volume={this.skin.state.volume}
        fullscreen={this.skin.state.fullscreen}
        cuePoints={this.skin.state.cuePoints}
        stereoSupported={this.skin.state.stereoSupported}
        multiAudioEnabled={this.skin.state.multiAudioEnabled}
        playbackSpeedEnabled={playbackSpeedEnabled}
        selectedPlaybackSpeedRate={this.skin.state.selectedPlaybackSpeedRate}
        handlers={{
          onPress: (value) => this.core.handlePress(value),
          onAdOverlay: (value) => this.core.handleAdOverlayPress(value),
          onAdOverlayDismiss: () => this.core.handleAdOverlayDismiss(),
          onScrub: (value) => this.core.handleScrub(value),
          handleVideoTouchStart: (event) => this.core.handleVideoTouchStart(event),
          handleVideoTouchMove: (event) => this.core.handleVideoTouchMove(event),
          handleVideoTouchEnd: (event) => this.core.handleVideoTouchEnd(event),
          handleControlsTouch: () => this.core.handleControlsTouch(),
          showControls: () => this.core.showControls()
        }}
        lastPressedTime={this.skin.state.lastPressedTime}
        screenReaderEnabled={this.skin.state.screenReaderEnabled}
        closedCaptionsLanguage={this.skin.state.selectedLanguage}
        // todo: change to boolean showCCButton.
        availableClosedCaptionsLanguages={this.skin.state.availableClosedCaptionsLanguages}
        caption={this.skin.state.caption}
        captionStyles={{
          textSize: this.skin.state.ccTextSize,
          textColor: this.skin.state.ccTextColor,
          fontName: this.skin.state.ccFontName,
          backgroundColor: this.skin.state.ccBackgroundColor,
          textBackgroundColor: this.skin.state.ccTextBackgroundColor,
          backgroundOpacity: this.skin.state.ccBackgroundOpacity,
          edgeType: this.skin.state.ccEdgeType,
          edgeColor: this.skin.state.ccEdgeColor,
        }}
        config={{
          controlBar: this.skin.props.controlBar,
          castControls: this.skin.props.castControls,
          castDevicesScreen: this.skin.props.castDevicesScreen,
          general: this.skin.props.general,
          buttons: this.skin.props.buttons.mobileContent,
          upNext: this.skin.props.upNext,
          icons: this.skin.props.icons,
          adScreen: this.skin.props.adScreen,
          live: this.skin.props.live,
          skipControls: this.skin.props.skipControls,
          ccBackgroundOpacity: this.skin.props.closedCaptionOptions.backgroundOpacity
        }}
        nextVideo={this.skin.state.nextVideo}
        upNextDismissed={this.skin.state.upNextDismissed}
        localizableStrings={this.skin.props.localization}
        locale={this.skin.props.locale}
        playing={this.skin.state.desiredState === DESIRED_STATES.DESIRED_PLAY}
        loading={this.skin.state.loading}
        initialPlay={this.skin.state.initialPlay}>
      </VideoView>
    );
  }

  renderAdPlaybackScreen() {
    return (
      <AdPlaybackScreen
        rate={this.skin.state.rate}
        playhead={this.skin.state.playhead}
        duration={this.skin.state.duration}
        ad={this.skin.state.ad}
        live={this.skin.state.live}
        width={this.skin.state.width}
        height={this.skin.state.height}
        volume={this.skin.state.volume}
        fullscreen={this.skin.state.fullscreen}
        cuePoints={this.skin.state.cuePoints}
        handlers={{
          onPress: (value) => this.core.handlePress(value),
          onIcon: (value) => this.core.handleIconPress(value),
          onScrub: (value) => this.core.handleScrub(value),
          handleVideoTouch: (event) => this.core.handleVideoTouchEnd(event),
          handleControlsTouch: () => this.core.handleControlsTouch()
        }}
        lastPressedTime={this.skin.state.lastPressedTime}
        screenReaderEnabled={this.skin.state.screenReaderEnabled}
        config={{
          controlBar: this.skin.props.controlBar,
          general: this.skin.props.general,
          buttons: this.skin.props.buttons.mobileContent,
          upNext: this.skin.props.upNext,
          icons: this.skin.props.icons,
          adScreen: this.skin.props.adScreen,
          live: this.skin.props.live
        }}
        nextVideo={this.skin.state.nextVideo}
        upNextDismissed={this.skin.state.upNextDismissed}
        localizableStrings={this.skin.props.localization}
        locale={this.skin.props.locale}
        playing={this.skin.state.desiredState === DESIRED_STATES.DESIRED_PLAY}
        loading={this.skin.state.loading}
        initialPlay={this.skin.state.initialPlay}>
      </AdPlaybackScreen>
    );
  }

  renderAudioAndCCSelectionPanel() {
    return (
      <AudioAndCCSelectionPanel
        audioTracksTitles={this.skin.state.audioTracksTitles}
        selectedAudioTrackTitle={this.skin.state.selectedAudioTrack}
        closedCaptionsLanguages={this.skin.state.availableClosedCaptionsLanguages}
        selectedClosedCaptionsLanguage={this.skin.state.selectedLanguage}
        width={this.skin.state.width}
        height={this.skin.state.height}
        onSelectAudioTrack={(value) => this.core.handleAudioTrackSelection(value)}
        onSelectClosedCaptions={(value) => this.core.handleLanguageSelection(value)}
        onDismiss={() => this.core.dismissOverlay()}
        config={{
          localizableStrings: this.skin.props.localization,
          locale: this.skin.props.locale,
          icons: this.skin.props.icons,
          general: this.skin.props.general
        }}>
      </AudioAndCCSelectionPanel>
    );
  }

  renderPlaybackSpeedPanel() {
    let playbackSpeedRates = [];
    if (this.skin.props.playbackSpeed && Array.isArray(this.skin.props.playbackSpeed.options)) {
      playbackSpeedRates = this.skin.props.playbackSpeed.options;
    }

    return (
      <PlaybackSpeedPanel
        playbackSpeedRates={playbackSpeedRates}
        selectedPlaybackSpeedRate={this.skin.state.selectedPlaybackSpeedRate}
        width={this.skin.state.width}
        height={this.skin.state.height}
        onSelectPlaybackSpeedRate={(value) => this.core.handlePlaybackSpeedRateSelection(value)}
        onDismiss={() => this.core.dismissOverlay()}
        config={{
          localizableStrings: this.skin.props.localization,
          locale: this.skin.props.locale,
          icons: this.skin.props.icons,
          general: this.skin.props.general
        }}>
      </PlaybackSpeedPanel>
    );
  }

  renderVolumePanel() {
    return (
      <VolumePanel
        onVolumeChanged={(value) => this.core.onVolumeChanged(value)}
        onDismiss={() => this.core.dismissOverlay()}
        volume={this.skin.state.volume}
        width={this.skin.state.width}
        height={this.skin.state.height}
        config={{
          controlBar: this.skin.props.controlBar,
          icons: this.skin.props.icons
        }}>
      </VolumePanel>
    );
  };

  renderSocialOptions() {
    Platform.select({
      ios: () => ActivityView.show({
        'text': this.skin.state.title,
        'link': this.skin.state.hostedAtUrl,
      }),
      android: () => {
        this.core.bridge.shareTitle({ shareTitle: this.skin.state.title });
        this.core.bridge.shareUrl({ shareUrl: this.skin.state.hostedAtUrl });
        this.core.bridge.onPress({ name: 'Share' });
      }
    })();
  };

  renderDiscoveryPanel() {
    if (this.skin.state.discoveryResults) {
      return (
        <DiscoveryPanel
          config={{
            discoveryScreen: this.skin.props.discoveryScreen,
            icons: this.skin.props.icons,
          }}
          onDismiss={() => this.core.dismissOverlay()}
          localizableStrings={this.skin.props.localization}
          locale={this.skin.props.locale}
          dataSource={this.skin.state.discoveryResults}
          onRowAction={(info) => this.core.emitDiscoveryOptionChosen(info)}
          width={this.skin.state.width}
          height={this.skin.state.height}
          screenType={this.skin.state.screenType}>
        </DiscoveryPanel>
      );
    } else {
      return (
        <DiscoveryPanel
          config={{
            discoveryScreen: this.skin.props.discoveryScreen,
            icons: this.skin.props.icons,
          }}
          localizableStrings={this.skin.props.localization}
          onDismiss={() => this.core.dismissOverlay()}
          dataSource={[]}
          screenType={this.skin.state.screenType}>
        </DiscoveryPanel>
      );
    }
  };

  renderMoreOptionScreen() {
    const isAudioOnlyScreenType = this.skin.state.screenType === SCREEN_TYPES.AUDIO_SCREEN;
    const buttons = isAudioOnlyScreenType ? this.skin.props.buttons.audioOnly.mobile : this.skin.props.buttons.mobileContent;
    const CCEnabled =
      this.skin.state.availableClosedCaptionsLanguages &&
      this.skin.state.availableClosedCaptionsLanguages.length > 0;
    return (
      <MoreOptionScreen
        height={this.skin.state.height}
        onDismiss={() => this.core.dismissOverlay()}
        onOptionButtonPress={(buttonName) => this.core.handleMoreOptionsButtonPress(buttonName)}
        showAudioAndCCButton={this.skin.state.multiAudioEnabled || CCEnabled}
        isAudioOnly={isAudioOnlyScreenType}
        selectedPlaybackSpeedRate={Utils.formattedPlaybackSpeedRate(this.skin.state.selectedPlaybackSpeedRate)}
        config={{
          moreOptionsScreen: this.skin.props.moreOptionsScreen,
          buttons: buttons,
          icons: this.skin.props.icons,
          // TODO: assumes this is how control bar width is calculated everywhere.
          controlBarWidth: this.skin.state.width - 2 * leftMargin
        }}>
      </MoreOptionScreen>
    );
  };

  renderMoreDetailsScreen() {
    return (
      <MoreDetailsScreen
        height={this.skin.state.height}
        width={this.skin.state.width}
        onDismiss={() => this.core.dismissOverlay()}
        config={{
          moreDetailsScreen: this.skin.props.moreOptionsScreen,
          icons: this.skin.props.icons,
        }}
        error={this.skin.state.error}>
      </MoreDetailsScreen>
    );
  };

  renderScreen(overlayType, inAdPod, screenType) {
    if (overlayType) {
      switch (overlayType) {
        case OVERLAY_TYPES.MOREOPTION_SCREEN:
          return this.renderMoreOptionScreen();
        case OVERLAY_TYPES.DISCOVERY_SCREEN:
          return this.renderDiscoveryPanel();
        case OVERLAY_TYPES.AUDIO_AND_CC_SCREEN:
          return this.renderAudioAndCCSelectionPanel();
        case OVERLAY_TYPES.PLAYBACK_SPEED_SCREEN:
          return this.renderPlaybackSpeedPanel();
        case OVERLAY_TYPES.VOLUME_SCREEN:
          return this.renderVolumePanel();
        case OVERLAY_TYPES.MORE_DETAILS:
          return this.renderMoreDetailsScreen();
        case OVERLAY_TYPES.CAST_DEVICES:
          return this.renderCastDevicesScreen();
        case OVERLAY_TYPES.CAST_CONNECTING:
          return this.renderCastConnectingScreen();
        case OVERLAY_TYPES.CAST_DISCONNECTING:
          return this.renderCastDisconnectingScreen();
        case OVERLAY_TYPES.CAST_AIRPLAY:
          return this.renderCastAirPlayScreen();
      }
      return;
    }

    if (inAdPod) {
      return this.renderAdPlaybackScreen();
    }

    switch (screenType) {
      case SCREEN_TYPES.START_SCREEN:
        if (this.skin.state.desiredState != DESIRED_STATES.DESIRED_PLAY) {
          return this.renderStartScreen();
        } else {
          return this.skin.renderLoadingScreen();
        }
      case SCREEN_TYPES.END_SCREEN:
        return this.renderEndScreen();
      case SCREEN_TYPES.LOADING_SCREEN:
        return this.skin.renderLoadingScreen();
      case SCREEN_TYPES.ERROR_SCREEN:
        return this.renderErrorScreen();
      case SCREEN_TYPES.ERROR_SCREEN_AUDIO:
        return this.renderErrorScreen();
      case SCREEN_TYPES.AUDIO_SCREEN:
        return this.renderAudioView();
      default:
        if (this.skin.state.inCastMode) {
          return this.renderCastConnectedScreen();
        } else {
          return this.renderVideoView();
        }
    }
  };
}

module.exports = OoyalaSkinPanelRenderer;
