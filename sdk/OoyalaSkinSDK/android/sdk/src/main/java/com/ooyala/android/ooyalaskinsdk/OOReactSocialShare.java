package com.ooyala.android.ooyalaskinsdk;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
//import com.ooyala.android.util.DebugMode;

import java.util.EventListener;
import java.util.Observable;

import static android.support.v4.app.ActivityCompat.startActivity;


/**
 * Created by ukumar on 11/6/15.
 */
public class OOReactSocialShare extends ReactContextBaseJavaModule {

    final String TAG = this.getClass().toString();

    public OOReactSocialShare(ReactApplicationContext reactContext) {
        super(reactContext);

    }

    @ReactMethod
    public void onSocialButtonPress(ReadableMap parameters) {

        final String buttonName = parameters.getString("name");
        //DebugMode.logD(TAG, "in social class button name"+buttonName);


    }


    @Override
    public String getName() {
        return "OOReactSocialShare";
    }
}

