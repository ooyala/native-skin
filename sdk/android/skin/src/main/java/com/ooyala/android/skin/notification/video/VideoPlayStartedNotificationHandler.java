package com.ooyala.android.skin.notification.video;

import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.common.BasePlayStartedNotificationHandler;

public class VideoPlayStartedNotificationHandler extends BasePlayStartedNotificationHandler {

  public VideoPlayStartedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public void handle(OoyalaNotification notification) {
    super.handle(notification);
    layoutController.requestDiscovery();
  }
}
