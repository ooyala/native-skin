package com.ooyala.android.ooyalaskinsdk;

import android.graphics.Color;
import android.graphics.PorterDuff;

import com.facebook.react.bridge.ReadableMap;
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

    @ReactProp(name = "progressColor")
    public void setProgressColor(VolumeView view, String progressColor) {
        view.getProgressDrawable().setColorFilter(Color.parseColor(progressColor), PorterDuff.Mode.MULTIPLY);
    }

    @ReactProp(name = "thumbColor")
    public void setThumbColor(VolumeView view, String thumbColor) {
        view.getThumb().setColorFilter(Color.parseColor(thumbColor), PorterDuff.Mode.SRC_IN);
    }

}
