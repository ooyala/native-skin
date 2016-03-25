package com.ooyala.android.skin;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
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
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.ooyala.android.ClientId;
import com.ooyala.android.OoyalaException;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.OoyalaPlayerLayout;
import com.ooyala.android.discovery.DiscoveryManager;
import com.ooyala.android.discovery.DiscoveryOptions;
import com.ooyala.android.player.FCCTVRatingUI;
import com.ooyala.android.skin.configuration.SkinOptions;
import com.ooyala.android.skin.util.ReactUtil;
import com.ooyala.android.skin.util.SkinConfigUtil;
import com.ooyala.android.ui.LayoutController;
import com.ooyala.android.util.DebugMode;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Locale;


/**
 * The OoyalaSkinLayoutController is the primary class of the Ooyala Skin SDK
 *
 * The OoyalaSkinLayoutController provides:
 *   - Manipulation of views in Layout
 *   - All of the React Native initialization
 *   - Observation of the OoyalaPlayer to provide up-to-date state to the UI
 *   - Handlers of all React Native callbacks
 */
public class OoyalaSkinLayoutController implements LayoutController, OoyalaSkinLayout.FrameChangeCallback, DiscoveryManager.Callback, ReactInstanceManagerActivityPassthrough {
  final String TAG = this.getClass().toString();

  private static final String KEY_NAME = "name";
  private static final String KEY_EMBEDCODE = "embedCode";
  private static final String KEY_PERCENTAG = "percentage";
  private static final String KEY_LANGUAGE = "language";
  private static final String KEY_AVAILABLE_LANGUAGE_FILE = "availableLanguageFile";
  private static final String KEY_ANDROID_RESOURCE = "androidResource";
  private static final String KEY_LOCALIZATION = "localization";
  private static final String KEY_LOCALE = "locale";
  private static final String KEY_DEFAULT_LANGUAGE= "defaultLanguage";
  private static final String KEY_BUCKETINFO = "bucketInfo";
  private static final String KEY_ACTION = "action";

  private OoyalaSkinLayout _layout;
  private OoyalaReactPackage _package;
  private OoyalaPlayer _player;
  private FCCTVRatingUI _tvRatingUI;
  DiscoveryOptions discoveryOptions;

  private boolean _isFullscreen = false;
  private boolean _isUpNextDismissed = false;
  private boolean _isUpNextEnabled = false;

  int width;
  int height;

  String shareTitle;
  String shareUrl;

  private float dpi;
  private float cal;

  private String nextVideoEmbedCode = null;

  private ReactInstanceManager _reactInstanceManager;
  private OoyalaSkinPlayerObserver playerObserver;
  private OoyalaSkinVolumeObserver volumeObserver;
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
    volumeObserver = new OoyalaSkinVolumeObserver(layout.getContext(),this);
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
    injectLocalizedResources(configJson, l.getContext());
    saveUpNextSetting(configJson);
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
    // Reload JS from the react server. TODO: does not work after react upgrade
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

  /**
   * Get locale of device and inject localized file content into provided json object.
   * @param configJson
   * @param context
   */
  private void injectLocalizedResources(JSONObject configJson, Context context) {
    String locale = Locale.getDefault().getLanguage();

    try {
      configJson.put(KEY_LOCALE, locale);
      HashMap<String, String> languageFileNames = getLocaleLanguageFileNames(configJson);
      JSONObject localizedResources = new JSONObject();
      for(String languageKey : languageFileNames.keySet()) {
        String path = languageFileNames.get(languageKey);
        JSONObject localized = SkinConfigUtil.loadLocalizedResources(context, path);
        if(localized != null) {
            localizedResources.put(languageKey, localized);
        }
      }
      if(localizedResources.length() > 0) {
        JSONObject localizationJson = new JSONObject();
        localizationJson.put(KEY_LOCALIZATION, localizedResources);
        SkinConfigUtil.applySkinOverridesInPlace(configJson, localizationJson);
      } else {
        DebugMode.logE(TAG, "No localization files found.");
      }
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  private HashMap<String, String> getLocaleLanguageFileNames(JSONObject configJson) {
    HashMap<String, String> languageFiles = new HashMap<>();
    try {
      JSONArray localeFiles = configJson.getJSONObject(KEY_LOCALIZATION).getJSONArray(KEY_AVAILABLE_LANGUAGE_FILE);

      for(int i = 0; i < localeFiles.length(); i++) {
        JSONObject jsonObject = (JSONObject)localeFiles.get(i);
        String localeCode = jsonObject.getString(KEY_LANGUAGE);
        String languageFile = jsonObject.getString(KEY_ANDROID_RESOURCE);
        languageFiles.put(localeCode, languageFile);
      }
    } catch (JSONException e) {
      // Localization file for current locale is not set in config. Ignore.
    }
    return languageFiles;
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

  private void saveUpNextSetting(JSONObject config) {
    try {
      _isUpNextEnabled = config.getJSONObject("upNext").getBoolean("showUpNext");
    } catch (JSONException e) {
      DebugMode.logE(TAG, "Up Next Parse Failed, default not showing Up Next");
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


  public int getCurrentVolume() {
    AudioManager audioManager = (AudioManager) _layout.getContext().getSystemService(Context.AUDIO_SERVICE);
    return audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
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
                      | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);

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

  void handleSkip() {
    _player.skipAd();
  }

  void handleUpNextDismissed() {
    WritableMap body = Arguments.createMap();
    _isUpNextDismissed = true;
    body.putBoolean("upNextDismissed", _isUpNextDismissed);
    sendEvent("upNextDismissed", body);
  }

  void maybeStartUpNext() {
    if (nextVideoEmbedCode != null && _isUpNextEnabled && !_isUpNextDismissed) {
      _player.setEmbedCode(nextVideoEmbedCode);
      _player.play();
    }
  }

  void handleAdIconClick(int index) {
    _player.onAdIconClicked(index);
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

  @Override
  public void onPause() {
    if (_reactInstanceManager != null) {
      _reactInstanceManager.onPause();
    }
  }

  @Override
  public void onResume(Activity activity,
                          DefaultHardwareBackBtnHandler defaultBackButtonImpl) {
    if (_reactInstanceManager != null) {
      _reactInstanceManager.onResume( activity,defaultBackButtonImpl );
    }
    // hide navigation and notification bars after lockscreen
    // if video was in the fullscreen before screenlock
    setFullscreen(isFullscreen());
  }

  @Override
  public void onBackPressed() {
    if (_reactInstanceManager != null) {
      _reactInstanceManager.onBackPressed();
    }
  }
  @Override
  public void onDestroy() {
    if (_reactInstanceManager != null) {
      _reactInstanceManager.onDestroy();
    }
  }
}
