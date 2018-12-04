package com.ooyala.android.skin.notification.provider;

import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;
import com.ooyala.android.skin.notification.common.*;
import com.ooyala.android.skin.notification.video.*;

import java.util.ArrayList;
import java.util.List;

public class VideoNotificationHandlersProvider implements NotificationHandlersProvider {

  private final OoyalaSkinLayoutController layoutController;
  private final OoyalaPlayer player;

  public VideoNotificationHandlersProvider(OoyalaSkinLayoutController layoutController,
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
    handlers.add(new VideoTimeChangedNotificationHandler(player, layoutController));
    handlers.add(new VideoPlayCompletedNotificationHandler(player, layoutController));
    handlers.add(new AdPodCompletedNotificationHandler(player, layoutController));
    handlers.add(new AdPodStartedNotificationHandler(player, layoutController));
    handlers.add(new VideoPlayStartedNotificationHandler(player, layoutController));
    handlers.add(new ErrorNotificationHandler(player, layoutController));
    handlers.add(new ClosedCaptionsLanguageChangedNotificationHandler(player, layoutController));
    handlers.add(new AdStartedNotificationHandler(player, layoutController));
    handlers.add(new AdErrorNotificationHandler(player, layoutController));
    handlers.add(new LiveCcChangedNotificationHandler(player, layoutController));
    handlers.add(new ManifestCcChangedNotificationHandler(player, layoutController));
    handlers.add(new AdOverlayNotificationHandler(player, layoutController));
    handlers.add(new SeekStartedNotificationHandler(player, layoutController));
    handlers.add(new SeekCompletedNotificationHandler(player, layoutController));
    handlers.add(new MultiAudioEnabledNotificationHandler(player, layoutController));
    handlers.add(new AudioTrackSelectedNotificationHandler(player, layoutController));
    handlers.add(new PlaybackSpeedEnabledNotificationHandler(player, layoutController));
    handlers.add(new PlaybackSpeedRateChangedNotificationHandler(player, layoutController));

    return handlers;
  }
}
