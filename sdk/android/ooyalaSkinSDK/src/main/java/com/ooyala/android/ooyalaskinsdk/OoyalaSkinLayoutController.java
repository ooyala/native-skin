package com.ooyala.android.ooyalaskinsdk;

import android.app.Application;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.DisplayMetrics;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;

import com.facebook.internal.BundleJSONConverter;
import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.ClientId;
import com.ooyala.android.OoyalaException;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.OoyalaPlayerLayout;
import com.ooyala.android.captions.ClosedCaptionsView;
import com.ooyala.android.discovery.DiscoveryManager;
import com.ooyala.android.discovery.DiscoveryOptions;
import com.ooyala.android.ooyalaskinsdk.configuration.SkinOptions;
import com.ooyala.android.ooyalaskinsdk.util.ReactUtil;
import com.ooyala.android.ooyalaskinsdk.util.SkinConfigUtil;
import com.ooyala.android.player.FCCTVRatingUI;
import com.ooyala.android.ui.LayoutController;
import com.ooyala.android.util.DebugMode;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Observable;
import java.util.Observer;
import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

/**
 * The OoyalaSkinLayoutController is the primary class of the Ooyala Skin SDK
 *
 * The OoyalaSkinLayoutController provides:
 *   - Manipulation of views in Layout
 *   - All of the React Native initialization
 *   - Observation of the OoyalaPlayer to provide up-to-date state to the UI
 *   - Handlers of all React Native callbacks
 */

public class OoyalaSkinLayoutController implements LayoutController, Observer, OoyalaSkinLayout.FrameChangeCallback, DiscoveryManager.Callback, BridgeEventHandler {
  final String TAG = this.getClass().toString();
  private static final String BUTTON_PLAYPAUSE = "PlayPause";
  private static final String BUTTON_PLAY = "Play";
  private static final String BUTTON_SHARE = "Share";
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

  private OoyalaSkinLayout _layout;
  private OoyalaReactPackage _package;
  private OoyalaPlayer _player;
  private FCCTVRatingUI _tvRatingUI;
  private ClosedCaptionsView _closedCaptionsView;
  private DiscoveryOptions discoveryOptions;

  private boolean _isFullscreen = false;
  private boolean _isUpNextDismissed = false;
  private int width, height;
  private String shareTitle, shareUrl;
  private float dpi, cal;
  private WritableMap upNextParams=null;
  private String upNextembedCode=null;
  private String nextVideoEmbedCode = null;

  private ReactInstanceManager _reactInstanceManager;

  /**
   * Create the OoyalaSkinLayoutController, which is the core unit of the Ooyala Skin Integration
   * @param app The Application instance for your app
   * @param layout An OoyalaSkinLayout to render the player and the skin
   * @param player An initialized OoyalaPlayer
   */
  public OoyalaSkinLayoutController(Application app, OoyalaSkinLayout layout, OoyalaPlayer player) {
    this(app, layout, player, new SkinOptions.Builder().build());
  }

  /**
   *
   * Create the OoyalaSkinLayoutController, which is the core unit of the Ooyala Skin Integration
   * @param app The Application instance for your app
   * @param layout An OoyalaSkinLayout to render the player and the skin
   * @param player An initialized OoyalaPlayer
   * @param skinOptions an instance of the SkinOptions, to use to configure your skin
   */
  public OoyalaSkinLayoutController(Application app, OoyalaSkinLayout layout, OoyalaPlayer player, SkinOptions skinOptions) {
    super();
    _layout = layout;
    _layout.setFrameChangeCallback(this);

    _player = player;
    _player.setLayoutController(this);
    _player.addObserver(this);

    _package = null;

    DisplayMetrics metrics = layout.getContext().getResources().getDisplayMetrics();
    dpi = metrics.densityDpi;
    cal = 160/dpi;

    width = Math.round(_layout.getViewWidth() * cal);
    height = Math.round(_layout.getViewHeight() * cal);

    initializeSkin(app, layout, player, skinOptions);
  }

