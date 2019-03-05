package com.ooyala.android.skin.notification.cast;

import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.BridgeMessageBuilder;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

import static com.ooyala.android.OoyalaPlayer.DESIRED_STATE_CHANGED_NOTIFICATION_NAME;

public class CastModeConnectedNotificationHandler extends OoyalaNotificationHandler {

  public CastModeConnectedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.CAST_CONNECTED_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    WritableMap params = BridgeMessageBuilder.buildConnectedDeviceNameParams(notification.getData(), player.getState());
    layoutController.sendEvent(getNotificationName(), params);
  }
}
