package com.ooyala.android.ooyalaskinsdk;

import android.graphics.Color;
import android.os.Handler;
import android.os.Message;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import static com.ooyala.android.ooyalaskinsdk.CountdownView.*;

/**
 * Created by dkorobov on 1/13/16.
 */
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

        view.setMaxTimeSec(maxTime);
        view.setTextSize(textSize);
        view.setTextColor(Color.parseColor(textColor));
        view.setStrokeWidth(strokeWidth);
        view.setSecondaryColor(Color.parseColor(secondaryColor));
        view.setMainColor(Color.parseColor(mainColor));
        view.setFillColor(Color.parseColor(fillColor));
        view.setText(String.valueOf(maxTime));
        view.setProgress(progress);
        view.invalidate();
        view.start();
    }

    @ReactProp(name = "embedCode")
    public void setVideoItem(final CountdownView view, String embedCode) {
        view.setEmbedCode(embedCode);
    }

}