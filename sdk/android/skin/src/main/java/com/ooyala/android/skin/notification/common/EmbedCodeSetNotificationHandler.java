package com.ooyala.android.skin.notification.common;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

public class EmbedCodeSetNotificationHandler extends OoyalaNotificationHandler {

  public EmbedCodeSetNotificationHandler(OoyalaPlayer ooyalaPlayer, OoyalaSkinLayoutController layoutController) {
    super(ooyalaPlayer, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.EMBED_CODE_SET_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    WritableMap nothing = Arguments.createMap();
    layoutController.sendEvent(getNotificationName(), nothing);
  }
}
