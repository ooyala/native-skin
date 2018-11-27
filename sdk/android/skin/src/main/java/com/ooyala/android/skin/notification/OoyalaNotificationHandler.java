package com.ooyala.android.skin.notification;

import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.OoyalaSkinLayoutController;

public abstract class OoyalaNotificationHandler extends BaseNotificationHandler<OoyalaNotification> {

  protected final OoyalaPlayer player;
  protected final OoyalaSkinLayoutController layoutController;

  public OoyalaNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    this.player = player;
    this.layoutController = layoutController;
  }

  @Override
  public boolean canHandle(OoyalaNotification notification) {
    String notificationName = getNotificationName();
    return notificationName != null && notificationName.equals(notification.getName());
  }

  public abstract String getNotificationName();

}
