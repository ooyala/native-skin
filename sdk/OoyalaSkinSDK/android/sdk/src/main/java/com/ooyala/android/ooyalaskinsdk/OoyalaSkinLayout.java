package com.ooyala.android.ooyalaskinsdk;

import android.app.Application;
import android.content.Context;
import android.util.AttributeSet;
import android.widget.FrameLayout;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.ooyala.android.OoyalaPlayer;

/**
 * Created by zchen on 9/21/15.
 */
public class OoyalaSkinLayout extends FrameLayout {
  private FrameLayout _playerFrame;
  private OoyalaPlayer _player;
  private ReactInstanceManager _reactInstanceManager;
  private ReactRootView _rootView;


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

  public void setupViews(Application app, OoyalaPlayer p) {
    FrameLayout.LayoutParams frameLP =
        new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT);
    _playerFrame = new FrameLayout(getContext());
    this.addView(_playerFrame, frameLP);

    _rootView = new ReactRootView(getContext());
    _reactInstanceManager = ReactInstanceManager.builder()
        .setApplication(app)
        .setBundleAssetName("index.android.bundle")
        .setJSMainModuleName("index.android")
        .addPackage(new OoyalaReactPackage(this, p))
        .setUseDeveloperSupport(BuildConfig.DEBUG)
        .setInitialLifecycleState(LifecycleState.RESUMED)
        .build();
    _rootView.startReactApplication(_reactInstanceManager, "OoyalaSkin", null);
    this.addView(_rootView, frameLP);
  }

  public FrameLayout getPlayerLayout() {
    return _playerFrame;
  }
}
