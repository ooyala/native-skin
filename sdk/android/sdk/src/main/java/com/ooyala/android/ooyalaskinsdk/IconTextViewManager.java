package com.ooyala.android.ooyalaskinsdk;

import android.graphics.Typeface;
import android.text.Spanned;
import android.text.TextUtils;
import android.view.Gravity;
import android.widget.TextView;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.common.annotations.VisibleForTesting;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.CatalystStylesDiffMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIProp;
import com.facebook.react.uimanager.ViewDefaults;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.views.text.ReactTextShadowNode;
import com.facebook.react.views.text.ReactTextView;
import com.ooyala.android.util.DebugMode;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by zchen on 10/26/15.
 */
public class IconTextViewManager extends BaseViewManager<IconTextView, ReactTextShadowNode> {
  @VisibleForTesting
  public static final String REACT_CLASS = "RCTIconTextView";

  @UIProp(UIProp.Type.STRING)
  public static final String PROP_FONT_FAMILY = ViewProps.FONT_FAMILY;

  private static Map<String, Typeface> typefaceMap;
  private static final String TAG = "IconTextViewManager";
  static final String FONTFILE_PREFIX ="fonts/";
  static final String FONTFILE_SUFFIX =".ttf";

  private ThemedReactContext context;

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public IconTextView createViewInstance(ThemedReactContext context) {
    this.context = context;
    return new IconTextView(context);
  }

  @ReactProp(name = ViewProps.TEXT_ALIGN)
  public void setTextAlign(IconTextView view, @Nullable String textAlign) {
    if (textAlign == null || "auto".equals(textAlign)) {
      view.setGravity(Gravity.NO_GRAVITY);
    } else if ("left".equals(textAlign)) {
      view.setGravity(Gravity.LEFT);
    } else if ("right".equals(textAlign)) {
      view.setGravity(Gravity.RIGHT);
    } else if ("center".equals(textAlign)) {
      view.setGravity(Gravity.CENTER_HORIZONTAL);
    } else {
      throw new JSApplicationIllegalArgumentException("Invalid textAlign: " + textAlign);
    }
  }

  @ReactProp(name = ViewProps.FONT_FAMILY)
  public void setFontFamily(IconTextView view, @Nullable String fontFamily) {
    if (fontFamily != null) {
      Typeface font = this.getFontFromString(fontFamily);
      if (font != null) {
        view.setTypeface(font);
        view.invalidate();
      }
    }
  }

  @ReactProp(name = ViewProps.FONT_SIZE, defaultFloat = Float.NaN)
  public void setFontSize(IconTextView view, float fontSize) {
    if (fontSize != Float.NaN ) {
      view.setTextSize(fontSize);
    }
  }

  @Override
  public void updateExtraData(IconTextView view, Object extraData) {
    String icon_id = "ic_" + extraData;
    int resourceId = context.getResources().getIdentifier(icon_id, "string", context.getPackageName());
    view.setText(context.getString(resourceId));
  }

  @Override
  public ReactTextShadowNode createCSSNodeInstance() {
    return new ReactTextShadowNode(false);
  }

  private Typeface getFontFromString(String fontFamily) {
    if (fontFamily == null) {
      DebugMode.logE(TAG, "font family name cannot be null");
      return null;
    }

    String fullFontPath = FONTFILE_PREFIX + fontFamily + FONTFILE_SUFFIX;
    if (typefaceMap == null) {
      typefaceMap = new HashMap<String, Typeface>();
    }

    if (!typefaceMap.containsKey(fontFamily)) {
      Typeface font = null;
      try {
        font = Typeface.createFromAsset(this.context.getAssets(), fullFontPath);
      } catch (RuntimeException e) {
        DebugMode.logE(TAG, "Failed to load font " + fontFamily, e);
      }
      if (font != null) {
        typefaceMap.put(fontFamily, font);
      }
    }
    return typefaceMap.get(fontFamily);
  }

}
