package com.ooyala.android.skin.notification.common;

import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.BridgeMessageBuilder;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

public class PlaybackSpeedEnabledNotificationHandler extends OoyalaNotificationHandler {

  public PlaybackSpeedEnabledNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.PLAYBACK_SPEED_ENABLED;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    WritableMap params = BridgeMessageBuilder.buildPlaybackEnabledParams(notification.getData());
    layoutController.sendEvent(getNotificationName(), params);
  }
}
