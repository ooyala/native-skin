package com.ooyala.android.skin;

import android.content.Context;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.FrameLayout;

public class OoyalaSkinLayout extends FrameLayout {
  private static final String TAG = OoyalaSkinLayout.class.getSimpleName();
  private FrameLayout _playerFrame;

  private int viewWidth,viewHeight,prevWidth,prevHeight;
  private FrameChangeCallback frameChangeCallback;

  private int initialWidth;
  private int initialHeight;
  private boolean fullscreen = false;

  public interface FrameChangeCallback {
      void onFrameChangeCallback(int width, int height,int prevWidth,int prevHeight);
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

  private void createSubViews() {
    FrameLayout.LayoutParams frameLP =
            new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT);
    _playerFrame = new FrameLayout(this.getContext());
    this.addView(_playerFrame, frameLP);
  }

  public FrameLayout getAdView() {
    return _playerFrame;
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

  public FrameLayout getPlayerLayout() {
    return _playerFrame;
  }

  public int getViewWidth() {
      return viewWidth;
  }

  public int getViewHeight() {
      return viewHeight;
  }

  public boolean isFullscreen() {
    return fullscreen;
  }


  /**
   * Show/Hide system ui (notification and navigation bar) depending if layout is in fullscreen
   */
  public void toggleSystemUI(boolean fullscreen) {
    if(fullscreen) {
      setSystemUiVisibility(
              View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION     // hide nav bar
            | View.SYSTEM_UI_FLAG_FULLSCREEN          // hide status bar
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);  // toggle system UI visibility automatically
    } else {
      setSystemUiVisibility(
              View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }
  }

  /**
   * Stretch OoyalaSkinLayout to dimensions of the display window.
   * Handle system UI visibility.
   */
  void setFullscreen(boolean fullscreen) {
    if (this.fullscreen == fullscreen) return;

    this.fullscreen = fullscreen;
    if(fullscreen) {
      initialWidth = getLayoutParams().width;
      initialHeight = getLayoutParams().height;

      DisplayMetrics displayMetrics = new DisplayMetrics();
      WindowManager windowManager = (WindowManager) getContext().getSystemService(getContext().WINDOW_SERVICE);
      windowManager.getDefaultDisplay().getMetrics(displayMetrics);
      getLayoutParams().width = displayMetrics.widthPixels;
      getLayoutParams().height = displayMetrics.heightPixels;
      bringToFront();
    } else {
        getLayoutParams().width = initialWidth;
        getLayoutParams().height = initialHeight;
    }
    toggleSystemUI(fullscreen);
  }
}
