package com.ooyala.android.ooyalaskinsdk;

import android.graphics.Typeface;

import com.facebook.react.uimanager.CatalystStylesDiffMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIProp;
import com.ooyala.android.util.DebugMode;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by zchen on 10/26/15.
 */
public class IconTextViewManager extends SimpleViewManager<IconTextView> {
  public static final String REACT_CLASS = "RCTIconTextView";

//  @UIProp(UIProp.Type.STRING)
//  public static final String PROP_TEXT = "text";
//  @UIProp(UIProp.Type.STRING)
//  public static final String PROP_FONT_FAMILY = "fontFamily";
//  @UIProp(UIProp.Type.NUMBER)
//  public static final String PROP_FONT_SIZE = "fontSize";

  private static Map<String, Typeface> typefaceMap;
  private static final String TAG = "IconTextViewManager";

  private ThemedReactContext context;

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public IconTextView createViewInstance(ThemedReactContext context) {
    this.context = context;
    IconTextView view =  new IconTextView(context);
    view.setText("A");
    Typeface tf = this.getFontFromString("alice");
    view.setTypeface(tf);
    return view;
  }

  @Override
  public void updateView(final IconTextView view,
                         final CatalystStylesDiffMap props) {
    super.updateView(view, props);
//    if (props.hasKey(PROP_TEXT)) {
//      String text = props.getString(PROP_TEXT);
//      if (text != null) {
//        view.setText(text);
//      }
//    }
//    if (props.hasKey(PROP_FONT_FAMILY)) {
//      Typeface font = this.getFontFromString(props.getString(PROP_FONT_FAMILY));
//      if (font != null) {
//        view.setTypeface(font);
//      }
//    }
//    if (props.hasKey(PROP_FONT_SIZE)) {
//      float fontSize = props.getFloat(PROP_FONT_SIZE, 16);
//      view.setTextSize(fontSize);
//    }
  }

  private Typeface getFontFromString(String fontFamily) {
    if (fontFamily == null) {
      DebugMode.logE(TAG, "font family name cannot be null");
      return null;
    }

    if (typefaceMap == null) {
      typefaceMap = new HashMap<String, Typeface>();
    }

    if (!typefaceMap.containsKey(fontFamily)) {
      Typeface font = Typeface.createFromAsset(this.context.getAssets(), fontFamily);
      if (font != null) {
        typefaceMap.put(fontFamily, font);
      } else {
        DebugMode.logE(TAG, "cannot create font " + fontFamily + " from assets");
        return null;
      }
    }
    return typefaceMap.get(fontFamily);
  }

}
