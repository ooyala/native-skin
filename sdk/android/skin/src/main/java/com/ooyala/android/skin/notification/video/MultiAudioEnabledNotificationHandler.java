package com.ooyala.android.skin.notification.video;

import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.player.exoplayer.multiaudio.AudioTrack;
import com.ooyala.android.skin.BridgeMessageBuilder;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

import java.util.List;

public class MultiAudioEnabledNotificationHandler extends OoyalaNotificationHandler {

  public MultiAudioEnabledNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.MULTI_AUDIO_ENABLED_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    List<AudioTrack> audioTracks = player.getAvailableAudioTracks();
    WritableMap params = BridgeMessageBuilder.buildMultiAudioParams(audioTracks);
    layoutController.sendEvent(getNotificationName(), params);
  }
}
