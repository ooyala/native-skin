package com.ooyala.android.skin;

import android.content.Context;
import android.content.res.Configuration;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.FrameLayout;

import static android.os.Build.VERSION.SDK_INT;
import static android.os.Build.VERSION_CODES.JELLY_BEAN_MR1;
import static android.os.Build.VERSION_CODES.KITKAT;

public class OoyalaSkinLayout extends FrameLayout {
  private static final String TAG = OoyalaSkinLayout.class.getSimpleName();
  private FrameLayout playerFrame;

  private int viewWidth,viewHeight,prevWidth,prevHeight;
  private int sourceWidth, sourceHeight;

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

  /**
   * Set up a player frame
   * Recommendation: use setupPlayerFrame() method only after release() method has been called
   */
  public void createSubViews() {
    if (playerFrame == null) {
      FrameLayout.LayoutParams frameLP =
        new FrameLayout.LayoutParams(
          FrameLayout.LayoutParams.MATCH_PARENT,
          FrameLayout.LayoutParams.MATCH_PARENT);
      playerFrame = new FrameLayout(this.getContext());
      this.addView(playerFrame, frameLP);

      this.windowManager = (WindowManager) getContext().getSystemService(Context.WINDOW_SERVICE);
    }
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
    // do nothing if window manager isn't set. This is considering an unexpected case, that is
    // why I'm omitting the whole method, since it really depends on windowManager
    if (null == windowManager) {
        return;
    }
    boolean changed = this.fullscreen != fullscreen;
    ViewGroup.LayoutParams layoutParams = getLayoutParams();


    if (changed) {
      if (fullscreen) {
        //Store the source size of the layout
        sourceWidth = layoutParams.width;
        sourceHeight = layoutParams.height;
      } else {
        // Restore width and height of the skin layout
        layoutParams.width = sourceWidth;
        layoutParams.height = sourceHeight;
      }
    }

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
      layoutParams.width = displayMetrics.widthPixels;
      layoutParams.height = displayMetrics.heightPixels;
      bringToFront();
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
