package com.ooyala.android.skin;
import android.test.AndroidTestCase;
import android.util.Log;

import com.ooyala.android.skin.util.JSONDeepMerge;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by michael.len on 2/3/16.
 */
public class JSONDeepMergeTest extends AndroidTestCase {

  @Override
  protected void setUp() {
  }

  @Override
  protected void tearDown() {
  }

  public void testNullTarget() {
    JSONObject initial = null;
    JSONObject overrides = new JSONObject();
    try {
      overrides.put("second", "second");
      JSONDeepMerge.inPlaceDeepMerge(initial, overrides);
    } catch (JSONException e) {
      assertFalse("JSON Exception occurred", true);
    }

    assertNull(initial);
    assertNotNull(overrides);
  }

  public void testNullOverrides() {
    JSONObject initial = new JSONObject();
    JSONObject overrides = null;
    try {
      initial.put("first", "first");
      initial.put("second", 2);
      JSONDeepMerge.inPlaceDeepMerge(initial, overrides);
    } catch (JSONException e) {
      assertFalse("JSON Exception occurred", true);
    }

    try {
      assertEquals(2, initial.length());
      assertEquals("first", initial.getString("first"));
      assertEquals(2, initial.getInt("second"));
      assertNull(overrides);
    } catch (JSONException e) {
      assertFalse("JSON Exception occurred", true);
    }
  }
  public void testNoOverlap() {
    JSONObject initial = new JSONObject();
    JSONObject overrides = new JSONObject();
    try {
      initial.put("first", "first");
      overrides.put("second", "second");
      overrides.put("third", 3);
      JSONDeepMerge.inPlaceDeepMerge(initial, overrides);
    } catch (JSONException e) {
      assertFalse("JSON Exception occurred", true);
    }

    try {
      assertEquals(3, initial.length());
      assertEquals("first", initial.getString("first"));
      assertEquals("second", initial.getString("second"));
      assertEquals(3, initial.getInt("third"));
    } catch (JSONException e) {
      assertFalse("JSON Exception occurred", true);
    }
  }

  public void testWithOverlap() {
    JSONObject initial = new JSONObject();
    JSONObject overrides = new JSONObject();
    try {
      initial.put("first", "first");
      overrides.put("first", "overridden");
      overrides.put("second", "second");
      JSONDeepMerge.inPlaceDeepMerge(initial, overrides);
    } catch (JSONException e) {
      assertFalse("JSON Exception occurred", true);
    }

    try {
      assertEquals(2, initial.length());
      assertNotSame("first", initial.getString("first"));
      assertEquals("overridden", initial.getString("first"));
    } catch (JSONException e) {
      assertFalse("JSON Exception occurred", true);
    }
  }

  public void testWithOverlapDifferentType() {
    JSONObject initial = new JSONObject();
    JSONObject overrides = new JSONObject();
    JSONObject child = new JSONObject();
    try {
      initial.put("first", "first");
      overrides.put("first", 1);

      initial.put("second", "second");
      child.put("inchild", "inchild");
      overrides.put("second", child);

      JSONDeepMerge.inPlaceDeepMerge(initial, overrides);
    } catch (JSONException e) {
      Log.e("JSONDeepMergeTest", "JSON Exception", e);
      assertFalse("JSON Exception occurred", true);
    }

    assertEquals(2, initial.length());
    try {
      assertNotSame("first", initial.getString("first"));
    } catch (JSONException e) {
      // Supposed to fail, first is no longer a string;
    }

    try {
      assertNotSame("second", initial.getString("second"));
    } catch (JSONException e) {
      // Supposed to fail, second is no longer a string;
    }

    try {
      assertEquals(1, initial.getInt("first"));
      JSONObject checkChild = initial.getJSONObject("second");
      assertNotNull(checkChild);
      assertEquals("inchild", checkChild.getString("inchild"));
    } catch (JSONException e) {
      assertFalse("JSON Exception occurred", true);
    }
  }

  public void testWithDeepOverlap() {
    JSONObject initial = new JSONObject();
    JSONObject initialChild = new JSONObject();

    JSONObject overrides = new JSONObject();
    JSONObject overrideChild = new JSONObject();
    try {
      initialChild.put("inchild", "original");
      initialChild.put("staysSame", "staysSame");
      initial.put("child", initialChild);
      initial.put("rootSame", 9);

      overrideChild.put("inchild", "modified");
      overrideChild.put("newThing", "newThing");
      overrides.put("child", overrideChild);

      JSONDeepMerge.inPlaceDeepMerge(initial, overrides);
    } catch (JSONException e) {
      Log.e("JSONDeepMergeTest", "JSON Exception", e);
      assertFalse("JSON Exception occurred", true);
    }

    assertEquals(2, initial.length());
    try {
      JSONObject checkChild = initial.getJSONObject("child");
      assertNotNull(checkChild);
      assertEquals(3, checkChild.length());
      assertEquals("modified", checkChild.getString("inchild"));
      assertEquals("staysSame", checkChild.getString("staysSame"));
      assertEquals("newThing", checkChild.getString("newThing"));
      assertEquals(9, initial.getInt("rootSame"));
    } catch (JSONException e) {
      // Supposed to fail, first is no longer a string;
    }
  }
}
