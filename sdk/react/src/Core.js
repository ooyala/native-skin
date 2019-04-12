import {
  AUTOHIDE_DELAY, BUTTON_NAMES, MAX_DATE_VALUE, OVERLAY_TYPES,
} from './constants';
import Log from './lib/log';
import BridgeListener from './BridgeListener';
import ViewsRenderer from './ViewsRenderer';

const clickRadius = 5;
let startedClickX;
let startedClickY;

export default class Core {
  constructor(ooyalaSkin, eventBridge) {
    this.skin = ooyalaSkin;
    this.bridge = eventBridge;
    this.ooyalaSkinBridgeListener = new BridgeListener(ooyalaSkin, this);
    this.ooyalaSkinPanelRenderer = new ViewsRenderer(ooyalaSkin, this);
  }

  mount(eventEmitter) {
    this.ooyalaSkinBridgeListener.mount(eventEmitter);
    this.bridge.onMounted();
  }

  unmount() {
    this.ooyalaSkinBridgeListener.unmount();
  }

  emitDiscoveryOptionChosen(info) {
    this.bridge.onDiscoveryRow(info);
  }

  dismissOverlay() {
    Log.log('On Overlay Dismissed');
    this.popFromOverlayStackAndMaybeResume();
  }

  onBackPressed() {
    const retVal = this.popFromOverlayStackAndMaybeResume();
    return retVal;
  }

  handleLanguageSelection(e) {
    Log.log(`onLanguageSelected: ${e}`);
    this.skin.setState({
      selectedLanguage: e,
    });
    this.bridge.onLanguageSelected({ language: e });
  }

  handleAudioTrackSelection(e) {
    Log.log(`onAudioTrackSelected: ${e}`);
    this.skin.setState({
      selectedAudioTrack: e,
    });
    this.bridge.onAudioTrackSelected({ audioTrack: e });
  }

  handlePlaybackSpeedRateSelection(e) {
    Log.log(`onPlaybackSpeedRateSelected: ${e}`);
    this.skin.setState({
      selectedPlaybackSpeedRate: parseFloat(e),
    });
    this.bridge.onPlaybackSpeedRateSelected({ playbackSpeedRate: e });
  }

  onVolumeChanged(volume) {
    Log.log(`onVolumeChanged: ${volume}`);
    this.bridge.onVolumeChanged({ volume });
  }

