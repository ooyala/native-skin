package com.ooyala.android.ooyalaskinsdk.util;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

public class JSONDeepMerge {
  /**
   * Merge "source" into "target". If fields have equal name, merge them recursively.
   * @return the merged object (target).
   */
  public static void inPlaceDeepMerge(JSONObject target, JSONObject overrides) throws JSONException {
    if (target == null || overrides == null) {
      return;
    }

    Iterator it = overrides.keys();
    while (it.hasNext()) {
      String key = (String)it.next();
      Object value = overrides.get(key);

      if (!target.has(key)) {
        // new value for "key":
        target.put(key, value);
      } else {
        // existing value for "key" - recursively deep merge:
        if (value instanceof JSONObject) {

          // If target's object "key" is not a JSONObject, just straight replace
          Object targetObject = target.get(key);
          if (targetObject instanceof JSONObject) {
            JSONObject valueJson = (JSONObject)value;
            inPlaceDeepMerge(target.getJSONObject(key), valueJson);
          } else {
            target.put(key, value);
          }
        } else {
          target.put(key, value);
        }
      }
    }
    return;
  }
}
