package com.ooyala.android.skin.notification.provider;

import com.ooyala.android.skin.notification.OoyalaNotificationHandler;

import java.util.List;

public interface NotificationHandlersProvider {
  List<OoyalaNotificationHandler> get();
}
