package com.ooyala.android.skin.util;

import android.content.Context;

import com.ooyala.android.util.DebugMode;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by michael.len on 2/22/16.
 */
public class SkinConfigUtil {
  final static String TAG = SkinConfigUtil.class.toString();

  public static JSONObject loadInitialProperties(Context c, String skinConfigAssetName) {
    String json = null;
    try {

      InputStream is = c.getAssets().open(skinConfigAssetName);
      int size = is.available();
      byte[] buffer = new byte[size];
      is.read(buffer);
      is.close();

      json = new String(buffer, "UTF-8");

    } catch (IOException ex) {
      ex.printStackTrace();
      return null;
    }
    JSONObject jsonObject = null;
    try {
      jsonObject = new JSONObject(json);
    } catch (JSONException e) {
      e.printStackTrace();
      return null;
    }
    return jsonObject;
  }

  public static JSONObject loadLocalizedResources(Context c, String resourcesPath) {
    JSONObject localizedResource = loadInitialProperties(c, resourcesPath);
    return localizedResource;
  }

  public static void applySkinOverridesInPlace(JSONObject initial, JSONObject skinOverrides) {
    try {
      JSONDeepMerge.inPlaceDeepMerge(initial, skinOverrides);
    } catch (JSONException e) {
      DebugMode.assertFail(TAG, "Could not apply skin overrides to the initial skin config!");
    }
  }
}
