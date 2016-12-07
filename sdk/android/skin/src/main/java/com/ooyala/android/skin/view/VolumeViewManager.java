package com.ooyala.android.skin.view;

import android.graphics.Color;
import android.graphics.PorterDuff;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.ooyala.android.util.DebugMode;

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
    try {
      view.getProgressDrawable().setColorFilter(Color.parseColor(color), PorterDuff.Mode.MULTIPLY);
      view.getThumb().setColorFilter(Color.parseColor(color), PorterDuff.Mode.SRC_IN);
    } catch (Exception e) {
      DebugMode.logE(VolumeViewManager.class.getSimpleName(), "Error setting VolumeView Color. skin.json controlBar.volumeview.color cannot support rgba() values right now");
    }

  }

  @ReactProp(name = "volume")
  public void setVolume(VolumeView view, int volume) {
    view.setProgress(volume);
    view.invalidate();
  }
}
