package com.ooyala.android.ooyalaskinsdk;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaException;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.util.DebugMode;

import java.lang.ref.WeakReference;
import java.util.Observable;
import java.util.Observer;

/**
 * The class that solely listens to the OoyalaPlayer, and responds based on the events
 */
class OoyalaSkinPlayerObserver implements Observer {
  private static String TAG = OoyalaSkinPlayerObserver.class.getSimpleName();
  private static final String KEY_STATE = "state";

  private WeakReference<OoyalaSkinLayoutController> _layoutController;
  private WeakReference<OoyalaPlayer> _player;

  public OoyalaSkinPlayerObserver(OoyalaSkinLayoutController layoutController, OoyalaPlayer player) {
    _layoutController = new WeakReference<>(layoutController);
    _player = new WeakReference<>(player);
    _player.get().addObserver(this);
  }
  @Override
  public void update(Observable arg0, Object arg1) {
    if (arg1 == OoyalaPlayer.STATE_CHANGED_NOTIFICATION) {
      bridgeStateChangedNotification();
    } else if (arg1 == OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION) {
      bridgeCurrentItemChangedNotification();
    } else if (arg1 == OoyalaPlayer.TIME_CHANGED_NOTIFICATION) {
      bridgeTimeChangedNotification();
    } else if (arg1 == OoyalaPlayer.PLAY_COMPLETED_NOTIFICATION) {
      bridgePlayCompletedNotification();
      if(!_layoutController.get().isUpNextDismissed())
      {
        _layoutController.get().handleUpNextClick();
      }
    } else if (arg1 == OoyalaPlayer.AD_COMPLETED_NOTIFICATION) {
      bridgeAdPodCompleteNotification();
    } else if (arg1 == OoyalaPlayer.PLAY_STARTED_NOTIFICATION) {
      bridgePlayStartedNotification();
      _layoutController.get().requestDiscovery();
    } else if (arg1 == OoyalaPlayer.ERROR_NOTIFICATION) {
      bridgeErrorNotification();
    } else if (arg1 == OoyalaPlayer.CLOSED_CAPTIONS_LANGUAGE_CHANGED) {
      bridgeOnClosedCaptionChangeNotification();
    } else if (arg1 instanceof OoyalaNotification) {
      String ooyalaNotification=((OoyalaNotification) arg1).getNotificationName();

      if (ooyalaNotification == OoyalaPlayer.AD_STARTED_NOTIFICATION)
      {
        bridgeAdStartNotification(((OoyalaNotification) arg1).getData());
      }
    }
  }
  private void bridgeOnClosedCaptionChangeNotification() {
  }

  private void bridgeStateChangedNotification() {
    WritableMap params = Arguments.createMap();
    params.putString(KEY_STATE, _player.get().getState().toString().toLowerCase());
    DebugMode.logD(TAG, "state change event params are" + params.toString());
    _layoutController.get().sendEvent(OoyalaPlayer.STATE_CHANGED_NOTIFICATION, params);
  }

  private void bridgeCurrentItemChangedNotification() {
    WritableMap params = BridgeMessageBuilder.buildCurrentItemChangedParams(_player.get(), _layoutController.get().width, _layoutController.get().height);
    _layoutController.get().sendEvent(OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION, params);

//    if (_player.currentItem.embedCode && self.skinOptions.discoveryOptions) {
//      [self loadDiscovery:_player.currentItem.embedCode];
//    }
  }

  private void bridgeTimeChangedNotification() {
    WritableMap params = BridgeMessageBuilder.buildTimeChangedEvent(_player.get());
    _layoutController.get().sendEvent(OoyalaPlayer.TIME_CHANGED_NOTIFICATION, params);
  }

  private void bridgePlayCompletedNotification() {
    WritableMap params = BridgeMessageBuilder.buildPlayCompletedParams(_player.get());
    _layoutController.get().sendEvent(OoyalaPlayer.PLAY_COMPLETED_NOTIFICATION, params);
  }

  private void bridgePlayStartedNotification() {
    _layoutController.get().sendEvent(OoyalaPlayer.PLAY_STARTED_NOTIFICATION, null);
  }

  private void bridgeErrorNotification() {
    OoyalaException ex = _player.get().getError();
    WritableMap params = Arguments.createMap();
    if (ex != null) {
      int errorCode = ex.getCode().ordinal();
      params.putInt("code", errorCode);

      String descrptions = ex.getLocalizedMessage();
      params.putString("description", descrptions != null ? descrptions : "");
    }

    _layoutController.get().sendEvent(OoyalaPlayer.ERROR_NOTIFICATION, params);
  }

  private void bridgeAdStartNotification(Object data) {
    WritableMap params = BridgeMessageBuilder.buildAdsParams(data);
    _layoutController.get().sendEvent(OoyalaPlayer.AD_STARTED_NOTIFICATION, params);
  }

  private void bridgeAdPodCompleteNotification() {
    WritableMap params = Arguments.createMap();
    _layoutController.get().sendEvent(OoyalaPlayer.AD_POD_COMPLETED_NOTIFICATION, params); //TODO: We are listening to Player's AdCompleted, passing AdPodCompleted.  Need to fix when we fix SDK's AdPodCompleted
  }
}
