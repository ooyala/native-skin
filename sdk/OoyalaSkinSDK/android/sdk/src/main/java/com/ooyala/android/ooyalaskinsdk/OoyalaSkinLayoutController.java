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
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.OoyalaPlayerLayout;
import com.ooyala.android.player.FCCTVRatingUI;
import com.ooyala.android.ui.LayoutController;

import java.util.Observable;
import java.util.Observer;

/**
 * Created by zchen on 9/21/15.
 */
class OoyalaSkinLayoutController extends ReactContextBaseJavaModule implements LayoutController, Observer {
  final String TAG = this.getClass().toString();
  private OoyalaSkinLayout _layout;
  private OoyalaPlayer _player;
  private FCCTVRatingUI _tvRatingUI;

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
    if( videoView != null ) {
      _tvRatingUI = new FCCTVRatingUI( _player, videoView, getLayout(), _player.getOptions().getTVRatingConfiguration() );
    }
  }

  public void removeVideoView() {
    if( _tvRatingUI != null ) {
      _tvRatingUI.destroy();
      _tvRatingUI = null;
    }
  }

  public void reshowTVRating() {
    if( _tvRatingUI != null ) {
      _tvRatingUI.reshow();
    }
  }

  public void setFullscreenButtonShowing(boolean showing) {

  }

  @ReactMethod
  public void play() {
    Log.d(TAG, "play called from javascript");
    this.getReactApplicationContext().runOnUiQueueThread(new Runnable() {
      @Override
      public void run() {
        if (_player.isPlaying()) {
          _player.pause();
        } else {
          _player.play();
        }
      }
    });
  }

  @Override
  public void update(Observable arg0, Object arg1) {
    if (arg1 == OoyalaPlayer.STATE_CHANGED_NOTIFICATION) {
      WritableMap params = Arguments.createMap();
      params.putString("playerState", _player.getState().toString());

      this.getReactApplicationContext()
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit("stateChanged", params);
    }
  }
}
