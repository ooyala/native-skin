package com.ooyala.android.skin.notification.cast;

import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

public class CastModeConnectingNotificationHandler extends OoyalaNotificationHandler {

  public CastModeConnectingNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.CAST_CONNECTING_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    layoutController.sendEvent(getNotificationName(), null);
  }
}
