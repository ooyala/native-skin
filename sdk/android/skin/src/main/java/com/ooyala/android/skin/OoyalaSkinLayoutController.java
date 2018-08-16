package com.ooyala.android.skin;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.media.AudioManager;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Pair;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.ooyala.android.ClientId;
import com.ooyala.android.OoyalaException;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.OoyalaPlayerLayout;
import com.ooyala.android.captions.ClosedCaptionsStyle;
import com.ooyala.android.discovery.DiscoveryManager;
import com.ooyala.android.discovery.DiscoveryOptions;
import com.ooyala.android.player.FCCTVRatingUI;
import com.ooyala.android.player.VrMode;
import com.ooyala.android.skin.configuration.SkinOptions;
import com.ooyala.android.skin.util.BundleJSONConverter;
import com.ooyala.android.skin.util.ReactUtil;
import com.ooyala.android.skin.util.SkinConfigUtil;
import com.ooyala.android.ui.LayoutController;
import com.ooyala.android.util.DebugMode;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Observable;

import static com.ooyala.android.util.TvHelper.isTargetDeviceTV;

/**
 * The OoyalaSkinLayoutController is the primary class of the Ooyala Skin SDK
 * <p>
 * The OoyalaSkinLayoutController provides:
 * - Manipulation of views in Layout
 * - All of the React Native initialization
 * - Observation of the OoyalaPlayer to provide up-to-date state to the UI
 * - Handlers of all React Native callbacks
 */
public class OoyalaSkinLayoutController extends Observable implements LayoutController, OoyalaSkinLayout.FrameChangeCallback, DiscoveryManager.Callback, ReactInstanceManagerActivityPassthrough, View.OnKeyListener {
  final String TAG = this.getClass().toString();

  private static final double MAX_CARBOARD_DIAGONAL_INCH_VALUE = 6.5;

  private static final String KEY_NAME = "name";
  private static final String KEY_EMBEDCODE = "embedCode";
  private static final String KEY_PERCENTAG = "percentage";
  private static final String KEY_LANGUAGE = "language";
  private static final String KEY_AVAILABLE_LANGUAGE_FILE = "availableLanguageFile";
  private static final String KEY_ANDROID_RESOURCE = "androidResource";
  private static final String KEY_LOCALIZATION = "localization";
  private static final String KEY_LOCALE = "locale";
  private static final String KEY_DEFAULT_LANGUAGE = "defaultLanguage";
  private static final String KEY_BUCKETINFO = "bucketInfo";
  private static final String KEY_ACTION = "action";

  public static final String CONTROLLER_KEY_PRESS_EVENT = "controllerKeyPressEvent";

  /**
   * This is used to detect fullscreen open and close events
   * With this notification we will send data as state of fullscreen which is
   * isFullscreen = true/false
   */
  public static final String FULLSCREEN_CHANGED_NOTIFICATION_NAME = "fullscreenChanged";

  private final int REWIND_STEP = 10000; //10 sec
  private final int FORWARD_DIRECTION = 1;
  private final int BACKWARD_DIRECTION = -1;
  private final int STOP_DIRECTION = 0;
  public static final String VR_MODE_CHANGED_NOTIFICATION_NAME = "vrModeChanged";

  private OoyalaSkinLayout _layout;
  private OoyalaReactPackage _package;
  private OoyalaPlayer _player;
  private FCCTVRatingUI _tvRatingUI;
  DiscoveryOptions discoveryOptions;

  private JSONObject closedCaptionsSkinStyle;
  ClosedCaptionsStyle closedCaptionsDeviceStyle;

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
  private ReactRootView rootView;

  private OoyalaSkinPlayerObserver playerObserver;
  private OoyalaSkinVolumeObserver volumeObserver;
  private OoyalaSkinBridgeEventHandlerImpl eventHandler;

  private List<Pair<String, WritableMap>> queuedEvents;
  private boolean isReactMounted;
  private boolean isTargetTV;

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
    volumeObserver = new OoyalaSkinVolumeObserver(layout.getContext(), this);
    eventHandler = new OoyalaSkinBridgeEventHandlerImpl(this, player);

    _package = null;

    queuedEvents = new ArrayList<>();

    DisplayMetrics metrics = layout.getContext().getResources().getDisplayMetrics();
    dpi = metrics.densityDpi;
    cal = 160 / dpi;

    width = Math.round(_layout.getViewWidth() * cal);
    height = Math.round(_layout.getViewHeight() * cal);


