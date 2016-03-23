package com.ooyala.android.skin;

import com.facebook.react.bridge.ReadableMap;

/**
 * Methods that handled by the OoyalaReactBridge, whcih need to have parallel methods to be called
 * by the handler of all Bridge events
 */
public interface BridgeEventHandler {

  void onClosedCaptionUpdateRequested(ReadableMap parameters);

  void onPress(ReadableMap parameters);

  void shareTitle(ReadableMap parameters);

  void shareUrl(ReadableMap parameters);

  void onScrub(ReadableMap percentage);

  void onDiscoveryRow(ReadableMap parameters);

  void onLanguageSelected(ReadableMap parameters);

}
