package com.ooyala.android.skin.notification.audio;

import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.common.BaseTimeChangedNotificationHandler;

public class AudioTimeChangedNotificationHandler extends BaseTimeChangedNotificationHandler {

  public AudioTimeChangedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }
}