    isReactMounted = false;

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
        closedCaptionsSkinStyle = configJson.getJSONObject("closedCaptionOptions");
        setDefaultAudioLanguage(configJson);
      } catch (JSONException e) {
        e.printStackTrace();
        launchOptions = null;
      }
    }

    _package = new OoyalaReactPackage(this);
    rootView = new ReactRootView(l.getContext());
    _reactInstanceManager = ReactInstanceManager.builder()
        .setApplication(app)
        .setBundleAssetName(skinOptions.getBundleAssetName())
        .setJSBundleFile("assets://index.android.jsbundle")
        .addPackage(_package)
        .setUseDeveloperSupport(BuildConfig.DEBUG)
        .setInitialLifecycleState(LifecycleState.RESUMED)
        .build();
    ccStyleChanged();

    rootView.startReactApplication(_reactInstanceManager, "OoyalaSkin", launchOptions);

    FrameLayout.LayoutParams frameLP =
        new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT);
    l.addView(rootView, frameLP);
    rootView.setBackgroundColor(Color.TRANSPARENT);

    isTargetTV = isTargetDeviceTV(_layout.getContext());
    if (isTargetTV) {
      _layout.setFullscreen(true);
      sendNotification(FULLSCREEN_CHANGED_NOTIFICATION_NAME, true);
    }

    rootView.setFocusableInTouchMode(true);
    rootView.requestFocus();
    rootView.setOnKeyListener(this);
  }

  public void ccStyleChanged() {
    closedCaptionsDeviceStyle = new ClosedCaptionsStyle(_layout.getContext());
    WritableMap params = BridgeMessageBuilder.buildCaptionsStyleParameters(closedCaptionsDeviceStyle, closedCaptionsSkinStyle);
    sendEvent(OoyalaPlayer.CC_STYLING_CHANGED_NOTIFICATION_NAME, params);
  }

  private boolean isStereoSupportedParam() {
    if (isTargetTV) {
      return false;
    } else {
      DisplayMetrics metrics = _layout.getContext().getResources().getDisplayMetrics();

      float yInches = metrics.heightPixels / metrics.ydpi;
      float xInches = metrics.widthPixels / metrics.xdpi;
      double diagonalInches = Math.sqrt(xInches * xInches + yInches * yInches);
      return diagonalInches <= MAX_CARBOARD_DIAGONAL_INCH_VALUE;
    }
  }

  /**
   * Get locale of device and inject localized file content into provided json object.
   *
   * @param configJson
   * @param context
   */
  private void injectLocalizedResources(JSONObject configJson, Context context) {
    String locale = Locale.getDefault().getLanguage();

    try {
      configJson.put(KEY_LOCALE, locale);
      HashMap<String, String> languageFileNames = getLocaleLanguageFileNames(configJson);
      JSONObject localizedResources = new JSONObject();
      for (String languageKey : languageFileNames.keySet()) {
        String path = languageFileNames.get(languageKey);
        JSONObject localized = SkinConfigUtil.loadLocalizedResources(context, path);
        if (localized != null) {
          localizedResources.put(languageKey, localized);
        }
      }
      if (localizedResources.length() > 0) {
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

      for (int i = 0; i < localeFiles.length(); i++) {
        JSONObject jsonObject = (JSONObject) localeFiles.get(i);
        String localeCode = jsonObject.getString(KEY_LANGUAGE);
        String languageFile = jsonObject.getString(KEY_ANDROID_RESOURCE);
        languageFiles.put(localeCode, languageFile);
      }
    } catch (JSONException e) {
      // Localization file for current locale is not set in config. Ignore.
    }
    return languageFiles;
  }

  /**
   * Set the default audio language from skin.json provided the language exists.
   *
   * @param audioParams The part of the config that define the default audio language.
   */
  private void setDefaultAudioLanguage(JSONObject audioParams) {
    try {
      String language = audioParams.getJSONObject("audio").getString("audioLanguage");
      if (language != null && !language.isEmpty()) {
        _player.setConfigDefaultAudioLanguage(language);
      }
    } catch (JSONException e) {
      // Localization file for default audio language is not set in config. Ignore.
    }
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

  void updateBridgeWithCurrentState() {

    if (isReactMounted) {
      DebugMode.logE(TAG, "Received onMounted a second time");
      return;
    }
    isReactMounted = true;

    if (_package.getBridge() == null) {
      DebugMode.logE(TAG, "Got onMounted from React, but bridge is not yet available? Invalid State");
    } else if (queuedEvents != null) {
      DebugMode.logE(TAG, "React mounted - replaying queued events");
      for (Pair<String, WritableMap> p : queuedEvents) {
        sendEvent(p.first, p.second);
      }
      queuedEvents = null;
    }
  }

  /****** LayoutController Interface **********/

  public FrameLayout getLayout() {
    return _layout.getPlayerLayout();
  }

  public int getCurrentVolume() {
    AudioManager audioManager = (AudioManager) _layout.getContext().getSystemService(Context.AUDIO_SERVICE);
    return audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
  }

  @Override
  public void setFullscreen(boolean isFullscreen) {
    if (_player != null && _player.hasVRContent()) {
      if (_player.getVRMode() == VrMode.STEREO && !isFullscreen) {
        _player.setVRMode(VrMode.MONO);
      }
    }

    _layout.setFullscreen(isFullscreen);
    sendNotification(FULLSCREEN_CHANGED_NOTIFICATION_NAME, isFullscreen);
  }

  void sendNotification(String notificationName) {
    sendNotification(notificationName, null);
  }

  void sendNotification(String notificationName, Object data) {
    sendNotification(new OoyalaNotification(notificationName, data));
  }

  void sendNotification(OoyalaNotification notification) {
    setChanged();
    notifyObservers(notification);
  }

  public boolean isFullscreen() {
    return _layout.isFullscreen();
  }

  public void showClosedCaptionsMenu() {

  }

  public boolean onTouchEvent(MotionEvent event, OoyalaPlayerLayout source) {
    return false;
  }

  public boolean onKeyUp(int keyCode, KeyEvent event) {
    if (_player.getState() != OoyalaPlayer.State.ERROR && _player.hasVRContent()) {
      return handleKeyUpVR(keyCode, event);
    }
    return false;
  }

  public boolean onKeyDown(int keyCode, KeyEvent event) {
    boolean handled = false;
    switch (keyCode) {
      case KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE:
      case KeyEvent.KEYCODE_DPAD_CENTER:
        if (event.getRepeatCount() == 0) {
          if (_player.isPlaying()) {
            _player.pause();
          } else {
            _player.play();
            handled = true;
          }
        }
        sendEvent(CONTROLLER_KEY_PRESS_EVENT, null);
        break;
      case KeyEvent.KEYCODE_MEDIA_REWIND:
        int timeAfterSeek = Math.max(0, _player.getPlayheadTime() - REWIND_STEP);
        _player.seek(timeAfterSeek); // << -10sec
        sendEvent(CONTROLLER_KEY_PRESS_EVENT, null);
        handled = true;
        break;
      case KeyEvent.KEYCODE_MEDIA_FAST_FORWARD:
        _player.seek(_player.getPlayheadTime() + REWIND_STEP); // >> +10sec
        sendEvent(CONTROLLER_KEY_PRESS_EVENT, null);
        handled = true;
        break;
      case KeyEvent.KEYCODE_DPAD_UP:
      case KeyEvent.KEYCODE_DPAD_DOWN:
      case KeyEvent.KEYCODE_DPAD_LEFT:
      case KeyEvent.KEYCODE_DPAD_RIGHT:
        if (_player.hasVRContent()) {
          handled = handleKeyDownVR(keyCode, event);
        } else {
          handled = handleKeyDown(keyCode, event);
          sendEvent(CONTROLLER_KEY_PRESS_EVENT, null);
        }
        break;
    }
    return handled;
  }

  private boolean handleKeyDownVR(int keyCode, KeyEvent event) {
    if (event.getRepeatCount() != 0) {
      return false;
    }

    boolean handled = false;
    switch (keyCode) {
      case KeyEvent.KEYCODE_DPAD_UP:
        _player.rotateVRContentVertically(BACKWARD_DIRECTION);
        handled = true;
        break;
      case KeyEvent.KEYCODE_DPAD_DOWN:
        _player.rotateVRContentVertically(FORWARD_DIRECTION);
        handled = true;
        break;
      case KeyEvent.KEYCODE_DPAD_LEFT:
        _player.rotateVRContentHorizontally(BACKWARD_DIRECTION);
        handled = true;
        break;
      case KeyEvent.KEYCODE_DPAD_RIGHT:
        _player.rotateVRContentHorizontally(FORWARD_DIRECTION);
        handled = true;
        break;
    }
    return handled;
  }

  private boolean handleKeyDown(int keyCode, KeyEvent event) {
    boolean handled = false;
    switch (keyCode) {
      case KeyEvent.KEYCODE_DPAD_LEFT:
        int timeAfterSeek = Math.max(0, _player.getPlayheadTime() - REWIND_STEP);
        _player.seek(timeAfterSeek);
        handled = true;
        break;
      case KeyEvent.KEYCODE_DPAD_RIGHT:
        int timeInMillis = _player.getPlayheadTime() + REWIND_STEP;
        _player.seek(timeInMillis);
        handled = true;
        break;
    }
    return handled;
  }

  private boolean handleKeyUpVR(int keyCode, KeyEvent event) {
    boolean handled = false;
    switch (keyCode) {
      case KeyEvent.KEYCODE_DPAD_UP:
      case KeyEvent.KEYCODE_DPAD_DOWN:
        _player.rotateVRContentVertically(STOP_DIRECTION);
        handled = true;
        break;
      case KeyEvent.KEYCODE_DPAD_LEFT:
      case KeyEvent.KEYCODE_DPAD_RIGHT:
        _player.rotateVRContentHorizontally(STOP_DIRECTION);
        handled = true;
        break;
    }
    return handled;
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

  @Override
  public void publishVRContent(boolean hasVRContent) {
    boolean isStereoSupported = isStereoSupportedParam();
    WritableMap params = BridgeMessageBuilder.buildVRParams(hasVRContent, isStereoSupported);
    sendEvent("vrContentEvent", params);
  }

  @Override
  public void switchVRMode(VrMode vrMode) {
    switch (vrMode) {
      case MONO:
        // Restore the screen orientation for MONO mode after switching from landscape STEREO mode
        setOrientation(ActivityInfo.SCREEN_ORIENTATION_USER);
        sendNotification(VR_MODE_CHANGED_NOTIFICATION_NAME, "vrModeMono");
        break;
      case STEREO:
        // Set up landscape orientation for STEREO mode
        setOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        sendNotification(VR_MODE_CHANGED_NOTIFICATION_NAME, "vrModeStereo");
        break;
      case NONE:
        throw new IllegalStateException("Unreal NONE state in switchVRMode(vrMode) from " + this.getClass().getSimpleName());
    }
  }

  /****** End LayoutController **********/

  void handlePlay() {
    _player.play();
  }

  void handlePlayPause() {
    _player.handlePlayPause();
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
    params.putBoolean("fullscreen", isFullscreen());

    sendEvent("frameChanged", params);
  }

  void sendEvent(String event, WritableMap map) {
    if (_package.getBridge() != null && isReactMounted) {
      _package.getBridge().sendEvent(event, map);
    } else {
      if (!isReactMounted) {
        DebugMode.logW(TAG, "Trying to send event, but React is not mounted yet: " + event);
      }
      if (_package.getBridge() == null) {
        DebugMode.logW(TAG, "Trying to send event, but bridge does not exist yet: " + event);
      }
      if (queuedEvents != null) {
        queuedEvents.add(new Pair<>(event, map));
      }
    }
  }

  @Override
  public void onPause() {
    if (_reactInstanceManager != null) {
      _reactInstanceManager.onHostPause();
    }
  }

  @Override
  public void onResume(Activity activity,
                       DefaultHardwareBackBtnHandler defaultBackButtonImpl) {
    if (_reactInstanceManager != null) {
      _reactInstanceManager.onHostResume(activity, defaultBackButtonImpl);
    }
    // hide navigation and notification bars after lockscreen
    // if video was in the fullscreen before screenlock
    _layout.toggleSystemUI(isFullscreen());
  }

  @Override
  public void onBackPressed() {
    if (_reactInstanceManager != null) {
      _reactInstanceManager.onBackPressed();
    }
  }

  public void onDestroy() {
    Activity activity = getActivity();
    if (_reactInstanceManager != null) {
      _reactInstanceManager.onHostDestroy(activity);
    }
    destroy();
  }

  /**
   * Call this if you plan on destroying this instance of the OoyalaSkinLayoutController
   */
  public void destroy() {
    if (volumeObserver != null) {
      volumeObserver.destroy();
    }

    if (_reactInstanceManager != null) {
      _reactInstanceManager.destroy();
    }

    if (rootView != null) {
      rootView.unmountReactApplication();
    }

    if (queuedEvents != null) {
      queuedEvents.clear();
      queuedEvents = null;
    }

    deleteObservers();
    removeVideoView();
    setOrientation(ActivityInfo.SCREEN_ORIENTATION_USER);

    DebugMode.logV(TAG, "SkinLayoutController Destroy");
  }

  private void setOrientation(int screenOrientationUser) {
    Activity activity = getActivity();
    if (activity != null) {
      activity.setRequestedOrientation(screenOrientationUser);
    } else {
      DebugMode.logE(TAG, "Trying to set orientation. The context isn't an instance of Activity.");
    }
  }


  @Override
  protected void finalize() throws Throwable {
    DebugMode.logV(TAG, "OoyalaSkinLayoutController Finalized");
    super.finalize();
  }

  @Override
  public boolean onKey(View view, int i, KeyEvent keyEvent) {
    if (keyEvent.getKeyCode() == KeyEvent.KEYCODE_BACK && _player.getVRMode() == VrMode.STEREO) {
      _player.switchVRMode();
    }
    if (keyEvent.getAction() == KeyEvent.ACTION_DOWN) {
      return this.onKeyDown(i, keyEvent);
    }
    if (keyEvent.getAction() == KeyEvent.ACTION_UP) {
      return this.onKeyUp(i, keyEvent);
    }
    return true;
  }

  private Activity getActivity() {
    FrameLayout layout = getLayout();
    if (layout != null && layout.getContext() instanceof Activity ) {
      Context context = layout.getContext();
        return (Activity) context;
    } else {
      return null;
    }
  }
}
