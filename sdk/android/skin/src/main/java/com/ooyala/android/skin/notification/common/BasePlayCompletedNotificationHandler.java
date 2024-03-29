package com.ooyala.android.skin.notification.common;

import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.BridgeMessageBuilder;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

public abstract class BasePlayCompletedNotificationHandler extends OoyalaNotificationHandler {

  public BasePlayCompletedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.PLAY_COMPLETED_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    WritableMap params = BridgeMessageBuilder.buildPlayCompletedParams(player);
    layoutController.sendEvent(getNotificationName(), params);
  }
}
