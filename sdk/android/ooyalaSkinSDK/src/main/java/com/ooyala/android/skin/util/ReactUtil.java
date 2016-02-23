package com.ooyala.android.skin.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import com.facebook.react.ReactInstanceManager;

/**
 * Created by dkorobov on 1/13/16.
 */
public class ReactUtil {

    public static void setJSServer(String host, Context context) {
        SharedPreferences mPreferences = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor editor = mPreferences.edit();
        editor.putString("debug_http_host", host);
        editor.apply();
    }

    public static void reloadJs(ReactInstanceManager reactInstanceManager) {
        reactInstanceManager.getDevSupportManager().handleReloadJS();
    }

}
