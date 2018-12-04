package com.ooyala.android.skin.notification.common;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;
import com.ooyala.android.util.DebugMode;

public class DesiredStateChangedNotificationHandler extends OoyalaNotificationHandler {

  private static String TAG = DesiredStateChangedNotificationHandler.class.getSimpleName();

  private static final String DESIRED_STATE = "desiredState";

  public DesiredStateChangedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.DESIRED_STATE_CHANGED_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    WritableMap params = Arguments.createMap();
    params.putString(DESIRED_STATE, player.getDesiredState().toString().toLowerCase());
    DebugMode.logD(TAG, "desired  state change event params are" + params.toString());
    layoutController.sendEvent(getNotificationName(), params);
  }
}
