package com.ooyala.android.skin.notification;

public abstract class BaseNotificationHandler<T> {

  public final boolean tryHandleNotification(T notification) {
    if (canHandle(notification)) {
      handle(notification);
      return true;
    }
    return false;
  }

  public abstract boolean canHandle(T notification);

  public abstract void handle(T notification);
}
