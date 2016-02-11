package com.ooyala.android.ooyalaskinsdk;

import android.content.Context;
import android.database.ContentObserver;
import android.graphics.PorterDuff;
import android.media.AudioManager;
import android.os.Handler;
import android.widget.SeekBar;

/**
 * Created by dkorobov on 2/9/16.
 */
public class VolumeView extends SeekBar implements SeekBar.OnSeekBarChangeListener {

    private AudioManager audioManager;

    public VolumeView(Context context) {
        super(context);

        audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        setProgress(audioManager.getStreamVolume(AudioManager.STREAM_MUSIC));
        setMax(audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC));
        setOnSeekBarChangeListener(this);

        VolumeContentObserver volumeObserver = new VolumeContentObserver(context, new Handler(), new VolumeChangedListener() {
            @Override
            public void onVolumeChanged(int volume) {
                setProgress(volume);
            }
        });

        context.getContentResolver().registerContentObserver(android.provider.Settings.System.CONTENT_URI, true, volumeObserver);

    }

    @Override
    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
        audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, progress, 0 );

    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {

    }

    /**
     * Observes external volume change (e.g. hardware volume buttons)
     * and sets new progress of VolumeView.
     *
     */
    private class VolumeContentObserver extends ContentObserver {

        private Context context;
        private VolumeChangedListener listener;

        public VolumeContentObserver(Context context, Handler handler, VolumeChangedListener listener) {
            super(handler);
            this.context = context;
            this.listener = listener;
        }

        @Override
        public boolean deliverSelfNotifications() {
            return super.deliverSelfNotifications();
        }

        @Override
        public void onChange(boolean selfChange) {
            super.onChange(selfChange);
            AudioManager audioManager = (AudioManager) this.context.getSystemService(Context.AUDIO_SERVICE);
            int volume = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
            if(listener != null) {
                listener.onVolumeChanged(volume);
            }
        }
    }

    private interface VolumeChangedListener {
        void onVolumeChanged(int volume);
    }
}
