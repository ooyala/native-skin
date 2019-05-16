package com.ooyala.android.skin;

import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.skin.notification.OoyalaNotificationHandler;
import com.ooyala.android.skin.notification.provider.NotificationHandlersProvider;

import java.util.List;
import java.util.Observable;
import java.util.Observer;

/**
 * The class that solely listens to the OoyalaPlayer, and responds based on the events
 */
public class OoyalaSkinPlayerObserver implements Observer {
  public static final String CLOSED_CAPTIONS_UPDATE_EVENT = "onClosedCaptionUpdate";

  private final List<OoyalaNotificationHandler> handlers;


  public OoyalaSkinPlayerObserver( OoyalaPlayer player, NotificationHandlersProvider handlersProvider) {
    player.addObserver(this);
    this.handlers = handlersProvider.get();
  }

  public void destroy() {
    handlers.clear();
  }

  @Override
  public void update(Observable arg0, Object notification) {
    if (notification instanceof OoyalaNotification) {
      OoyalaNotification ooyalaNotification = (OoyalaNotification) notification;
      for (OoyalaNotificationHandler handler : handlers) {
        handler.tryHandleNotification(ooyalaNotification);
      }
    }
  }
}
