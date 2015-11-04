package com.ooyala.android.ooyalaskinsdk;

import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.OoyalaPlayerLayout;
import com.ooyala.android.item.Video;
import com.ooyala.android.player.FCCTVRatingUI;
import com.ooyala.android.ui.LayoutController;
import com.ooyala.android.util.DebugMode;

import java.util.Observable;
import java.util.Observer;

/**
 * Created by zchen on 9/21/15.
 */
public class OoyalaSkinLayoutController extends ReactContextBaseJavaModule implements LayoutController, Observer {
  final String TAG = this.getClass().toString();
  private OoyalaSkinLayout _layout;
  private OoyalaPlayer _player;
  private FCCTVRatingUI _tvRatingUI;

  private static final String BUTTON_PLAYPAUSE = "PlayPause";
  private static final String BUTTON_PLAY = "Play";
  private static final String BUTTON_SOCIALSHARE = "SocialShare";
  private static final String BUTTON_FULLSCREEN = "Fullscreen";
  private static final String BUTTON_LEARNMORE = "LearnMore";
  private static final String BUTTON_MORE_OPTION = "More";
  private static final String BUTTON_UPNEXT_DISMISS = "upNextDismiss";
  private static final String BUTTON_UPNEXT_CLICK = "upNextClick";

  private static final String KEY_NAME = "name";
  private static final String KEY_EMBEDCODE = "embedCode";
  private static final String KEY_PERCENTAG = "percentage";
  private static final String KEY_LANGUAGE = "language";
  private static final String KEY_BUCKETINFO = "bucketInfo";
  private static final String KEY_ACTION = "action";
  private static final String KEY_STATE = "state";

  @Override
  public String getName() {
    return "OoyalaSkinLayoutController";
  }

  public OoyalaSkinLayoutController(
      ReactApplicationContext c, OoyalaSkinLayout l, OoyalaPlayer p) {
    super(c);
    _layout = l;
    _player = p;

    _player.setLayoutController(this);
    _player.addObserver(this);
  }

  public FrameLayout getLayout() {
    return _layout.getPlayerLayout();
  }

  public void setFullscreen(boolean fullscreen) {

  }

  public boolean isFullscreen() {
    return false;
  }

  public void showClosedCaptionsMenu() {

  }

  public boolean onTouchEvent(MotionEvent event, OoyalaPlayerLayout source) {
    return false;
  }


  public boolean onKeyUp(int keyCode, KeyEvent event) {
    return false;
  }

  public void addVideoView(View videoView) {
    removeVideoView();
    if (videoView != null) {
      _tvRatingUI = new FCCTVRatingUI(_player, videoView, getLayout(), _player.getOptions().getTVRatingConfiguration());
    }
  }

  public void removeVideoView() {
    if (_tvRatingUI != null) {
      _tvRatingUI.destroy();
      _tvRatingUI = null;
    }
  }

  public void reshowTVRating() {
    if (_tvRatingUI != null) {
      _tvRatingUI.reshow();
    }
  }

  public void setFullscreenButtonShowing(boolean showing) {

  }

  @ReactMethod
  public void onPress(ReadableMap parameters) {
    final String buttonName = parameters.getString("name");
    if (buttonName != null) {
      DebugMode.logD(TAG, "onPress with buttonName:" + buttonName);
      this.getReactApplicationContext().runOnUiQueueThread(new Runnable() {
        @Override
        public void run() {
          if (buttonName.equals(BUTTON_PLAY)) {
            handlePlay();
          } else if (buttonName.equals(BUTTON_PLAYPAUSE)) {
            handlePlayPause();
          }
        }
      });
    }
  }

  @Override
  public void update(Observable arg0, Object arg1) {
    if (arg1 == OoyalaPlayer.STATE_CHANGED_NOTIFICATION) {
      bridgeStateChangedNotification();
    } else if (arg1 == OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION) {
      bridgeCurrentItemChangedNotification();
    }
  }

  // private methods
  private void handlePlay() {
    _player.play();
  }

  private void handlePlayPause() {
    if (_player.isPlaying()) {
      _player.pause();
    } else {
      _player.play();
    }
  }

  // notification bridges
  private void bridgeCurrentItemChangedNotification() {
    WritableMap params = Arguments.createMap();
    Video currentItem = _player.getCurrentItem();
    if (currentItem != null) {
      String title = currentItem.getTitle();
      params.putString("title", title != null ? title : "");

      String description = currentItem.getDescription();
      params.putString("description", description != null ? description : "");

      String promoUrl = currentItem.getPromoImageURL(2000, 2000);
      params.putString("promoUrl", promoUrl != null ? promoUrl : "");

//      String hostedAtUrl = _player.currentItem.hostedAtURL ? _player.currentItem.hostedAtURL : @"";
      Double duration = currentItem.getDuration() / 1000.0;
      params.putDouble("duration", duration);
      params.putBoolean("live", currentItem.isLive());

      if (currentItem.hasClosedCaptions()) {
        WritableArray languages = Arguments.createArray();
        for (String s : currentItem.getClosedCaptions().getLanguages()) {
          languages.pushString(s);
        }
        params.putArray("languages", languages);
      }
    }

    this.getReactApplicationContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION, params);

//    if (_player.currentItem.embedCode && self.skinOptions.discoveryOptions) {
//      [self loadDiscovery:_player.currentItem.embedCode];
//    }
  }

  private void bridgeStateChangedNotification() {
    WritableMap params = Arguments.createMap();
    params.putString(KEY_STATE, _player.getState().toString().toLowerCase());
    DebugMode.logD(TAG, "state change event params are" + params.toString());
    this.getReactApplicationContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(OoyalaPlayer.STATE_CHANGED_NOTIFICATION, params);
  }
}
