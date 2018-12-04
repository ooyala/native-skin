package com.ooyala.android.skin.notification.provider;

import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;
import com.ooyala.android.skin.notification.audio.AudioPlayCompletedNotificationHandler;
import com.ooyala.android.skin.notification.audio.AudioPlayStartedNotificationHandler;
import com.ooyala.android.skin.notification.audio.AudioTimeChangedNotificationHandler;
import com.ooyala.android.skin.notification.common.*;

import java.util.ArrayList;
import java.util.List;

public class AudioNotificationHandlersProvider implements NotificationHandlersProvider {

  private final OoyalaSkinLayoutController layoutController;
  private final OoyalaPlayer player;

  public AudioNotificationHandlersProvider(OoyalaSkinLayoutController layoutController,
                                           OoyalaPlayer player) {
    this.layoutController = layoutController;
    this.player = player;
  }

  @Override
  public List<OoyalaNotificationHandler> get() {
    List<OoyalaNotificationHandler> handlers = new ArrayList<>();

    handlers.add(new EmbedCodeSetNotificationHandler(player, layoutController));
    handlers.add(new StateChangedNotificationHandler(player, layoutController));
    handlers.add(new DesiredStateChangedNotificationHandler(player, layoutController));
    handlers.add(new CurrentItemChangedNotificationHandler(player, layoutController));
    handlers.add(new AudioTimeChangedNotificationHandler(player, layoutController));
    handlers.add(new AudioPlayCompletedNotificationHandler(player, layoutController));
    handlers.add(new AudioPlayStartedNotificationHandler(player, layoutController));
    handlers.add(new ErrorNotificationHandler(player, layoutController));
    handlers.add(new SeekStartedNotificationHandler(player, layoutController));
    handlers.add(new SeekCompletedNotificationHandler(player, layoutController));
    handlers.add(new PlaybackSpeedEnabledNotificationHandler(player, layoutController));
    handlers.add(new PlaybackSpeedRateChangedNotificationHandler(player, layoutController));

    return handlers;
  }
}
