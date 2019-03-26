// @flow
import { Platform } from 'react-native';

import { CONTENT_TYPES, OVERLAY_TYPES, SCREEN_TYPES } from './constants';
import Log from './log';
import { parseInputArray as parseMarkersInputArray } from './src/markers/lib';

/**
 * The OoyalaSkinBridgeListener handles all of the listening of Player events from the Bridge.
 */
export default class OoyalaSkinBridgeListener {
  constructor(ooyalaSkin, ooyalaCore) {
    Log.log('SkinBridgeListener Created');
    this.skin = ooyalaSkin;
    this.core = ooyalaCore;
  }

  mount(eventEmitter) {
    Log.log('SkinBridgeListener Mounted');
    this.listeners = [];
    const listenerDefinitions = [
      { event: 'timeChanged',              action: (event) => this.onTimeChange(event)                  },
      { event: 'seekStarted',              action: (event) => this.onSeekStarted(event)                 },
      { event: 'seekCompleted',            action: (event) => this.onSeekComplete(event)                },
      { event: 'ccStylingChanged',         action: (event) => this.onCcStylingChange(event)             },
      { event: 'currentItemChanged',       action: (event) => this.onCurrentItemChange(event)           },
      { event: 'frameChanged',             action: (event) => this.onFrameChange(event)                 },
      { event: 'fullscreenToggled',        action: (event) => this.onFullscreenToggle(event)            },
      { event: 'volumeChanged',            action: (event) => this.onVolumeChanged(event)               },
      { event: 'playCompleted',            action: (event) => this.onPlayComplete(event)                },
      { event: 'stateChanged',             action: (event) => this.onStateChange(event)                 },
      { event: 'desiredStateChanged',      action: (event) => this.onDesiredStateChange(event)          },
      { event: 'discoveryResultsReceived', action: (event) => this.onDiscoveryResult(event)             },
      { event: 'onClosedCaptionUpdate',    action: (event) => this.onClosedCaptionUpdate(event)         },
      { event: 'adStarted',                action: (event) => this.onAdStarted(event)                   },
      { event: 'adSwitched',               action: (event) => this.onAdSwitched(event)                  },
      { event: 'adPodStarted',             action: (event) => this.onAdPodStarted(event)                },
      { event: 'adPodCompleted',           action: (event) => this.onAdPodCompleted(event)              },
      { event: 'adOverlay',                action: (event) => this.onAdOverlay(event)                   },
      { event: 'adError',                  action: (event) => this.onAdError(event)                     },
      { event: 'setNextVideo',             action: (event) => this.onSetNextVideo(event)                },
      { event: 'upNextDismissed',          action: (event) => this.onUpNextDismissed(event)             },
      { event: 'playStarted',              action: (event) => this.onPlayStarted(event)                 },
      { event: 'error',                    action: (event) => this.onError(event)                       },
      { event: 'embedCodeSet',             action: (event) => this.onEmbedCodeSet(event)                },
      { event: 'controllerKeyPressEvent',  action: (event) => this.onControllerKeyPressed(event)        },
      { event: 'vrContentEvent',           action: (event) => this.handleVideoHasVRContent(event)       },
      { event: 'castDevicesAvailable',     action: (event) => this.handleCastDevicesAvailable(event)    },
      { event: 'castConnected',            action: (event) => this.handleCastConnected(event)           },
      { event: 'castDisconnected',         action: (event) => this.handleCastDisconnected(event)        },
      { event: 'castConnecting',           action: (event) => this.handleCastModeConnecting(event)      },
      { event: 'multiAudioEnabled',        action: (event) => this.handleVideoHasMultiAudio(event)      },
      { event: 'audioTrackChanged',        action: (event) => this.handleAudioTrackChanged(event)       },
      { event: 'playbackSpeedEnabled',     action: (event) => this.handlePlaybackSpeedEnabled(event)    },
      { event: 'playbackSpeedRateChanged', action: (event) => this.handlePlaybackSpeedRateChanged(event)},
      { event: 'pipChanged',               action: (event) => this.onPipToggle(event)},
    ];

    for (let listener of listenerDefinitions) {
      this.listeners.push(eventEmitter.addListener(listener.event, listener.action));
    }
  };

  unmount() {
    for (let listener of this.listeners) {
      listener.remove();
    }
    this.listeners = [];
  };

  onClosedCaptionUpdate(e) {
    this.skin.setState({
      caption: e.text
    });
  };

  onSeekStarted(e) {
    Log.log('onSeekStarted');
    this.skin.setState({
      playhead: e.seekend,
      duration: e.duration
    });
  };

  onSeekComplete(e) {
    Log.log('onSeekComplete');
    if (this.skin.state.screenType != SCREEN_TYPES.END_SCREEN) {
      this.skin.setState({
        playhead: e.seekend,
        duration: e.duration,
        onPlayComplete: Platform.OS === 'ios' ? false : this.skin.state.onPlayComplete,
        screenType: e.screenType
      });
    }
  };

