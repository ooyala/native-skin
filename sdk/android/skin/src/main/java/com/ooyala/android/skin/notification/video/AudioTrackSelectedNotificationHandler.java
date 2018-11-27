package com.ooyala.android.skin.notification.video;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.player.exoplayer.multiaudio.AudioTrack;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

public class AudioTrackSelectedNotificationHandler extends OoyalaNotificationHandler {

  public AudioTrackSelectedNotificationHandler(OoyalaPlayer player, OoyalaSkinLayoutController layoutController) {
    super(player, layoutController);
  }

  @Override
  public String getNotificationName() {
    return OoyalaPlayer.AUDIO_TRACK_SELECTED_NOTIFICATION_NAME;
  }

  @Override
  public void handle(OoyalaNotification notification) {
    AudioTrack selectedAudioTrack = player.getCurrentAudioTrack();
    if (selectedAudioTrack != null) {
      WritableMap params = Arguments.createMap();
      params.putString("selectedAudioTrack", selectedAudioTrack.getTrackTitle());
      layoutController.sendEvent(getNotificationName(), params);
    }
  }
}
