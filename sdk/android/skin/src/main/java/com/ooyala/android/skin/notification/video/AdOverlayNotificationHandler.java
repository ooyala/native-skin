package com.ooyala.android.skin.notification.video;

import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.AdOverlayInfo;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.BridgeMessageBuilder;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

public class AdOverlayNotificationHandler extends OoyalaNotificationHandler {

  public AdOverlayNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.AD_OVERLAY_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    Object data = notification.getData();
    if (data instanceof AdOverlayInfo) {
      WritableMap params = BridgeMessageBuilder.buildAdOverlayParams((AdOverlayInfo) data);
      layoutController.sendEvent(getNotificationName(), params);
    }
  }
}