  onTimeChange(e) { // todo: naming consistency? playheadUpdate vs. onTimeChange vs. ...
    this.skin.setState({
      playhead: e.playhead,
      duration: e.duration,
      initialPlay: false,
      availableClosedCaptionsLanguages: e.availableClosedCaptionsLanguages,
      cuePoints: e.cuePoints
    });

    if (this.skin.state.screenType == SCREEN_TYPES.VIDEO_SCREEN ||
      this.skin.state.screenType == SCREEN_TYPES.AUDIO_SCREEN ||
      this.skin.state.screenType == SCREEN_TYPES.END_SCREEN) {
      this.core.previousScreenType = this.skin.state.screenType;
    }
  };

  onAdStarted(e) {
    Log.log('onAdStarted');
    Log.assertTrue(this.skin.inAdPod == true, 'AdStarted, but we did not know we were in Ad Pod');
    Log.log(e);
    this.skin.setState({
      ad: e,
      screenType: this.skin.state.contentType == CONTENT_TYPES.AUDIO ?
        SCREEN_TYPES.AUDIO_SCREEN : SCREEN_TYPES.VIDEO_SCREEN,
      adOverlay: null,
      onPlayComplete: false
    });
    this.core.clearOverlayStack();
  };

  onCcStylingChange(e) {
    Log.log('onCcStylingChange');
    this.skin.setState({
      ccTextSize: e.textSize,
      ccFontName: e.fontName,
      ccTextColor: e.textColor,
      ccBackgroundColor: e.backgroundColor,
      ccTextBackgroundColor: e.textBackgroundColor,
      ccBackgroundOpacity: e.backgroundOpacity,
      ccEdgeType: e.edgeType,
      ccEdgeColor: e.edgeColor
    });
  };

  onAdSwitched(e) {
    Log.log('onAdSwitched');
    this.skin.setState({
      ad: e
    });
  };

  onAdPodStarted(e) {
    Log.log('AdPodStarted');
    Log.assertTrue(this.skin.inAdPod == false, 'AdPodStarted, but we were already in an Ad Pod');
    this.skin.setState({
      inAdPod: true
    });
  };

  onAdPodCompleted(e) {
    Log.log('onAdPodCompleted');
    Log.assertTrue(this.skin.inAdPod == true, 'AdPodCompleted, but we did not know we were in Ad Pod');
    Log.assertTrue(this.skin.ad != null, 'AdPodCompleted, but Ad was not null.  Was there an Ad Ended event?');
    this.skin.setState({
      inAdPod: false,
      ad: null,
      playhead: e.playhead,
      duration: e.duration
    });
  };

  onAdOverlay(e) {
    Log.log('onAdOverlay');
    this.skin.setState({
      adOverlay: e
    });
  }

  onAdError(e) {
    Log.log('onAdError');
    this.skin.setState({
      ad: null
    });
  };

  onCurrentItemChange(e) {
    Log.log('currentItemChangeReceived, promoUrl is ' + e.promoUrl);
    this.skin.setState({
      title: e.title,
      description: e.description,
      duration: e.duration,
      live: e.live,
      promoUrl: e.promoUrl,
      hostedAtUrl: e.hostedAtUrl,
      playhead: e.playhead,
      width: e.width,
      height: e.height,
      volume: e.volume,
      caption: null,
      availableClosedCaptionsLanguages: e.availableClosedCaptionsLanguages,
      contentType: e.contentType,
      markers: parseMarkersInputArray(e.markers),
    });

    if (!this.skin.state.autoPlay) {
      this.skin.setState({
        screenType: SCREEN_TYPES.START_SCREEN
      });
    };

    this.core.clearOverlayStack();
  };

  onFrameChange(e) {
    Log.log('Received frameChange, frame width is ' + e.width + ' height is ' + e.height);
    this.skin.setState({
      width: e.width,
      height: e.height,
      fullscreen: e.fullscreen
    });
  };

  onFullscreenToggle(e) {
    Log.log('Received fullscreenToggle: ' + e.fullscreen);
    this.skin.setState({
      fullscreen: e.fullscreen
    });
  };

  onPlayStarted(e) {
    Log.log('Play Started received');
    this.skin.setState({
      screenType: this.skin.state.contentType == CONTENT_TYPES.AUDIO ?
        SCREEN_TYPES.AUDIO_SCREEN : SCREEN_TYPES.VIDEO_SCREEN,
      autoPlay: false,
      onPlayComplete: false,
      isRootPipButtonVisible: e === null ? false : e.isPipButtonVisible,
    });
  };

