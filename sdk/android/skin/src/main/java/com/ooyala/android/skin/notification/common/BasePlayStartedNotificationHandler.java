package com.ooyala.android.skin.notification.common;

import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

public abstract class BasePlayStartedNotificationHandler extends OoyalaNotificationHandler {

  public BasePlayStartedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.PLAY_STARTED_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    layoutController.sendEvent(getNotificationName(), null);
  }
}
