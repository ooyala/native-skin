package com.ooyala.android.skin.notification.common;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaException;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.BridgeMessageBuilder;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

public class ErrorNotificationHandler extends OoyalaNotificationHandler {

  public ErrorNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.ERROR_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    OoyalaException ex = player.getError();
    WritableMap params = Arguments.createMap();
    if (ex != null) {
      int errorCode = ex.getIntErrorCode();
      params.putInt("code", errorCode);

      String descrptions = ex.getLocalizedMessage();
      params.putString("description", descrptions != null ? descrptions : "");

      WritableMap userInfoParams = BridgeMessageBuilder.buildUserInfoParams(ex);
      params.putMap("userInfo", userInfoParams);

      params.putString("screenType", player.isAudioOnly() ? "audio" : "video");
    }

    layoutController.sendEvent(getNotificationName(), params);
  }
}
