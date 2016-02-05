package com.ooyala.android.ooyalaskinsdk.util;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.preference.PreferenceManager;
import android.provider.Settings;

import com.facebook.react.ReactInstanceManager;

import java.net.InetAddress;

/**
 * Created by dkorobov on 1/13/16.
 */
public class ReactUtil {

    public static void setJSServer(String host, Context context) {
        SharedPreferences mPreferences = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor editor = mPreferences.edit();
        editor.putString("debug_http_host", host);
        editor.putBoolean("js_dev_mode_debug", false);
        editor.apply();
    }

    public static void reloadJs(ReactInstanceManager reactInstanceManager) {
        reactInstanceManager.getDevSupportManager().handleReloadJS();
    }

}
