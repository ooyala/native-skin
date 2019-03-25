package com.ooyala.android.skin;

import com.facebook.react.bridge.ReadableMap;

/**
 * Methods that handled by the OoyalaReactBridge, whcih need to have parallel methods to be called
 * by the handler of all Bridge events
 */
public interface BridgeEventHandler {

  void onMounted();

  void onPress(ReadableMap parameters);

  void shareTitle(ReadableMap parameters);

  void shareUrl(ReadableMap parameters);

  void onScrub(ReadableMap percentage);

  void onSwitch(ReadableMap isForward);

  void onDiscoveryRow(ReadableMap parameters);

  void onLanguageSelected(ReadableMap parameters);

  void onCastDeviceSelected(ReadableMap parameters);

  void onCastDisconnectPressed();

  void handleTouchStart(ReadableMap parameters);

  void handleTouchMove(ReadableMap parameters);

  void handleTouchEnd(ReadableMap parameters);

  void onAudioTrackSelected(ReadableMap parameters);

  void onPlaybackSpeedRateSelected(ReadableMap parameters);

  void onVolumeChanged(ReadableMap parameters);
}
