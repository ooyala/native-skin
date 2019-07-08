// @flow

import React from 'react';
import { NativeModules, Platform } from 'react-native';

import {
  BUTTON_NAMES, DESIRED_STATES, OVERLAY_TYPES, SCREEN_TYPES, UI_SIZES,
} from './constants';
import * as Log from './lib/log';
import * as Utils from './lib/utils';

import AdPlaybackScreen from './views/AdPlaybackScreen';
import AudioAndCCSelectionPanel from './views/AudioAndCcSelectionPanel';
import AudioView from './views/AudioView';
import CastAirPlayScreen from './views/CastAirPlayScreen';
import CastConnectedScreen from './views/CastConnectedScreen';
import CastConnectingScreen from './views/CastConnectingScreen';
import CastDevicesScreen from './views/CastDevicesScreen';
import DiscoveryPanel from './views/DiscoveryPanel';
import EndScreen from './views/EndScreen';
import ErrorScreen from './views/ErrorScreen';
import MoreDetailsScreen from './views/MoreDetailsScreen';
import MoreOptionScreen from './views/MoreOptionScreen';
import PlaybackSpeedPanel from './views/PlaybackSpeedPanel';
import StartScreen from './views/StartScreen';
import VideoView from './views/VideoView';
import VolumePanel from './views/VolumePanel';

const ActivityView = NativeModules.OOActivityView;

const leftMargin = 20;