  onPlayComplete(e) {
    Log.log('Play Complete received: upNext dismissed: ' + this.skin.state.upNextDismissed);
    this.skin.setState({
      playing: false,
      screenType: this.skin.state.contentType == CONTENT_TYPES.AUDIO ?
        SCREEN_TYPES.AUDIO_SCREEN : SCREEN_TYPES.END_SCREEN,
      onPlayComplete: true
    });

    if (this.core.shouldShowDiscoveryEndscreen()) {
      this.core.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.DISCOVERY_SCREEN);
    }
  };

  onDiscoveryResult(e) {
    Log.log('onDiscoveryResult results are: ', e.results);
    this.skin.setState({
      discoveryResults: e.results
    });
    if (e.results) {
      this.onSetNextVideo({ nextVideo: e.results[0] })
    }
  };

  onStateChange(e) {
    Log.log('state changed to: ' + e.state)
    switch (e.state) {
      case 'completed':
      case 'error':
      case 'init':
      case 'paused':
      case 'suspended':
      case 'ready':
        this.skin.setState({
          playing: false,
          loading: false
        });
        break;
      case 'playing':
        this.skin.setState({
          playing: true,
          loading: false,
          initialPlay: this.skin.state.screenType == SCREEN_TYPES.START_SCREEN,
          screenType: this.skin.state.contentType == CONTENT_TYPES.AUDIO ?
            SCREEN_TYPES.AUDIO_SCREEN : SCREEN_TYPES.VIDEO_SCREEN,
          onPlayComplete: false
        });
        break;
      case 'loading':
        this.skin.setState({
          loading: true
        });
        break;
      default:
        break;
    }
  };

  onDesiredStateChange(e) {
    Log.log('Desired state change received: ' + e.desiredState);
    this.skin.setState({
      desiredState: e.desiredState
    });
  };

  onError(e) {
    Log.log('Error received');
    this.skin.setState({
      screenType: e.screenType == SCREEN_TYPES.AUDIO_SCREEN ?
        SCREEN_TYPES.ERROR_SCREEN_AUDIO : SCREEN_TYPES.ERROR_SCREEN,
      error: e
    });
  };

  onEmbedCodeSet(e) {
    Log.log('EmbedCodeSet received');
    this.skin.setState({
      screenType: SCREEN_TYPES.LOADING_SCREEN,
      ad: null
    });
  };

  onUpNextDismissed(e) {
    Log.log('SetNextVideo received');
    this.skin.setState({
      upNextDismissed: e.upNextDismissed
    });
  };

  onSetNextVideo(e) {
    Log.log('SetNextVideo received');
    this.skin.setState({
      nextVideo: e.nextVideo
    });
  };

  onVolumeChanged(e) {
    this.skin.setState({
      volume: e.volume
    });
  };

  onControllerKeyPressed(e) {
    Log.log('Controller event received');
    this.core.handleControlsTouch();
  };

  onPipToggle(e) {
    Log.log("Received PiP Toggle: " + e.isPipActivated /*+ e.isPipButtonVisible*/);
    this.skin.setState({
      isRootPipActivated: e.isPipActivated
    });
  };

  handleVideoHasVRContent(e) {
    this.skin.setState({
      vrContent: e.vrContent,
      stereoSupported: e.stereoSupported
    });
  };

  handleVideoHasMultiAudio(e) {
    Log.log('Video has multi audio received: ' + e.multiAudioEnabled +
      ' titles: ' + e.audioTracksTitles + ' selectedTrack: ' + e.selectedAudioTrack);
    this.skin.setState({
      multiAudioEnabled: e.multiAudioEnabled,
      audioTracksTitles: e.audioTracksTitles,
      selectedAudioTrack: e.selectedAudioTrack
    });
  };

  handleCastDevicesAvailable(e) {
    this.skin.setState({
      castListIds: e.castDeviceIds,
      castListNames: e.castDeviceNames
    });
  };


  handleCastConnected(e) {
    this.core.clearOverlayStack();
    this.skin.setState({
      connectedDeviceName: e.connectedDeviceName,
      inCastMode: true,
      playing: e.state === "PLAYING",
      loading: false,
      initialPlay: this.skin.state.screenType == SCREEN_TYPES.START_SCREEN,
      screenType: this.skin.state.contentType == CONTENT_TYPES.AUDIO ?
        SCREEN_TYPES.AUDIO_SCREEN : SCREEN_TYPES.VIDEO_SCREEN,
      onPlayComplete: false,
      previewUrl: e.previewUrl,
    });
  };

  handleCastDisconnected(e) {
    this.core.popFromOverlayStackAndMaybeResume({});
    this.skin.setState({
      inCastMode: false,
      connectedDeviceName: null,
    });
  };

  handleCastModeConnecting(e) {
    this.core.pushToOverlayStackAndMaybePause(OVERLAY_TYPES.CAST_CONNECTING);
  };

  handleAudioTrackChanged(e) {
    Log.log('Audio track changed received: ' + e.selectedAudioTrack);
    this.skin.setState({
      selectedAudioTrack: e.selectedAudioTrack
    });
  };

  handlePlaybackSpeedEnabled(e) {
    Log.log('Video playback speed enabled: ' + e.playbackSpeedEnabled +
      ' selectedPlaybackSpeedRate: ' + e.selectedPlaybackSpeedRate);
    this.skin.setState({
      playbackSpeedEnabled: e.playbackSpeedEnabled,
      selectedPlaybackSpeedRate: parseFloat(e.selectedPlaybackSpeedRate)
    });
  };

  handlePlaybackSpeedRateChanged(e) {
    Log.log('Playback speed rate changed received:' + e.selectedPlaybackSpeedRate);
    this.skin.setState({
      selectedPlaybackSpeedRate: parseFloat(e.selectedPlaybackSpeedRate)
    });
  };
}
