package com.ooyala.android.ooyalaskinsdk;

import android.app.Application;
import android.content.Intent;
import android.os.Bundle;
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
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.ClientId;
import com.ooyala.android.OoyalaException;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.OoyalaPlayerLayout;
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


/**
 * The OoyalaSkinLayoutController is the primary class of the Ooyala Skin SDK
 *
 * The OoyalaSkinLayoutController provides:
 *   - Manipulation of views in Layout
 *   - All of the React Native initialization
 *   - Observation of the OoyalaPlayer to provide up-to-date state to the UI
 *   - Handlers of all React Native callbacks
 */
public class OoyalaSkinLayoutController implements LayoutController, OoyalaSkinLayout.FrameChangeCallback, DiscoveryManager.Callback {
  final String TAG = this.getClass().toString();

  private static final String KEY_NAME = "name";
  private static final String KEY_EMBEDCODE = "embedCode";
  private static final String KEY_PERCENTAG = "percentage";
  private static final String KEY_LANGUAGE = "language";
  private static final String KEY_BUCKETINFO = "bucketInfo";
  private static final String KEY_ACTION = "action";

  private OoyalaSkinLayout _layout;
  private OoyalaReactPackage _package;
  private OoyalaPlayer _player;
  private FCCTVRatingUI _tvRatingUI;
  DiscoveryOptions discoveryOptions;

  private boolean _isFullscreen = false;
  private boolean _isUpNextDismissed = false;

  int width;
  int height;

  String shareTitle;
  String shareUrl;

  private float dpi;
  private float cal;

  private String nextVideoEmbedCode = null;

  private ReactInstanceManager _reactInstanceManager;
  private OoyalaSkinPlayerObserver playerObserver;
  private OoyalaSkinBridgeEventHandlerImpl eventHandler;

  /**
   * Create the OoyalaSkinLayoutController, which is the core unit of the Ooyala Skin Integration
   *
   * @param app    The Application instance for your app
   * @param layout An OoyalaSkinLayout to render the player and the skin
   * @param player An initialized OoyalaPlayer
   */
  public OoyalaSkinLayoutController(Application app, OoyalaSkinLayout layout, OoyalaPlayer player) {
    this(app, layout, player, new SkinOptions.Builder().build());
  }

  /**
   * Create the OoyalaSkinLayoutController, which is the core unit of the Ooyala Skin Integration
   *
   * @param app         The Application instance for your app
   * @param layout      An OoyalaSkinLayout to render the player and the skin
   * @param player      An initialized OoyalaPlayer
   * @param skinOptions an instance of the SkinOptions, to use to configure your skin
   */
  public OoyalaSkinLayoutController(Application app, OoyalaSkinLayout layout, OoyalaPlayer player, SkinOptions skinOptions) {
    super();
    _layout = layout;
    _layout.setFrameChangeCallback(this);

    _player = player;
    _player.setLayoutController(this);

    playerObserver = new OoyalaSkinPlayerObserver(this, player);
    eventHandler = new OoyalaSkinBridgeEventHandlerImpl(this, player);

    _package = null;

    DisplayMetrics metrics = layout.getContext().getResources().getDisplayMetrics();
    dpi = metrics.densityDpi;
    cal = 160 / dpi;

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
      DebugMode.logD(TAG, "feedback successful");
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

  boolean isUpNextDismissed() {
    return _isUpNextDismissed;
  }

  public BridgeEventHandler getBridgeEventHandler() {
    return this.eventHandler;
  }

  /****** LayoutController Interface **********/

  public FrameLayout getLayout() {
    return _layout.getPlayerLayout();
  }

  public void setFullscreen(boolean fullscreen) {
    _isFullscreen = fullscreen;

    if (fullscreen) {
      _layout.setSystemUiVisibility(
              View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                      | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                      | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                      | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
                      | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                      | View.SYSTEM_UI_FLAG_IMMERSIVE);

    } else {
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

  /****** End LayoutController **********/

  void handlePlay() {
    _player.play();
  }

  void handlePlayPause() {
    if (_player.isPlaying()) {
      _player.pause();
    } else {
      _player.play();
    }
  }

  void handleLearnMore() {
    _player.onAdclickThrough();
  }

  void handleUpNextDismissed() {
    WritableMap body = Arguments.createMap();
    _isUpNextDismissed = true;
    body.putBoolean("upNextDismissed", _isUpNextDismissed);
    sendEvent("upNextDismissed", body);
  }

  void handleUpNextClick() {
    if (nextVideoEmbedCode != null) {
      _player.setEmbedCode(nextVideoEmbedCode);
      _player.play();
    }
  }

  void requestDiscovery() {
    discoveryOptions = new DiscoveryOptions.Builder().build();
    DiscoveryManager.getResults(discoveryOptions,
            _player.getEmbedCode(),
            _player.getPcode(),
            ClientId.getId(_layout.getContext()), null, this);
  }

  void handleShare() {
    Intent shareIntent = new Intent(Intent.ACTION_SEND);
    shareIntent.setType("text/plain");
    shareIntent.putExtra(Intent.EXTRA_SUBJECT, shareTitle);
    shareIntent.putExtra(Intent.EXTRA_TEXT, shareTitle + "  " + shareUrl);
    Intent chooserIntent = Intent.createChooser(shareIntent, "share via");
    chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    _layout.getContext().startActivity(chooserIntent);
  }

  @Override
  public void onFrameChangeCallback(int width, int height, int prevWdith, int prevHeight) {
    height = Math.round(height * cal);
    width = Math.round(width * cal);
    this.width = width;
    this.height = height;
    WritableMap params = Arguments.createMap();
    params.putInt("width", width);
    params.putInt("height", height);
    params.putBoolean("fullscreen", _isFullscreen);

    sendEvent("frameChanged", params);
  }

  void sendEvent(String event, WritableMap map) {
    if (_package.getBridge() != null) {
      _package.getBridge().sendEvent(event, map);
    } else {
      DebugMode.logW(TAG, "Trying to send event, but bridge does not exist yet: " + event);
    }
  }
}
