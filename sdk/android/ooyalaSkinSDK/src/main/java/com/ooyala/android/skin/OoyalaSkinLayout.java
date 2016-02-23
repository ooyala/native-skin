package com.ooyala.android.skin;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.FrameLayout;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;

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
      void onFrameChangeCallback(int width, int height,int prevWidth,int prevHeight);
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
}
