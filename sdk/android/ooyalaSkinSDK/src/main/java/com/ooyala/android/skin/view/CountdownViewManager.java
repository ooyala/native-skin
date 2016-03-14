package com.ooyala.android.skin.view;

import android.graphics.Color;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class CountdownViewManager extends SimpleViewManager<CountdownView> {
    public static final String REACT_CLASS = "RCTCountdownView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected CountdownView createViewInstance(ThemedReactContext reactContext) {
        CountdownView v = new CountdownView(reactContext);
        return v;
    }

    @ReactProp(name = "countdown")
    public void setCountdown(final CountdownView view, ReadableMap countdown) {
        String mainColor = countdown.getString("main_color");
        String secondaryColor = countdown.getString("secondary_color");
        String fillColor = countdown.getString("fill_color");
        String textColor = countdown.getString("text_color");
        Integer strokeWidth = countdown.getInt("stroke_width");
        Integer textSize = countdown.getInt("text_size");
        Integer maxTime = countdown.getInt("max_time");
        Integer progress = countdown.getInt("progress");
        Boolean automatic = countdown.getBoolean("automatic");

        view.setMaxTimeSec(maxTime);
        view.setTextSize(textSize);
        view.setTextColor(Color.parseColor(textColor));
        view.setStrokeWidth(strokeWidth);
        view.setSecondaryColor(Color.parseColor(secondaryColor));
        view.setMainColor(Color.parseColor(mainColor));
        view.setFillColor(Color.parseColor(fillColor));
        view.setText(String.valueOf(maxTime));
        view.setProgress(progress);
        if(automatic) {
            view.start();
        } else {
            view.setText(String.valueOf(maxTime - progress));
        }
        view.invalidate();
    }

    @ReactProp(name = "data")
    public void setData(final CountdownView view, ReadableMap data) {
        WritableNativeMap argument = new WritableNativeMap();
        String embedCode=data.getString("embedCode");
        String bucketInfo=data.getString("bucketInfo");
        argument.putString("embedCode",embedCode);
        argument.putString("bucketInfo",bucketInfo);
        view.setData(argument);
    }

}