package com.ooyala.android.skin;

import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.discovery.DiscoveryManager;
import com.ooyala.android.util.DebugMode;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

/**
 * This class handles all of the events that can come from the React Bridge, and performs all of the necessary actions
 */
class OoyalaSkinBridgeEventHandlerImpl implements BridgeEventHandler {
  private static String TAG = OoyalaSkinBridgeEventHandlerImpl.class.getSimpleName();
  private static final String BUTTON_PLAYPAUSE = "PlayPause";
  private static final String BUTTON_PLAY = "Play";
  private static final String BUTTON_SHARE = "Share";
  private static final String BUTTON_SOCIALSHARE = "SocialShare";
  private static final String BUTTON_FULLSCREEN = "Fullscreen";
  private static final String BUTTON_LEARNMORE = "LearnMore";
  private static final String BUTTON_MORE_OPTION = "More";
  private static final String BUTTON_UPNEXT_DISMISS = "upNextDismiss";
  private static final String BUTTON_UPNEXT_CLICK = "upNextClick";
  private static final String BUTTON_SKIP = "Skip";


  private OoyalaSkinLayoutController _layoutController;
  private OoyalaPlayer _player;

  public OoyalaSkinBridgeEventHandlerImpl(OoyalaSkinLayoutController layoutController, OoyalaPlayer player) {
    _layoutController =  layoutController;
    _player = player;
  }

  public void onClosedCaptionUpdateRequested(ReadableMap parameters) {

    // ignore the request if cc is not available
    if (_player == null || _player.getCurrentItem() == null || !_player.getCurrentItem().hasClosedCaptions()) {
      return;
    }

    final String languageName = parameters.hasKey("language") ? parameters.getString("language") : null;
    double curTime = _player.getPlayheadTime() / 1000d;
    WritableMap params = BridgeMessageBuilder.buildClosedCaptionUpdateParams(_player, languageName, curTime);
    _layoutController.sendEvent("onClosedCaptionUpdate", params);
  }

  public void onPress(ReadableMap parameters) {
    final String buttonName = parameters.hasKey("name") ? parameters.getString("name") : null;
    if (buttonName != null) {
      DebugMode.logD(TAG, "onPress with buttonName:" + buttonName);
      new Handler(Looper.getMainLooper()).post(new Runnable() {
        @Override
        public void run() {
          if (buttonName.equals(BUTTON_PLAY)) {
            _layoutController.handlePlay();
          } else if (buttonName.equals(BUTTON_PLAYPAUSE)) {
            _layoutController.handlePlayPause();
          } else if (buttonName.equals(BUTTON_FULLSCREEN)) {
            _layoutController.setFullscreen(!_layoutController.isFullscreen());
          } else if (buttonName.equals(BUTTON_SHARE)) {
            _layoutController.handleShare();
          } else if (buttonName.equals(BUTTON_LEARNMORE)) {
            _layoutController.handleLearnMore();
          } else if (buttonName.equals(BUTTON_UPNEXT_DISMISS)) {
            _layoutController.handleUpNextDismissed();
          } else if (buttonName.equals(BUTTON_UPNEXT_CLICK)) {
            _layoutController.handleUpNextClick();
          } else if (buttonName.equals(BUTTON_SKIP)) {
            _layoutController.handleSkip();
          }
        }
      });
    }
  }

  public void shareTitle(ReadableMap parameters) {
    _layoutController.shareTitle = parameters.getString("shareTitle");
  }

  public void shareUrl(ReadableMap parameters) {
    _layoutController.shareUrl = parameters.getString("shareUrl");
  }

  public void onScrub(ReadableMap percentage) {
    double percentValue = percentage.getDouble("percentage");
    percentValue = percentValue * 100;
    int percent = ((int) percentValue);
    _player.seekToPercent(percent);
  }

  public void onDiscoveryRow(ReadableMap parameters) {
    String android_id = Settings.Secure.getString(_layoutController.getLayout().getContext().getContentResolver(), Settings.Secure.ANDROID_ID);
    String bucketInfo = parameters.getString("bucketInfo");
    String action = parameters.getString("action");
    final String embedCode = parameters.getString("embedCode");
    if (action.equals("click"))
    {
      DiscoveryManager.sendClick(_layoutController.discoveryOptions, bucketInfo, _player.getPcode(), android_id, null, _layoutController);
      runOnUiThread(new Runnable() {
        @Override
        public void run() {
          DebugMode.logD(TAG, "playing discovery video with embedCode " + embedCode);
          _player.setEmbedCode(embedCode);
          _player.play();
        }
      });
    }
    else if(action.equals("impress")) {
      DiscoveryManager.sendImpression(_layoutController.discoveryOptions, bucketInfo, _player.getPcode(), android_id, null, _layoutController);
    }
  }

}
