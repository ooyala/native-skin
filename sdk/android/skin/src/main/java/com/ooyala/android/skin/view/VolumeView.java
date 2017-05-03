package com.ooyala.android.skin.view;

import android.content.Context;
import android.media.AudioManager;
import android.support.v7.widget.AppCompatSeekBar;
import android.widget.SeekBar;
/**
 * Created by dkorobov on 2/9/16.
 */
public class VolumeView extends AppCompatSeekBar implements SeekBar.OnSeekBarChangeListener {

  private AudioManager audioManager;

  public VolumeView(Context context) {
    super(context);
    audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
    setProgress(audioManager.getStreamVolume(AudioManager.STREAM_MUSIC));
    setMax(audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC));
    setOnSeekBarChangeListener(this);
  }

  @Override
  public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
    audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, progress, 0);

  }

  @Override
  public void onStartTrackingTouch(SeekBar seekBar) {

  }

  @Override
  public void onStopTrackingTouch(SeekBar seekBar) {

  }
  @Override
  public void setProgress(int volume){
    super.setProgress(volume);      //hardware volume change to show up on seekBar
  }
}
