package com.ooyala.android.skin.notification.common;

import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.item.CastMediaRoute;
import com.ooyala.android.skin.BridgeMessageBuilder;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

import java.util.Set;

public class CastPressedNotificationHandler extends OoyalaNotificationHandler {

  public CastPressedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.CAST_DEVICES_AVAILABLE_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    WritableMap params = BridgeMessageBuilder.buildCastDeviceListParams((Set<CastMediaRoute>) notification.getData());
    layoutController.sendEvent(getNotificationName(), params);
  }
}
