package com.ooyala.android.ooyalaskinsdk;

import android.app.Application;
import android.content.Context;
import android.os.Bundle;
import android.util.AttributeSet;
import android.widget.FrameLayout;

import com.facebook.internal.BundleJSONConverter;
import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.ooyalaskinsdk.configuration.SkinOptions;
import com.ooyala.android.ooyalaskinsdk.util.JSONDeepMerge;
import com.ooyala.android.ooyalaskinsdk.util.ReactUtil;
import com.ooyala.android.util.DebugMode;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;

public class OoyalaSkinLayout extends FrameLayout {
  private static final String TAG = OoyalaSkinLayout.class.getSimpleName();
  private FrameLayout _playerFrame;
  private ReactInstanceManager _reactInstanceManager;
  private ReactRootView _rootView;
  private OoyalaSkinLayoutController _layoutcontroller;
  private OoyalaReactPackage _package;
  private int viewWidth,viewHeight,prevWidth,prevHeight;
  private FrameChangeCallback frameChangeCallback;

  public interface FrameChangeCallback {
      public void onFrameChangeCallback(int width, int height,int prevWidth,int prevHeight);
  }
  public void setFrameChangeCallback(FrameChangeCallback fcCallback){
      this.frameChangeCallback=fcCallback;
  }

  /**
   * Initialize the OoyalaPlayerLayout with the given Context
   * @param context the Context to use
   */
  public OoyalaSkinLayout(Context context) {
    super(context);
  }

  /**
   * Initialize the OoyalaPlayerLayout with the given Context and AttributeSet
   * @param context the Context to use
   * @param attrs the AttributeSet to use
   */
  public OoyalaSkinLayout(Context context, AttributeSet attrs) {
    super(context, attrs);
  }

  /**
   * Initialize the OoyalaPlayerLayout with the given Context, AttributeSet, and style
   * @param context the Context to use
   * @param attrs the AttributeSet to use
   * @param defStyle the style of the Layout
   */
  public OoyalaSkinLayout(Context context, AttributeSet attrs, int defStyle) {
    super(context, attrs, defStyle);
  }

  @Override
  protected void onSizeChanged(int xNew, int yNew, int xOld, int yOld) {
      super.onSizeChanged(xNew, yNew, xOld, yOld);
      viewWidth = xNew;
      viewHeight = yNew;
      prevWidth = xOld;
      prevHeight = yOld;
      try {
        this.frameChangeCallback.onFrameChangeCallback(viewWidth, viewHeight, prevWidth, prevHeight);
      } catch (Exception e) {
          e.printStackTrace();
      }
  }

  /**
   * Initialize the Skin UI
   * @param app The Application instance for your app
   * @param p An initialized OoyalaPlayer
   */
  public void initializeSkin(Application app, OoyalaPlayer p) {
    initializeSkin(app, p, new SkinOptions.Builder().build());
  }

  /**
   * Initialize the Skin UI
   * @param app The Application class for your app
   * @param p An initialized OoyalaPlayer
   * @param skinOptions a built SkinOptions instance for configuring the UI
   */
  public void initializeSkin(Application app, OoyalaPlayer p, SkinOptions skinOptions) {
    FrameLayout.LayoutParams frameLP =
        new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT);
    _playerFrame = new FrameLayout(getContext());
    this.addView(_playerFrame, frameLP);

    if (skinOptions.getEnableReactJSServer()) {
      ReactUtil.setJSServer(skinOptions.getReactJSServerHost(), getContext());
    }
    JSONObject configJson = loadInitialProperties(skinOptions.getSkinConfigAssetName());
    applySkinOverridesInPlace(configJson, skinOptions.getSkinOverrides());

    Bundle launchOptions = null; //Initial properties.
    if (configJson != null) {
      try {
        launchOptions = BundleJSONConverter.convertToBundle(configJson);
      } catch (JSONException e) {
        e.printStackTrace();
        launchOptions = null;
      }
    }

    _layoutcontroller = new OoyalaSkinLayoutController(this, p);
    _package = new OoyalaReactPackage(_layoutcontroller);
    _layoutcontroller.setOoyalaReactPackage(_package);

    _rootView = new ReactRootView(getContext());
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
    _rootView.startReactApplication(_reactInstanceManager, "OoyalaSkin", launchOptions);
    this.addView(_rootView, frameLP);
  }

  public FrameLayout getPlayerLayout() {
    return _playerFrame;
  }

  private JSONObject loadInitialProperties(String skinConfigAssetName) {
    String json = null;
    try {

      InputStream is = getContext().getAssets().open(skinConfigAssetName);
      int size = is.available();
      byte[] buffer = new byte[size];
      is.read(buffer);
      is.close();

      json = new String(buffer, "UTF-8");

    } catch (IOException ex) {
      ex.printStackTrace();
      return null;
    }
    JSONObject jsonObject = null;
    try {
      jsonObject = new JSONObject(json);
    } catch (JSONException e) {
      e.printStackTrace();
      return null;
    }
    return jsonObject;
  }

  private void applySkinOverridesInPlace(JSONObject initial, JSONObject skinOverrides) {
    try {
      JSONDeepMerge.inPlaceDeepMerge(initial, skinOverrides);
    } catch (JSONException e) {
      DebugMode.assertFail(TAG, "Could not apply skin overrides to the initial skin config!");
    }
  }

  public int getViewWidth() {
      return viewWidth;
  }

  public int getViewHeight() {
      return viewHeight;
  }
}
