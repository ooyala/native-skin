package com.ooyala.android.skin;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaException;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.util.DebugMode;

import java.util.Observable;
import java.util.Observer;

/**
 * The class that solely listens to the OoyalaPlayer, and responds based on the events
 */
class OoyalaSkinPlayerObserver implements Observer {
  private static String TAG = OoyalaSkinPlayerObserver.class.getSimpleName();
  private static final String KEY_STATE = "state";
  private static final String DESIRED_STATE = "desiredState";

  private OoyalaSkinLayoutController _layoutController;
  private OoyalaPlayer _player;

  public OoyalaSkinPlayerObserver(OoyalaSkinLayoutController layoutController, OoyalaPlayer player) {
    _layoutController = layoutController;
    _player = player;
    _player.addObserver(this);
  }
  @Override
  public void update(Observable arg0, Object argN) {
    final String arg1 = OoyalaNotification.getNameOrUnknown(argN);
    if (arg1 == OoyalaPlayer.EMBED_CODE_SET_NOTIFICATION_NAME) {
      bridgeStateEmbedCodeNotification();
    } else if (arg1 == OoyalaPlayer.STATE_CHANGED_NOTIFICATION_NAME) {
      bridgeStateChangedNotification();
    } else if (arg1 == OoyalaPlayer.DESIRED_STATE_CHANGED_NOTIFICATION_NAME) {
      bridgeDesiredStateChangedNotification();
    } else if (arg1 == OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION_NAME) {
      bridgeCurrentItemChangedNotification();
    } else if (arg1 == OoyalaPlayer.TIME_CHANGED_NOTIFICATION_NAME) {
      bridgeTimeChangedNotification();
    } else if (arg1 == OoyalaPlayer.PLAY_COMPLETED_NOTIFICATION_NAME) {
      bridgePlayCompletedNotification();
      _layoutController.maybeStartUpNext();
    } else if (arg1 == OoyalaPlayer.AD_COMPLETED_NOTIFICATION_NAME) {
      bridgeAdPodCompleteNotification();
    } else if (arg1 == OoyalaPlayer.PLAY_STARTED_NOTIFICATION_NAME) {
      bridgePlayStartedNotification();
      _layoutController.requestDiscovery();
    } else if (arg1 == OoyalaPlayer.ERROR_NOTIFICATION_NAME) {
      bridgeErrorNotification();
    } else if (arg1 == OoyalaPlayer.CLOSED_CAPTIONS_LANGUAGE_CHANGED_NAME) {
      bridgeOnClosedCaptionChangeNotification();
    } else if (arg1 == OoyalaPlayer.AD_STARTED_NOTIFICATION_NAME) {
        bridgeAdStartNotification(((OoyalaNotification) argN).getData());
    }
  }
  private void bridgeOnClosedCaptionChangeNotification() {
  }

  private void bridgeStateChangedNotification() {
    WritableMap params = Arguments.createMap();
    params.putString(KEY_STATE, _player.getState().toString().toLowerCase());
    DebugMode.logD(TAG, "state change event params are" + params.toString());
    _layoutController.sendEvent(OoyalaPlayer.STATE_CHANGED_NOTIFICATION_NAME, params);
  }

  private void bridgeDesiredStateChangedNotification() {
    WritableMap params = Arguments.createMap();
    params.putString(DESIRED_STATE, _player.getDesiredState().toString().toLowerCase());
    DebugMode.logD(TAG, "desired  state change event params are" + params.toString());
    _layoutController.sendEvent(OoyalaPlayer.DESIRED_STATE_CHANGED_NOTIFICATION_NAME, params);
  }

  private void bridgeStateEmbedCodeNotification() {
    WritableMap nothing = Arguments.createMap();
    _layoutController.sendEvent(OoyalaPlayer.EMBED_CODE_SET_NOTIFICATION_NAME, nothing);
  }

  private void bridgeCurrentItemChangedNotification() {
    WritableMap params = BridgeMessageBuilder.buildCurrentItemChangedParams(_player, _layoutController.width, _layoutController.height, _layoutController.getCurrentVolume());
    _layoutController.sendEvent(OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION_NAME, params);

//    if (_player.currentItem.embedCode && self.skinOptions.discoveryOptions) {
//      [self loadDiscovery:_player.currentItem.embedCode];
//    }
  }

  private void bridgeTimeChangedNotification() {
    WritableMap params = BridgeMessageBuilder.buildTimeChangedEvent(_player);
    _layoutController.sendEvent(OoyalaPlayer.TIME_CHANGED_NOTIFICATION_NAME, params);
  }

  private void bridgePlayCompletedNotification() {
    WritableMap params = BridgeMessageBuilder.buildPlayCompletedParams(_player);
    _layoutController.sendEvent(OoyalaPlayer.PLAY_COMPLETED_NOTIFICATION_NAME, params);
  }

  private void bridgePlayStartedNotification() {
    _layoutController.sendEvent(OoyalaPlayer.PLAY_STARTED_NOTIFICATION_NAME, null);
  }

  private void bridgeErrorNotification() {
    OoyalaException ex = _player.getError();
    WritableMap params = Arguments.createMap();
    if (ex != null) {
      int errorCode = ex.getCode().ordinal();
      params.putInt("code", errorCode);

      String descrptions = ex.getLocalizedMessage();
      params.putString("description", descrptions != null ? descrptions : "");
    }

    _layoutController.sendEvent(OoyalaPlayer.ERROR_NOTIFICATION_NAME, params);
  }

  private void bridgeAdStartNotification(Object data) {
    WritableMap params = BridgeMessageBuilder.buildAdsParams(data);
    _layoutController.sendEvent(OoyalaPlayer.AD_STARTED_NOTIFICATION_NAME, params);
  }

  private void bridgeAdPodCompleteNotification() {
    WritableMap params = Arguments.createMap();
    _layoutController.sendEvent(OoyalaPlayer.AD_POD_COMPLETED_NOTIFICATION_NAME, params); //TODO: We are listening to Player's AdCompleted, passing AdPodCompleted.  Need to fix when we fix SDK's AdPodCompleted
  }
}