export default class ViewsRenderer {
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
          icons: this.skin.props.icons,
        }}
        title={this.skin.state.title}
        description={this.skin.state.description}
        promoUrl={this.skin.state.promoUrl}
        width={this.skin.state.width}
        height={this.skin.state.height}
        playhead={this.skin.state.playhead}
        screenReaderEnabled={this.skin.state.screenReaderEnabled}
        onPress={name => this.core.handlePress(name)}
      />
    );
  }

  renderEndScreen() {
    const { props, state } = this.skin;
    const ccEnabled = state.availableClosedCaptionsLanguages && state.availableClosedCaptionsLanguages.length > 0;

    return (
      <EndScreen
        config={{
          endScreen: props.endScreen,
          controlBar: props.controlBar,
          castControls: props.castControls,
          buttons: props.buttons.mobileContent,
          icons: props.icons,
          general: props.general,
        }}
        title={state.title}
        width={state.width}
        height={state.height}
        volume={state.volume}
        onScrub={value => this.core.handleScrub(value)}
        handleControlsTouch={() => this.core.handleControlsTouch()}
        fullscreen={state.fullscreen}
        upNextDismissed={state.upNextDismissed}
        description={state.description}
        promoUrl={state.promoUrl}
        duration={state.duration}
        loading={state.loading}
        showAudioAndCCButton={state.multiAudioEnabled || ccEnabled}
        onPress={name => this.core.handlePress(name)}
        markers={state.markers}
      />
    );
  }

  renderErrorScreen() {
    return (
      <ErrorScreen
        error={this.skin.state.error}
        fullscreen={this.skin.state.fullscreen}
        localizableStrings={this.skin.props.localization}
        locale={this.skin.props.locale}
        isAudioOnly={this.skin.state.screenType === SCREEN_TYPES.ERROR_SCREEN_AUDIO}
        onPress={name => this.core.handlePress(name)}
      />
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
          icons: this.skin.props.icons,
        }}
      />
    );
  }

  renderCastDevicesScreen() {
    return (
      <CastDevicesScreen
        height={this.skin.state.height}
        width={this.skin.state.width}
        onDismiss={() => this.core.dismissOverlay()}
        onDeviceSelected={deviceId => this.core.handleCastDeviceSelected(deviceId)}
        config={{
          castControls: this.skin.props.castControls,
          icons: this.skin.props.icons,
        }}
        selectedDeviceId={!this.skin.state.connectedDevice ? '' : this.skin.state.connectedDevice.id}
        devices={this.skin.state.castDevices}
      />
    );
  }

  renderCastConnectingScreen() {
    return (
      <CastConnectingScreen
        height={this.skin.state.height}
        width={this.skin.state.width}
        onDisconnect={() => this.core.handleCastDisconnect()}
      />
    );
  }

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
          onSwitch: isForward => this.core.handleSwitch(isForward),
          onPress: value => this.core.handlePress(value),
          onAdOverlay: value => this.core.handleAdOverlayPress(value),
          onAdOverlayDismiss: () => this.core.handleAdOverlayDismiss(),
          onScrub: value => this.core.handleScrub(value),
          handleVideoTouchStart: event => this.core.handleVideoTouchStart(event),
          handleVideoTouchMove: event => this.core.handleVideoTouchMove(event),
          handleVideoTouchEnd: event => this.core.handleVideoTouchEnd(event),
          handleControlsTouch: () => this.core.handleControlsTouch(),
          handleShowControls: () => this.core.showControls(),
          onControlsVisibilityChanged: isVisible => this.core.onControlsVisibilityChanged(isVisible),
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
        }}
        localizableStrings={this.skin.props.localization}
        locale={this.skin.props.locale}
        playing={this.skin.state.playing}
        loading={this.skin.state.loading}
        initialPlay={this.skin.state.initialPlay}
        onDisconnect={() => this.core.handleCastDisconnect()}
        deviceName={this.skin.state.connectedDevice.title}
        inCastMode={this.skin.state.inCastMode}
        previewUrl={this.skin.state.previewUrl}
        markers={this.skin.state.markers}
        hasNextVideo={Boolean(this.skin.state.nextVideo)}
      />
    );
  }

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
          onPress: value => this.core.handlePress(value),
          onScrub: value => this.core.handleScrub(value),
          handleControlsTouch: () => this.core.handleControlsTouch(),
          onControlsVisibilityChanged: isVisible => this.core.onControlsVisibilityChanged(isVisible),
        }}
        config={{
          controlBar: this.skin.props.controlBar,
          castControls: this.skin.props.castControls,
          general: this.skin.props.general,
          buttons: this.skin.props.buttons.audioOnly.mobile,
          upNext: this.skin.props.upNext,
          icons: this.skin.props.icons,
          live: this.skin.props.live,
          skipControls: this.skin.props.skipControls,
        }}
        upNextDismissed={this.skin.state.upNextDismissed}
        localizableStrings={this.skin.props.localization}
        locale={this.skin.props.locale}
        playing={this.skin.state.desiredState === DESIRED_STATES.DESIRED_PLAY}
        title={this.skin.state.title}
        description={this.skin.state.description}
        onPlayComplete={this.skin.state.onPlayComplete}
      />
    );
  }

  renderVideoView() {
    const { props, state } = this.skin;

    let playbackSpeedEnabled = false;
    if (props.playbackSpeed && Array.isArray(props.playbackSpeed.options)) {
      playbackSpeedEnabled = state.playbackSpeedEnabled && props.playbackSpeed.options.length > 2;
    }

    return (
      <VideoView
        rate={state.rate}
        playhead={state.playhead}
        duration={state.duration}
        adOverlay={state.adOverlay}
        live={state.live}
        width={state.width}
        height={state.height}
        volume={state.volume}
        fullscreen={state.fullscreen}
        isPipActivated={state.isRootPipActivated}
        isPipButtonVisible={state.isRootPipButtonVisible}
        cuePoints={state.cuePoints}
        stereoSupported={state.stereoSupported}
        multiAudioEnabled={state.multiAudioEnabled}
        playbackSpeedEnabled={playbackSpeedEnabled}
        selectedPlaybackSpeedRate={state.selectedPlaybackSpeedRate}
        handlers={{
          onPress: value => this.core.handlePress(value),
          onAdOverlay: value => this.core.handleAdOverlayPress(value),
          onAdOverlayDismiss: () => this.core.handleAdOverlayDismiss(),
          onScrub: value => this.core.handleScrub(value),
          handleVideoTouchStart: event => this.core.handleVideoTouchStart(event),
          handleVideoTouchMove: event => this.core.handleVideoTouchMove(event),
          handleVideoTouchEnd: event => this.core.handleVideoTouchEnd(event),
          handleControlsTouch: () => this.core.handleControlsTouch(),
          showControls: () => this.core.showControls(),
          onControlsVisibilityChanged: isVisible => this.core.onControlsVisibilityChanged(isVisible),
        }}
        lastPressedTime={state.lastPressedTime}
        screenReaderEnabled={state.screenReaderEnabled}
        closedCaptionsLanguage={state.selectedLanguage}
        // TODO: Change to boolean showCCButton.
        availableClosedCaptionsLanguages={state.availableClosedCaptionsLanguages}
        audioTracksTitles={this.skin.state.audioTracksTitles}
        caption={state.caption}
        captionStyles={{
          textSize: state.ccTextSize,
          textColor: state.ccTextColor,
          fontName: state.ccFontName,
          backgroundColor: state.ccBackgroundColor,
          textBackgroundColor: state.ccTextBackgroundColor,
          backgroundOpacity: state.ccBackgroundOpacity,
          edgeType: state.ccEdgeType,
          edgeColor: state.ccEdgeColor,
        }}
        config={{
          controlBar: props.controlBar,
          castControls: props.castControls,
          general: props.general,
          buttons: props.buttons.mobileContent,
          upNext: props.upNext,
          icons: props.icons,
          adScreen: props.adScreen,
          live: props.live,
          skipControls: props.skipControls,
          ccBackgroundOpacity: props.closedCaptionOptions.backgroundOpacity,
        }}
        nextVideo={state.nextVideo}
        upNextDismissed={state.upNextDismissed}
        localizableStrings={props.localization}
        locale={props.locale}
        playing={state.desiredState === DESIRED_STATES.DESIRED_PLAY}
        loading={state.loading}
        initialPlay={state.initialPlay}
        markers={state.markers}
      />
    );
  }

  renderAdPlaybackScreen() {
    const { props, state } = this.skin;

    return (
      <AdPlaybackScreen
        rate={state.rate}
        playhead={state.playhead}
        duration={state.duration}
        ad={state.ad}
        live={state.live}
        width={state.width}
        height={state.height}
        volume={state.volume}
        fullscreen={state.fullscreen}
        cuePoints={state.cuePoints}
        handlers={{
          onPress: value => this.core.handlePress(value),
          onIcon: value => this.core.handleIconPress(value),
          onScrub: value => this.core.handleScrub(value),
          handleVideoTouch: event => this.core.handleVideoTouchEnd(event),
          handleControlsTouch: () => this.core.handleControlsTouch(),
          onControlsVisibilityChanged: isVisible => this.core.onControlsVisibilityChanged(isVisible),
        }}
        lastPressedTime={state.lastPressedTime}
        screenReaderEnabled={state.screenReaderEnabled}
        config={{
          controlBar: props.controlBar,
          general: props.general,
          buttons: props.buttons.mobileContent,
          upNext: props.upNext,
          icons: props.icons,
          adScreen: props.adScreen,
          live: props.live,
        }}
        nextVideo={state.nextVideo}
        upNextDismissed={state.upNextDismissed}
        localizableStrings={props.localization}
        locale={props.locale}
        playing={state.desiredState === DESIRED_STATES.DESIRED_PLAY}
        loading={state.loading}
        initialPlay={state.initialPlay}
        markers={state.markers}
      />
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
        onSelectAudioTrack={value => this.core.handleAudioTrackSelection(value)}
        onSelectClosedCaptions={value => this.core.handleLanguageSelection(value)}
        onDismiss={() => this.core.dismissOverlay()}
        config={{
          localizableStrings: this.skin.props.localization,
          locale: this.skin.props.locale,
          icons: this.skin.props.icons,
          general: this.skin.props.general,
        }}
      />
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
        onSelectPlaybackSpeedRate={value => this.core.handlePlaybackSpeedRateSelection(value)}
        onDismiss={() => this.core.dismissOverlay()}
        config={{
          localizableStrings: this.skin.props.localization,
          locale: this.skin.props.locale,
          icons: this.skin.props.icons,
          general: this.skin.props.general,
        }}
      />
    );
  }

  renderVolumePanel() {
    return (
      <VolumePanel
        onVolumeChanged={value => this.core.onVolumeChanged(value)}
        onDismiss={() => this.core.dismissOverlay()}
        volume={this.skin.state.volume}
        width={this.skin.state.width}
        height={this.skin.state.height}
        config={{
          controlBar: this.skin.props.controlBar,
          icons: this.skin.props.icons,
        }}
      />
    );
  }

  renderSocialOptions() {
    Platform.select({
      ios: () => ActivityView.show({
        text: this.skin.state.title,
        link: this.skin.state.hostedAtUrl,
      }),
      android: () => {
        this.core.bridge.shareTitle({ shareTitle: this.skin.state.title });
        this.core.bridge.shareUrl({ shareUrl: this.skin.state.hostedAtUrl });
        this.core.bridge.onPress({ name: 'Share' });
      },
    })();
  }

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
          onRowAction={info => this.core.emitDiscoveryOptionChosen(info)}
          width={this.skin.state.width}
          height={this.skin.state.height}
          screenType={this.skin.state.screenType}
        />
      );
    }

    return (
      <DiscoveryPanel
        config={{
          discoveryScreen: this.skin.props.discoveryScreen,
          icons: this.skin.props.icons,
        }}
        localizableStrings={this.skin.props.localization}
        onDismiss={() => this.core.dismissOverlay()}
        dataSource={[]}
        screenType={this.skin.state.screenType}
      />
    );
  }

  renderMoreOptionScreen() {
    const isAudioOnlyScreenType = (this.skin.state.screenType === SCREEN_TYPES.AUDIO_SCREEN);

    const buttons = (isAudioOnlyScreenType
      ? this.skin.props.buttons.audioOnly.mobile : this.skin.props.buttons.mobileContent);

    const CCEnabled = (this.skin.state.availableClosedCaptionsLanguages
      && this.skin.state.availableClosedCaptionsLanguages.length > 0);

    return (
      <MoreOptionScreen
        height={this.skin.state.height}
        onDismiss={() => this.core.dismissOverlay()}
        onOptionButtonPress={buttonName => this.core.handleMoreOptionsButtonPress(buttonName)}
        showAudioAndCCButton={this.skin.state.multiAudioEnabled || CCEnabled}
        isAudioOnly={isAudioOnlyScreenType}
        selectedPlaybackSpeedRate={Utils.formattedPlaybackSpeedRate(this.skin.state.selectedPlaybackSpeedRate)}
        config={{
          moreOptionsScreen: this.skin.props.moreOptionsScreen,
          buttons,
          icons: this.skin.props.icons,
          // TODO: Assumes this is how control bar width is calculated everywhere.
          controlBarWidth: this.skin.state.width - 2 * leftMargin,
        }}
      />
    );
  }

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
        error={this.skin.state.error}
      />
    );
  }

  renderScreen(overlayType: ?string, inAdPod: ?boolean, screenType: ?string) {
    // Render overlay view.
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

        case OVERLAY_TYPES.CAST_AIRPLAY:
          return this.renderCastAirPlayScreen();

        default:
          return null;
      }
    }

    // Render ad view.
    if (inAdPod) {
      return this.renderAdPlaybackScreen();
    }

    // Render cast view instead of not listed screens.
    if (this.skin.state.inCastMode
      && screenType !== SCREEN_TYPES.END_SCREEN
      && screenType !== SCREEN_TYPES.ERROR_SCREEN
      && screenType !== SCREEN_TYPES.ERROR_SCREEN_AUDIO
      && screenType !== SCREEN_TYPES.AUDIO_SCREEN) {
      return this.renderCastConnectedScreen();
    }

    // Render basic view eventually.
    switch (screenType) {
      case SCREEN_TYPES.START_SCREEN:
        if (this.skin.state.desiredState !== DESIRED_STATES.DESIRED_PLAY) {
          return this.renderStartScreen();
        }

        return this.skin.renderLoadingScreen();

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
        return this.renderVideoView();
    }
  }
}
