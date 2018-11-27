package com.ooyala.android.skin.notification.video;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.OoyalaSkinPlayerObserver;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

import java.util.Map;

public class ManifestCcChangedNotificationHandler extends OoyalaNotificationHandler {

  public ManifestCcChangedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.MANIFEST_CC_CHANGED_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    String ccText = "";
    Object data = notification.getData();
    if (data != null) {
      Map<String, String> map = (Map<String, String>) data;
      ccText = map.containsKey(OoyalaPlayer.CLOSED_CAPTION_TEXT) ? map.get(OoyalaPlayer.CLOSED_CAPTION_TEXT) : "";
    }
    WritableMap params = Arguments.createMap();
    params.putString("text", ccText);

    layoutController.sendEvent(OoyalaSkinPlayerObserver.CLOSED_CAPTIONS_UPDATE_EVENT, params);
  }
}
