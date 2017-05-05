package com.ooyala.android.skin;

import android.content.Context;
import android.content.res.Configuration;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;

import static android.os.Build.VERSION.SDK_INT;
import static android.os.Build.VERSION_CODES.JELLY_BEAN_MR1;
import static android.os.Build.VERSION_CODES.KITKAT;

public class OoyalaSkinLayout extends FrameLayout {
  private static final String TAG = OoyalaSkinLayout.class.getSimpleName();
  private FrameLayout _playerFrame;

  private int viewWidth,viewHeight,prevWidth,prevHeight;
  private FrameChangeCallback frameChangeCallback;

  private WindowManager windowManager;
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

    this.windowManager = (WindowManager) getContext().getSystemService(Context.WINDOW_SERVICE);
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
      setSystemUiVisibility(
              View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }
  }

  /**
   * Stretch OoyalaSkinLayout to dimensions of the display window.
   * Handle system UI visibility.
   */
  void setFullscreen(boolean fullscreen) {
    this.fullscreen = fullscreen;
    if(fullscreen) {

      DisplayMetrics displayMetrics = new DisplayMetrics();
      if (SDK_INT >= JELLY_BEAN_MR1) {
        windowManager.getDefaultDisplay().getRealMetrics(displayMetrics);
      } else {
        //TODO: Android 16 and below will show a poor fullscreen experience right now
        // It will not fill the screen where the navigation bar is supposed to be
        windowManager.getDefaultDisplay().getMetrics(displayMetrics);
      }

      getLayoutParams().width = displayMetrics.widthPixels;
      getLayoutParams().height = displayMetrics.heightPixels;
      bringToFront();
    } else {
      // found out that setting width and height to -1 will reset them to the original values
      getLayoutParams().width = -1;
      getLayoutParams().height = -1;
    }
    toggleSystemUI(fullscreen);
  }

  @Override
  protected void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);

    // Need to force call this every time there's an orientation change to get the correct
    // width and height values
    setFullscreen(this.fullscreen);
  }
}
