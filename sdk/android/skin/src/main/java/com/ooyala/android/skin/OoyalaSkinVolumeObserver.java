package com.ooyala.android.skin;

import android.content.Context;
import android.database.ContentObserver;
import android.media.AudioManager;
import android.os.Handler;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.util.DebugMode;
/**
 * Created by ukumar on 3/7/16.
 */

/**
 * VolumeObserver listens to the volume change in the OS and fires an event to notify the react UI about the change.
 */
class OoyalaSkinVolumeObserver {
    final String TAG = this.getClass().toString();

    protected Context context;
    protected VolumeContentObserver volumeObserver;
    /**
     * Initialize an OoyalaSkinViewVolumeObserver
     * @param context
     * @param controller
     */
    public OoyalaSkinVolumeObserver(Context context, OoyalaSkinLayoutController controller) {
        //hardware volume change observer initialization
        volumeObserver = new VolumeContentObserver(context, new Handler(), controller);
        this.context = context;
        DebugMode.logV(TAG, "Registering VolumeObserver");
        context.getContentResolver().registerContentObserver(android.provider.Settings.System.CONTENT_URI, true, volumeObserver);
    }

    /**
     * Observes external volume change (e.g. hardware volume buttons)
     * and sets new progress of VolumeView.
     */
    private class VolumeContentObserver extends ContentObserver {

        private Context context;
        private OoyalaSkinLayoutController controller;

        public VolumeContentObserver(Context context, Handler handler, OoyalaSkinLayoutController controller) {
            super(handler);
            this.controller = controller;
            this.context = context;
        }

        @Override
        public boolean deliverSelfNotifications() {
            return super.deliverSelfNotifications();
        }

        @Override
        public void onChange(boolean selfChange) {
            super.onChange(selfChange);
            float volume = controller.getCurrentVolume();
            WritableMap data = Arguments.createMap();
            data.putDouble("volume", volume);
            controller.sendEvent("volumeChanged", data);
        }
    }

    public void destroy() {
        if (context != null && volumeObserver != null) {
            DebugMode.logV(TAG, "Unregistering VolumeObserver");
            context.getContentResolver().unregisterContentObserver(volumeObserver);
        }
    }
}
