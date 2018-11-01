package com.ooyala.android.skin.util;

import com.ooyala.android.util.DebugMode;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JsonUtil {

  private static final String TAG = JsonUtil.class.toString();

  public static void mergeJson(JSONObject initial, JSONObject skinOverrides) {
    try {
      JSONDeepMerge.inPlaceDeepMerge(initial, skinOverrides);
    } catch (JSONException e) {
      DebugMode.assertFail(TAG, "Could not apply overrides");
    }
  }

  /**
   * This is basically the same as JSONArray.remove() which was added in API Level 19
   */
  public static void removeNullsFromChildArray(JSONObject parentJsonObject,
                                               JSONArray childJsonArray, String childArrayName) {
    try {
      if (containsAtLeastOneNullValue(childJsonArray)) {
        parentJsonObject.put(childArrayName, cloneWithoutNullValues(childJsonArray));
      }
    } catch (JSONException e) {
      throw new RuntimeException(e);
    }
  }

  private static JSONArray cloneWithoutNullValues(JSONArray inputJsonArray) throws JSONException {
    final JSONArray outputJsonArray = new JSONArray();
    for (int i = 0; i < inputJsonArray.length(); i++) {
      if (!inputJsonArray.isNull(i)) {
          outputJsonArray.put(inputJsonArray.get(i));
      }
    }
    return outputJsonArray;
   }

  private static boolean containsAtLeastOneNullValue(JSONArray jsonArray) {
    for (int i = 0; i < jsonArray.length(); i++) {
      if (jsonArray.isNull(i)) {
        return true;
      }
    }
    return false;
  }
}