  // event handlers.
  handleMoreOptionsButtonPress(buttonName) {
    switch (buttonName) {
      case BUTTON_NAMES.DISCOVERY:
        this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.DISCOVERY_SCREEN);
        break;
      case BUTTON_NAMES.SHARE:
        this.ooyalaSkinPanelRenderer.renderSocialOptions();
        break;
      case BUTTON_NAMES.QUALITY:
        break;
      case BUTTON_NAMES.SETTING:
        break;
      case BUTTON_NAMES.AUDIO_AND_CC:
        this.pushToOverlayStack(OVERLAY_TYPES.AUDIO_AND_CC_SCREEN);
        break;
      case BUTTON_NAMES.PLAYBACK_SPEED:
        this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.PLAYBACK_SPEED_SCREEN);
        break;
      case BUTTON_NAMES.FULLSCREEN:
        this.bridge.onPress({ name: buttonName });
        this.dismissOverlay();
        break;
      default:
        this.bridge.onPress({ name: buttonName });
        break;
    }
  }

  /**
   *  When a button is pressed on the control bar
   *  If it's a 'fast-access' options button, open options menu and perform the options action
   */
  handlePress(buttonName) {
    switch (buttonName) {
      case BUTTON_NAMES.MORE:
        this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.MOREOPTION_SCREEN);
        break;
      case BUTTON_NAMES.DISCOVERY:
        this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.DISCOVERY_SCREEN);
        break;
      case BUTTON_NAMES.AUDIO_AND_CC:
        this.pushToOverlayStack(OVERLAY_TYPES.AUDIO_AND_CC_SCREEN);
        break;
      case BUTTON_NAMES.PLAYBACK_SPEED:
        this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.PLAYBACK_SPEED_SCREEN);
        break;
      case BUTTON_NAMES.SHARE:
        this.ooyalaSkinPanelRenderer.renderSocialOptions();
        break;
      case BUTTON_NAMES.QUALITY:
      case BUTTON_NAMES.SETTING:
        break;
      case BUTTON_NAMES.VOLUME:
        this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.VOLUME_SCREEN);
        break;
      case BUTTON_NAMES.MORE_DETAILS:
        this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.MORE_DETAILS);
        break;
      case BUTTON_NAMES.CAST:
        this.pushToOverlayStack(OVERLAY_TYPES.CAST_DEVICES);
        break;
      case BUTTON_NAMES.CAST_AIRPLAY:
        this.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.CAST_AIRPLAY);
        break;
      default:
        Log.log('handlePress button name:', buttonName);
        this.bridge.onPress({ name: buttonName });
        break;
    }
  }

  handleScrub(value) {
    this.bridge.onScrub({ percentage: value });
  }

  handleSwitch(isForward) {
    this.bridge.onSwitch({ direction: isForward });
  }

  handleIconPress(index) {
    this.bridge.onPress({
      name: BUTTON_NAMES.AD_ICON,
      index,
    });
  }

  handleAdOverlayPress(clickUrl) {
    this.bridge.onPress({
      name: BUTTON_NAMES.AD_OVERLAY,
      clickUrl,
    });
  }

  handleAdOverlayDismiss() {
    this.skin.setState({
      adOverlay: null,
    });
  }

  shouldShowLandscape() {
    return this.skin.state.width > this.skin.state.height;
  }

  shouldShowDiscoveryEndscreen() {
    const endScreenConfig = this.skin.props.endScreen || {};
    const upNextConfig = this.skin.props.upNext || {};

    // Only care if discovery on endScreen should be shown
    if (endScreenConfig.screenToShowOnEnd !== 'discovery') {
      return false;
    }

    // player didn't show upNext so show discovery
    // first we ask if showUpNext is part of the config, if not
    // we can assume showUpNext didn't show
    if (!upNextConfig.showUpNext || upNextConfig.showUpNext === false) {
      return true;
    }

    // player showed and closed the upNext widget
    if (this.skin.state.upNextDismissed) {
      return true;
    }

    // any other case
    return false;
  }

  /*
   * This could either reset the lastPressedTime, or zero it to force the hide
   */

  showControls() {
    const isPastAutoHideTime = (new Date()).getTime() - this.skin.state.lastPressedTime > AUTOHIDE_DELAY;
    if (isPastAutoHideTime) {
      this.handleControlsTouch();
    } else {
      Log.verbose('handleVideoTouch - Time Zeroed');
      this.skin.setState({
        lastPressedTime: new Date(0),
      });
    }
  }

  handleVideoTouchStart(event) {
    if (this.skin.state.vrContent) {
      startedClickX = event.nativeEvent.pageX;
      startedClickY = event.nativeEvent.pageY;

      this.bridge.handleTouchStart({
        x_location: event.nativeEvent.pageX,
        y_location: event.nativeEvent.pageY,
        touchTime: event.nativeEvent.timestamp,
        isClicked: false,
      });
    }
  }

  handleVideoTouchMove(event) {
    if (this.skin.state.vrContent) {
      this.bridge.handleTouchMove({
        x_location: event.nativeEvent.pageX,
        y_location: event.nativeEvent.pageY,
        touchTime: event.nativeEvent.timestamp,
        isClicked: false,
      });
    }
  }

  handleCastDeviceSelected(deviceId) {
    this.bridge.onCastDeviceSelected(deviceId);
  }

  handleCastDisconnect() {
    this.bridge.onCastDisconnectPressed();
  }

  handleVideoTouchEnd(event) {
    // return boolean -> touch end was in clickRadius from touch start
    const isClick = function isClick(endX, endY) {
      return Math.sqrt((endX - startedClickX) * (endX - startedClickX)
        + (endY - startedClickY) * (endY - startedClickY)) < clickRadius;
    };

    if (this.skin.state.vrContent && event) {
      const isClicked = isClick(event.nativeEvent.pageX, event.nativeEvent.pageY);
      if (isClicked) {
        this.showControls();
      }
      this.bridge.handleTouchEnd({
        x_location: event.nativeEvent.pageX,
        y_location: event.nativeEvent.pageY,
        touchTime: event.nativeEvent.timestamp,
        isClicked,
      });
    } else {
      this.showControls();
    }
  }

  /*
   * Hard reset lastPressedTime, either due to button press or otherwise
   */
  handleControlsTouch() {
    if (!this.skin.state.screenReaderEnabled && this.skin.props.controlBar.autoHide === true) {
      Log.verbose('handleVideoTouch - Time set');
      this.skin.setState({
        lastPressedTime: new Date(),
      });
    } else {
      Log.verbose('handleVideoTouch infinite time');
      this.skin.setState({
        lastPressedTime: new Date(MAX_DATE_VALUE),
      });
    }
  }

  pushToOverlayStackAndMaybePause(overlay) {
    if (this.skin.state.overlayStack.length === 0 && this.skin.state.playing) {
      Log.log('New stack of overlays, pausing');
      this.skin.setState({
        pausedByOverlay: true,
      });
      this.bridge.onPress({ name: BUTTON_NAMES.PLAY_PAUSE });
    }
    this.pushToOverlayStack(overlay);
  }

  pushToOverlayStack(overlay) {
    const retVal = this.skin.state.overlayStack.push(overlay);
    this.skin.forceUpdate();
    return retVal;
  }

  clearOverlayStack() {
    this.skin.setState({
      overlayStack: [],
    });
  }

  popFromOverlayStackAndMaybeResume() {
    const retVal = this.skin.state.overlayStack.pop();
    if (this.skin.state.overlayStack.length === 0 && this.skin.state.pausedByOverlay) {
      Log.log('Emptied stack of overlays, resuming');
      this.skin.setState({
        pausedByOverlay: false,
      });
      this.bridge.onPress({ name: BUTTON_NAMES.PLAY_PAUSE });
    }
    this.skin.forceUpdate();
    return retVal;
  }

  renderScreen() {
    Log.verbose(`Rendering - Current Overlay stack: ${this.skin.state.overlayStack}`);
    let overlayType;
    if (this.skin.state.overlayStack.length > 0) {
      overlayType = this.skin.state.overlayStack[this.skin.state.overlayStack.length - 1];
      Log.verbose(`Rendering Overlaytype: ${overlayType}`);
    } else {
      Log.verbose(`Rendering screentype: ${this.skin.state.screenType}`);
    }

    return this.ooyalaSkinPanelRenderer.renderScreen(overlayType, this.skin.state.inAdPod, this.skin.state.screenType);
  }
}
