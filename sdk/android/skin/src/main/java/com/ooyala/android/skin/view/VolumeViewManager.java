package com.ooyala.android.skin.view;

import android.graphics.Color;
import android.graphics.PorterDuff;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.ooyala.android.skin.OoyalaSkinLayoutController;
import com.ooyala.android.util.DebugMode;

public class VolumeViewManager extends SimpleViewManager<VolumeView> {
  public static final String REACT_CLASS = "OOVolumeView";
  OoyalaSkinLayoutController skinController;

  public VolumeViewManager(OoyalaSkinLayoutController lc) {
    super();
    skinController = lc;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected VolumeView createViewInstance(ThemedReactContext context) {
    VolumeView view = new VolumeView(context);
    skinController.allowScrollForView(view);
    return view;
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
  public void setVolume(VolumeView view, float volume) {
    if (volume < 0) {
      volume = 0;
    }
    if (volume > 1) {
      volume = 1;
    }
    view.setProgress((int)(volume*view.getMax()));
    view.invalidate();
  }
}
