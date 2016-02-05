package com.ooyala.android.ooyalaskinsdk.util;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

public class JSONDeepMerge {
  /**
   * Merge "overrides" into "target". If fields have equal name, merge them recursively.
   * @param target The JSONObject that is being used as the base.  Is modified in-place
   * @param overrides The JSONObject with fields to override in the target. Is unmodified
   */
  public static void inPlaceDeepMerge(JSONObject target, JSONObject overrides) throws JSONException {
    if (target == null || overrides == null) {
      return;
    }

    Iterator overridesIter = overrides.keys();
    while (overridesIter.hasNext()) {
      String key = (String)overridesIter.next();
      Object overrideValue = overrides.get(key);

      if (!target.has(key)) {
        // If target does not have the key, add it in
        target.put(key, overrideValue);
      } else {
        // existing value for "key" - recursively deep merge:
        if (overrideValue instanceof JSONObject) {

          Object targetValue = target.get(key);

          //If both are objects, we have to go deeper
          if (targetValue instanceof JSONObject) {
            inPlaceDeepMerge((JSONObject)targetValue, (JSONObject)overrideValue);
          } else {
            // If target's value is not a JSONObject, put the override JSONObject directly in the target
            target.put(key, overrideValue);
          }
        } else {
          // If override value is not a JSONObject, replace whatever the target value is with the override
          target.put(key, overrideValue);
        }
      }
    }
    return;
  }
}
