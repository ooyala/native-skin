package com.ooyala.android.skin.notification.common;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.captions.ClosedCaptionsStyle;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;
import com.ooyala.android.util.DebugMode;

public class StateChangedNotificationHandler extends OoyalaNotificationHandler {

  private static String TAG = StateChangedNotificationHandler.class.getSimpleName();
  private static final String KEY_STATE = "state";

  public StateChangedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.STATE_CHANGED_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    WritableMap params = Arguments.createMap();
    params.putString(KEY_STATE, player.getState().toString().toLowerCase());
    ClosedCaptionsStyle currentClosedCaptionsStyle = new ClosedCaptionsStyle(layoutController.getLayout().getContext());
    if (currentClosedCaptionsStyle.compareTo(layoutController.getClosedCaptionsDeviceStyle()) != 0) {
      layoutController.setClosedCaptionsDeviceStyle(currentClosedCaptionsStyle);
      layoutController.ccStyleChanged();
    }
    DebugMode.logD(TAG, "state change event params are" + params.toString());
    layoutController.sendEvent(getNotificationName(), params);
  }
}
