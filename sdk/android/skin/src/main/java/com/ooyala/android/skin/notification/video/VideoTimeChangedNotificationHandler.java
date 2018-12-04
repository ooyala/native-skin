package com.ooyala.android.skin.notification.video;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.item.Caption;
import com.ooyala.android.item.ClosedCaptions;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.OoyalaSkinPlayerObserver;
import com.ooyala.android.skin.notification.common.BaseTimeChangedNotificationHandler;

public class VideoTimeChangedNotificationHandler extends BaseTimeChangedNotificationHandler {

  public VideoTimeChangedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public void handle(OoyalaNotification notification) {
    super.handle(notification);
    notifyClosedCaptionsUpdate();
  }

  private void notifyClosedCaptionsUpdate() {
    if (OoyalaPlayer.LIVE_CLOSED_CAPIONS_LANGUAGE.equals(player.getClosedCaptionsLanguage())) {
      return;
    }

    if (player.getCurrentItem() == null || !player.getCurrentItem().hasClosedCaptions()) {
      return;
    }

    String captionText = "";
    String language = player.getClosedCaptionsLanguage();
    ClosedCaptions cc = player.getCurrentItem().getClosedCaptions();
    if (language != null && cc != null) {
      double currentTime = player.getPlayheadTime() / 1000.0;
      Caption caption = cc.getCaption(language, currentTime);
      if (caption != null) {
        captionText = caption.getText();
      }
    }

    WritableMap params = Arguments.createMap();
    params.putString("text", captionText);
    layoutController.sendEvent(OoyalaSkinPlayerObserver.CLOSED_CAPTIONS_UPDATE_EVENT, params);
  }
}
