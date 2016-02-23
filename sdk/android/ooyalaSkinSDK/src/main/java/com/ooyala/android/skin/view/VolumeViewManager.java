package com.ooyala.android.skin.view;

import android.graphics.Color;
import android.graphics.PorterDuff;

import com.facebook.react.uimanager.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

/**
 * Created by dkorobov on 2/9/16.
 */
public class VolumeViewManager extends SimpleViewManager<VolumeView> {
  public static final String REACT_CLASS = "OOVolumeView";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected VolumeView createViewInstance(ThemedReactContext context) {
    return new VolumeView(context);
  }

  @ReactProp(name = "color")
  public void setColor(VolumeView view, String color) {
    view.getProgressDrawable().setColorFilter(Color.parseColor(color), PorterDuff.Mode.MULTIPLY);
    view.getThumb().setColorFilter(Color.parseColor(color), PorterDuff.Mode.SRC_IN);
  }
}
