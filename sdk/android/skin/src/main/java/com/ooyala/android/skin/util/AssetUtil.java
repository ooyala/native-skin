package com.ooyala.android.skin.util;

import android.content.Context;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;

public class AssetUtil {

public static JSONObject loadJsonAsset(Context context, String assetName) {
    String json;
    try {

      InputStream is = context.getAssets().open(assetName);
      int size = is.available();
      byte[] buffer = new byte[size];
      is.read(buffer);
      is.close();

      json = new String(buffer, "UTF-8");
    } catch (IOException ex) {
      ex.printStackTrace();
      return null;
    }
    JSONObject jsonObject;
    try {
      jsonObject = new JSONObject(json);
    } catch (JSONException e) {
      e.printStackTrace();
      return null;
    }
    return jsonObject;
  }
}
