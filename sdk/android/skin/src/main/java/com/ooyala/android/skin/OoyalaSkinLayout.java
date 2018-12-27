package com.ooyala.android.skin;


import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.FrameLayout;

import static android.os.Build.VERSION.SDK_INT;
import static android.os.Build.VERSION_CODES.KITKAT;

public class OoyalaSkinLayout extends FrameLayout implements View.OnSystemUiVisibilityChangeListener{
  private FrameLayout playerFrame;

  private int viewWidth, viewHeight;

  private FrameChangeCallback frameChangeCallback;

  private WindowManager windowManager;
  private boolean fullscreen = false;
  private boolean multiWindowMode = false;

  private int sourceWidth, sourceHeight;
  private boolean resizableLayout;

  public interface FrameChangeCallback {
    void onFrameChangeCallback(int width, int height, int prevWidth, int prevHeight);

    void onFullscreenToggleCallback();
  }
  public void setFrameChangeCallback(FrameChangeCallback fcCallback){
    this.frameChangeCallback = fcCallback;
  }

  /**
   * Initialize the OoyalaPlayerLayout with the given Context
   * @param context the Context to use
   */
  public OoyalaSkinLayout(Context context) {
    super(context);
    createSubViews();
  }

  /**
   * Initialize the OoyalaPlayerLayout with the given Context and AttributeSet
   * @param context the Context to use
   * @param attrs the AttributeSet to use
   */
  public OoyalaSkinLayout(Context context, AttributeSet attrs) {
    super(context, attrs);
    TypedArray typedArray = context.getTheme().obtainStyledAttributes(
            attrs,
            R.styleable.OoyalaSkinLayout, 0, 0);
    try {
      resizableLayout = typedArray.getBoolean(R.styleable.OoyalaSkinLayout_resizableLayout, false);
    } finally {
      typedArray.recycle();
    }
    createSubViews();
  }

  /**
   * Initialize the OoyalaPlayerLayout with the given Context, AttributeSet, and style
   * @param context the Context to use
   * @param attrs the AttributeSet to use
   * @param defStyle the style of the Layout
   */
  public OoyalaSkinLayout(Context context, AttributeSet attrs, int defStyle) {
    super(context, attrs, defStyle);
    createSubViews();
  }

  /**
   * Set up a player frame
   * Recommendation: use setupPlayerFrame() method only after release() method has been called
   */
  public void createSubViews() {
    if (playerFrame == null) {
      FrameLayout.LayoutParams frameLP =
              new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
      playerFrame = new FrameLayout(this.getContext());
      this.addView(playerFrame, frameLP);

      this.windowManager = (WindowManager) getContext().getSystemService(Context.WINDOW_SERVICE);
    }

    final View decorView = ((Activity)getContext()).getWindow().getDecorView();
    decorView.setOnSystemUiVisibilityChangeListener(this);
  }

  /**
   * This will release all the resources held by OoyalaSkinLayout.
   */
  public void release() {
    removeAllViews();
    playerFrame = null;
  }

  public FrameLayout getAdView() {
    return playerFrame;
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    ViewGroup.LayoutParams layoutParams = getLayoutParams();
    sourceWidth = layoutParams.width;
    sourceHeight = layoutParams.height;
  }

  @Override
  protected void onSizeChanged(int xNew, int yNew, int xOld, int yOld) {
    super.onSizeChanged(xNew, yNew, xOld, yOld);
    viewWidth = xNew;
    viewHeight = yNew;

    try {
      this.frameChangeCallback.onFrameChangeCallback(viewWidth, viewHeight, xOld, yOld);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public FrameLayout getPlayerLayout() {
    return playerFrame;
  }

  public int getViewWidth() {
    return viewWidth;
  }

  public int getViewHeight() {
    return viewHeight;
  }

  public boolean isFullscreen() {
    return this.fullscreen;
  }

  public int getSourceWidth() {
    return sourceWidth;
  }

  public int getSourceHeight() {
    return sourceHeight;
  }

  /**
   * Show/Hide system ui (notification and navigation bar) depending if layout is in fullscreen
   */
  public void toggleSystemUI(boolean fullscreen) {
    if (fullscreen) {
      if (SDK_INT >= KITKAT) {
        setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION     // hide nav bar
                        | View.SYSTEM_UI_FLAG_FULLSCREEN          // hide status bar
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);  // toggle system UI visibility automatically
      } else {
        setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION     // hide nav bar
                        | View.SYSTEM_UI_FLAG_FULLSCREEN);        // hide status bar
      }
    } else {
      setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }
  }

  /**
   * Stretch OoyalaSkinLayout to dimensions of the display window.
   * Handle system UI visibility.
   */
  void setFullscreen(boolean fullscreen) {
    // do nothing if window manager isn't set. This is considering an unexpected case, that is
    // why I'm omitting the whole method, since it really depends on windowManager
    if (null == windowManager) {
      return;
    }
    this.fullscreen = fullscreen;
    toggleSystemUI(fullscreen);

    if (multiWindowMode) {
      // In multiWindowMode toggleSystemUI not always calls onSizeChanged,
      // this method was created only to toggle fullscreen button on React.
      // It helps to show current button state and keeps the states synchronized
      // on orientation changes.
      try {
        this.frameChangeCallback.onFullscreenToggleCallback();
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }

  void setMultiWindowMode(boolean multiWindowMode){
    this.multiWindowMode = multiWindowMode;
  }

  private void updateLayoutSize() {
    ViewGroup.LayoutParams layoutParams = getLayoutParams();
    if (fullscreen) {
      //set layout to MATCH_PARENT
      layoutParams.width = FrameLayout.LayoutParams.MATCH_PARENT;
      layoutParams.height = FrameLayout.LayoutParams.MATCH_PARENT;
    } else {
      // Restore width and height to original values
      layoutParams.width = sourceWidth;
      layoutParams.height = sourceHeight;
    }
    requestLayout();
  }

  @Override
  protected void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    if (!resizableLayout) {
      updateLayoutSize();
    }
  }

  @Override
  public void onSystemUiVisibilityChange(int i) {
    if (!resizableLayout) {
      updateLayoutSize();
    }
  }
}