  private void initializeSkin(Application app, OoyalaSkinLayout l, OoyalaPlayer p, SkinOptions skinOptions) {

    if (skinOptions.getEnableReactJSServer()) {
      ReactUtil.setJSServer(skinOptions.getReactJSServerHost(), l.getContext());
    }
    JSONObject configJson = SkinConfigUtil.loadInitialProperties(l.getContext(), skinOptions.getSkinConfigAssetName());
    SkinConfigUtil.applySkinOverridesInPlace(configJson, skinOptions.getSkinOverrides());

    Bundle launchOptions = null; //Initial properties.
    if (configJson != null) {
      try {
        launchOptions = BundleJSONConverter.convertToBundle(configJson);
      } catch (JSONException e) {
        e.printStackTrace();
        launchOptions = null;
      }
    }

    _package = new OoyalaReactPackage(this);

    ReactRootView rootView = new ReactRootView(l.getContext());
    _reactInstanceManager = ReactInstanceManager.builder()
            .setApplication(app)
            .setBundleAssetName(skinOptions.getBundleAssetName())
            .setJSMainModuleName("index.android")
            .addPackage(_package)
            .setUseDeveloperSupport(BuildConfig.DEBUG)
            .setInitialLifecycleState(LifecycleState.RESUMED)
            .build();

    // Reload JS from the react server.
    if (skinOptions.getEnableReactJSServer()) {
      ReactUtil.reloadJs(_reactInstanceManager);
    }
    rootView.startReactApplication(_reactInstanceManager, "OoyalaSkin", launchOptions);

    FrameLayout.LayoutParams frameLP =
            new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT);
    l.addView(rootView, frameLP);
  }

  @Override
  public void callback(Object results, OoyalaException error) {
    if (results instanceof String && results.equals("OK")) {
      DebugMode.logD(TAG,"feedback successful");
    } else if (results instanceof JSONArray) {
      JSONArray jsonResults = (JSONArray) results;
      try {
        nextVideoEmbedCode = (String) jsonResults.getJSONObject(1).get("embed_code");
      } catch (JSONException e) {
        e.printStackTrace();
      }
      WritableMap params = BridgeMessageBuilder.buildDiscoveryResultsReceivedParams(jsonResults);
      sendEvent("discoveryResultsReceived", params);
    }
  }

  public FrameLayout getLayout() {
    return _layout.getPlayerLayout();
  }

  public void setFullscreen(boolean fullscreen) {
    _isFullscreen = fullscreen;

    if(fullscreen) {
      _layout.setSystemUiVisibility(
              View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                      | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                      | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                      | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
                      | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                      | View.SYSTEM_UI_FLAG_IMMERSIVE);

    }
    else
    {
      _layout.setSystemUiVisibility(
              View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }

  }

  public boolean isFullscreen() {
    return _isFullscreen;
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

  private void handleLearnMore() {
    _player.onAdclickThrough();
  }
  
  private void handleUpNextDismissed() {
    WritableMap body = Arguments.createMap();
    _isUpNextDismissed = true;
    body.putBoolean("upNextDismissed", _isUpNextDismissed);
    sendEvent("upNextDismissed", body);
  }

  private void handleUpNextClick() {
    if(nextVideoEmbedCode != null) {
        _player.setEmbedCode(nextVideoEmbedCode);
        _player.play();
    }
  }

  private void handleShare() {
    Intent shareIntent = new Intent(Intent.ACTION_SEND);
    shareIntent.setType("text/plain");
    shareIntent.putExtra(Intent.EXTRA_SUBJECT, shareTitle);
    shareIntent.putExtra(Intent.EXTRA_TEXT, shareTitle + "  " + shareUrl);
    Intent chooserIntent = Intent.createChooser(shareIntent, "share via");
    chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    _layout.getContext().startActivity(chooserIntent);
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
      if(!_isUpNextDismissed)
      {
        handleUpNextClick();
      }
    } else if (arg1 == OoyalaPlayer.AD_COMPLETED_NOTIFICATION) {
      bridgeAdPodCompleteNotification();
    } else if (arg1 == OoyalaPlayer.PLAY_STARTED_NOTIFICATION) {
      bridgePlayStartedNotification();
      requestDiscovery();
    } else if (arg1 == OoyalaPlayer.ERROR_NOTIFICATION) {
      bridgeErrorNotification();
    } else if (arg1 == OoyalaPlayer.CLOSED_CAPTIONS_LANGUAGE_CHANGED) {
      onClosedCaptionChangeNotification();
    } else if (arg1 instanceof OoyalaNotification) {
      String ooyalaNotification=((OoyalaNotification) arg1).getNotificationName();

      if (ooyalaNotification == OoyalaPlayer.AD_STARTED_NOTIFICATION)
      {
        bridgeAdStartNotification(((OoyalaNotification) arg1).getData());
      }
    }
  }

  //********* BridgeEventHandler Methods ************/

  public void onClosedCaptionUpdateRequested(ReadableMap parameters) {

    // ignore the request if cc is not available
    if (_player == null || _player.getCurrentItem() == null || !_player.getCurrentItem().hasClosedCaptions()) {
      return;
    }

    final String languageName = parameters.hasKey("language") ? parameters.getString("language") : null;
    double curTime = _player.getPlayheadTime() / 1000d;
    WritableMap params = BridgeMessageBuilder.buildClosedCaptionUpdateParams(_player, languageName, curTime);
    sendEvent("onClosedCaptionUpdate", params);
  }

  public void onPress(ReadableMap parameters) {
    final String buttonName = parameters.hasKey("name") ? parameters.getString("name") : null;
    if (buttonName != null) {
      DebugMode.logD(TAG, "onPress with buttonName:" + buttonName);
    new Handler(Looper.getMainLooper()).post(new Runnable() {
        @Override
        public void run() {
          if (buttonName.equals(BUTTON_PLAY)) {
            handlePlay();
          } else if (buttonName.equals(BUTTON_PLAYPAUSE)) {
            handlePlayPause();
          } else if (buttonName.equals(BUTTON_FULLSCREEN)) {
            setFullscreen(!isFullscreen());
          } else if (buttonName.equals(BUTTON_SHARE)) {
            handleShare();
          } else if (buttonName.equals(BUTTON_LEARNMORE)) {
            handleLearnMore();
          } else if (buttonName.equals(BUTTON_UPNEXT_DISMISS)) {
            handleUpNextDismissed();
          } else if (buttonName.equals(BUTTON_UPNEXT_CLICK)) {
            handleUpNextClick();
          }
        }
      });
    }
  }

  public void shareTitle(ReadableMap parameters) {
      shareTitle = parameters.getString("shareTitle");
  }

  public void shareUrl(ReadableMap parameters) {
      shareUrl = parameters.getString("shareUrl");
  }

  public void onScrub(ReadableMap percentage) {
    double percentValue = percentage.getDouble("percentage");
    percentValue = percentValue * 100;
    int percent = ((int) percentValue);
    _player.seekToPercent(percent);
  }

  public void onDiscoveryRow(ReadableMap parameters) {
    String android_id = Settings.Secure.getString(this._layout.getContext().getContentResolver(), Settings.Secure.ANDROID_ID);
    String bucketInfo = parameters.getString("bucketInfo");
    String action = parameters.getString("action");
    final String embedCode = parameters.getString("embedCode");
    if (action.equals("click"))
    {
      DiscoveryManager.sendClick(discoveryOptions, bucketInfo, _player.getPcode(), android_id, null, this);
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
      DiscoveryManager.sendImpression(discoveryOptions, bucketInfo, _player.getPcode(), android_id, null, this);
    }
  }

  private void onClosedCaptionChangeNotification() {
  }

  //********* Bridge Notifications ************/

  private void bridgeStateChangedNotification() {
    WritableMap params = Arguments.createMap();
    params.putString(KEY_STATE, _player.getState().toString().toLowerCase());
    DebugMode.logD(TAG, "state change event params are" + params.toString());
    sendEvent(OoyalaPlayer.STATE_CHANGED_NOTIFICATION, params);
  }

  private void bridgeCurrentItemChangedNotification() {
    WritableMap params = BridgeMessageBuilder.buildCurrentItemChangedParams(_player, width, height);
    sendEvent(OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION, params);

//    if (_player.currentItem.embedCode && self.skinOptions.discoveryOptions) {
//      [self loadDiscovery:_player.currentItem.embedCode];
//    }
  }

  private void bridgeTimeChangedNotification() {
    WritableMap params = BridgeMessageBuilder.buildTimeChangedEvent(_player);
    sendEvent(OoyalaPlayer.TIME_CHANGED_NOTIFICATION, params);
  }

  private void bridgePlayCompletedNotification() {
    WritableMap params = BridgeMessageBuilder.buildPlayCompletedParams(_player);
    sendEvent(OoyalaPlayer.PLAY_COMPLETED_NOTIFICATION, params);
  }

  private void bridgePlayStartedNotification() {
    sendEvent(OoyalaPlayer.PLAY_STARTED_NOTIFICATION, null);
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

    sendEvent(OoyalaPlayer.ERROR_NOTIFICATION, params);
  }

  private void bridgeAdStartNotification(Object data) {
    WritableMap params = BridgeMessageBuilder.buildAdsParams(data);
    sendEvent(OoyalaPlayer.AD_STARTED_NOTIFICATION, params);
  }

  private void bridgeAdPodCompleteNotification() {
    WritableMap params = Arguments.createMap();
    sendEvent(OoyalaPlayer.AD_POD_COMPLETED_NOTIFICATION, params); //TODO: We are listening to Player's AdCompleted, passing AdPodCompleted.  Need to fix when we fix SDK's AdPodCompleted
  }

  @Override
  public void onFrameChangeCallback(int width, int height, int prevWdith,int prevHeight) {
    height = Math.round(height * cal);
    width = Math.round(width * cal);
    this.width = width;
    this.height = height;
    WritableMap params = Arguments.createMap();
    params.putInt("width", width);
    params.putInt("height", height);
    params.putBoolean("fullscreen",_isFullscreen);

    sendEvent("frameChanged", params);
  }

  private void requestDiscovery() {
    discoveryOptions = new DiscoveryOptions.Builder().build();
    DiscoveryManager.getResults(discoveryOptions,
            _player.getEmbedCode(),
            _player.getPcode(),
            ClientId.getId(_layout.getContext()), null, this);
  }
  private void sendEvent(String event, WritableMap map) {
    if (_package.getBridge() != null) {
      _package.getBridge().sendEvent(event, map);
    } else {
      DebugMode.logW(TAG, "Trying to send event, but bridge does not exist yet: " + event);
    }
  }
}
