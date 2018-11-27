package com.ooyala.android.skin.notification.common;

import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.BridgeMessageBuilder;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

public class CurrentItemChangedNotificationHandler extends OoyalaNotificationHandler {

  public CurrentItemChangedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    WritableMap params = BridgeMessageBuilder.buildCurrentItemChangedParams(
        player,
        layoutController.getWidth(),
        layoutController.getHeight(), layoutController.getCurrentVolume()
    );
    params.putString("contentType", player.isAudioOnly() ? "Audio" : "Video");
    layoutController.sendEvent(getNotificationName(), params);
  }
}
