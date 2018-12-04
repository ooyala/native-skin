package com.ooyala.android.skin.notification.video;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

public class ClosedCaptionsLanguageChangedNotificationHandler extends OoyalaNotificationHandler {

  public ClosedCaptionsLanguageChangedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.CLOSED_CAPTIONS_LANGUAGE_CHANGED_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    // clear previous cc, if any
    WritableMap params = Arguments.createMap();
    params.putString("text", "");
    layoutController.sendEvent("onClosedCaptionUpdate", params);
  }
}
