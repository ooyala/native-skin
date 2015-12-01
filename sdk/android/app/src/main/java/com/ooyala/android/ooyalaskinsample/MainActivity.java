package com.ooyala.android.ooyalaskinsample;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;


import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.PlayerDomain;
import com.ooyala.android.configuration.Options;
import com.ooyala.android.ooyalaskinsdk.OoyalaSkinLayout;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Observable;
import java.util.Observer;


public class MainActivity extends Activity implements View.OnClickListener, Observer {
  final String TAG = this.getClass().toString();
  final String PCODE  = "R2d3I6s06RyB712DN0_2GsQS-R-Y";
  final String DOMAIN = "http://ooyala.com";

  private OoyalaPlayer _player;
  private Spinner _embedSpinner;
  private HashMap<String, String> _embedMap;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    OoyalaSkinLayout skinLayout = (OoyalaSkinLayout)findViewById(R.id.ooyalaSkin);
    PlayerDomain domain = new PlayerDomain(DOMAIN);
    Options options = new Options.Builder().setShowAdsControls(false)
        .setShowCuePoints(false).setShowPromoImage(true)
        .setPreloadContent(false).build();
    _player = new OoyalaPlayer(PCODE, domain, options);
    skinLayout.setupViews(getApplication(), _player);

    _embedMap = new LinkedHashMap<String, String>();
    _embedSpinner = (Spinner) findViewById(R.id.embedSpinner);
    Button setButton = (Button) findViewById(R.id.setButton);
    ArrayAdapter<String> embedAdapter = new ArrayAdapter<String>(this, R.layout.spinner_item);
    _embedSpinner.setAdapter(embedAdapter);

    setButton.setOnClickListener(this);

    //Populate the embed map
    _embedMap.put("HLS Video",    "Y1ZHB1ZDqfhCPjYYRbCEOz0GR8IsVRm1");
    _embedMap.put("MP4 Video",    "h4aHB1ZDqV7hbmLEv4xSOx3FdUUuephx");
    _embedMap.put("VOD with CCs", "92cWp0ZDpDm4Q8rzHfVK6q9m6OtFP-ww");
    _embedMap.put("WV-MP4",       "N3ZnF1ZDo2cUf0JIIFMaxv-gKgmF6Dvv");
    _embedMap.put("Avatar Widevine", "54NzJ4NTpMvOAm3p-rdp3qttbqkRad9I"); // WVM
    _embedMap.put("Channel",      "ozNTJ2ZDqvPWyXTriQF_Ovcd1VuKHGdH");
    _embedMap.put("Channel with pre-roll",    "FncDB0YTrvdMGK3Sva1NUmeQMuB33wbV");
    _embedMap.put("Multiple Google IMA",      "4wbjhoYTp6oRqD6lslRn0xYVTbm2GBzh");
    _embedMap.put("Video with Initial Time",    "Y1ZHB1ZDqfhCPjYYRbCEOz0GR8IsVRm1");

    //Update the spinner with the embed map
    embedAdapter.addAll(_embedMap.keySet());
    embedAdapter.notifyDataSetChanged();
  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.menu_main, menu);
    return true;
  }

  @Override
  public boolean onOptionsItemSelected(MenuItem item) {
    // Handle action bar item clicks here. The action bar will
    // automatically handle clicks on the Home/Up button, so long
    // as you specify a parent activity in AndroidManifest.xml.
    int id = item.getItemId();

    //noinspection SimplifiableIfStatement
    if (id == R.id.action_settings) {
      return true;
    }

    return super.onOptionsItemSelected(item);
  }

  @Override
  public void onClick(View v) {
    _player.setEmbedCode(_embedMap.get(_embedSpinner.getSelectedItem()));
  }

  @Override
  public void update(Observable arg0, Object arg1) {
    if (arg1 == OoyalaPlayer.TIME_CHANGED_NOTIFICATION) {
      return;
    }
    Log.d(TAG, "Notification Recieved: " + arg1 + " - state: " + _player.getState());
  }
}
