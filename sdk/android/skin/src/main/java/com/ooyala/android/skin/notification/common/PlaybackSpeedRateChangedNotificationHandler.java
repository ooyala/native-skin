package com.ooyala.android.skin.notification.common;

import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.BridgeMessageBuilder;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

public class PlaybackSpeedRateChangedNotificationHandler extends OoyalaNotificationHandler {

  public PlaybackSpeedRateChangedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.PLAYBACK_SPEED_RATE_CHANGED;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    WritableMap params = BridgeMessageBuilder.buildPlaybackRateChangedParams(notification.getData());
    layoutController.sendEvent(getNotificationName(), params);
  }
}
