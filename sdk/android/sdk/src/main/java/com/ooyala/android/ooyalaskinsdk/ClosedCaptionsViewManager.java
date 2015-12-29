package com.ooyala.android.ooyalaskinsdk;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.text.ReactTextView;
import com.ooyala.android.captions.ClosedCaptionsView;
import com.ooyala.android.captions.ClosedCaptionsStyle;
import com.ooyala.android.item.Caption;

/**
 * Created by zchen on 12/22/15.
 */
public class ClosedCaptionsViewManager extends SimpleViewManager<ClosedCaptionsView> {
  public static final String REACT_CLASS = "RCTClosedCaptionsView";
  private ClosedCaptionsStyle style;

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public ClosedCaptionsView createViewInstance(ThemedReactContext context) {
    ClosedCaptionsView v = new ClosedCaptionsView(context);
    if (style == null) {
      style = new ClosedCaptionsStyle(context);
    }
    v.setStyle(style);
    return v;
  }

  @ReactProp(name = "caption")
  public void setCaption(ClosedCaptionsView view, ReadableMap caption) {
    Double begin = caption.getDouble("begin");
    Double end = caption.getDouble("end");
    String text = caption.getString("text");
    Caption c = new Caption(begin, end, text);
    view.setCaption(c);
  }

  @ReactProp(name = "videoWidth", defaultDouble = 0.0)
  public void setCaption(ClosedCaptionsView view, double videoWidth) {
    view.setVideoWidth(videoWidth);
  }

  @ReactProp(name = "renderToHardwareTextureAndroid")
  public void setRenderToHardwareTextureAndroid(ClosedCaptionsView view, boolean b) {
    // do nothing.
  }
}
