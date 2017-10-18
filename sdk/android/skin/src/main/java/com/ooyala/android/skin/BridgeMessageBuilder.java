package com.ooyala.android.skin;

import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.AdIconInfo;
import com.ooyala.android.AdOverlayInfo;
import com.ooyala.android.AdPodInfo;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.SeekInfo;
import com.ooyala.android.captions.ClosedCaptionsStyle;
import com.ooyala.android.item.Video;
import com.ooyala.android.util.DebugMode;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.Set;

class BridgeMessageBuilder {
  private static final String TAG = BridgeMessageBuilder.class.getSimpleName();

  public static WritableMap buildTimeChangedEvent(OoyalaPlayer player) {

    WritableMap params = Arguments.createMap();

    Double duration = player.getDuration() / 1000.0;
    Double playhead = player.getPlayheadTime() / 1000.0;

    WritableArray cuePoints = Arguments.createArray();
    Set<Integer> cuePointsPercentValues = player.getCuePointsInPercentage();
    for (Iterator<Integer> i = cuePointsPercentValues.iterator(); i.hasNext(); ) {
      int cuePointLocation = (int) Math.round((i.next() / 100.0) * duration);
      cuePoints.pushInt(cuePointLocation);
    }

    WritableArray languages = Arguments.createArray();
    Set<String> ccLanguages = player.getAvailableClosedCaptionsLanguages();
    for (Iterator<String> j = ccLanguages.iterator(); j.hasNext(); ) {
      String languageItem = j.next();
      languages.pushString(languageItem);
    }
    params.putDouble("duration", duration);
    params.putDouble("playhead", playhead);
    params.putArray("availableClosedCaptionsLanguages", languages);
    params.putArray("cuePoints", cuePoints);

    return params;
  }

  public static WritableMap buildPlayCompletedParams(OoyalaPlayer player) {
    WritableMap params = Arguments.createMap();

    Video currentItem = player.getCurrentItem();
    if (currentItem != null) {
      String title = currentItem.getTitle();
      params.putString("title", title != null ? title : "");

      String description = currentItem.getDescription();
      params.putString("description", description != null ? description : "");

      String promoUrl = currentItem.getPromoImageURL(2000, 2000);
      params.putString("promoUrl", promoUrl != null ? promoUrl : "");
      //String hostedAtUrl = _player.currentItem.hostedAtURL ? _player.currentItem.hostedAtURL : "";
      Double duration = currentItem.getDuration() / 1000.0;
      params.putDouble("duration", duration);
    }
    return params;
  }

  public static WritableMap buildCurrentItemChangedParams(OoyalaPlayer player, int width, int height, int currentVolume) {
    WritableMap params = Arguments.createMap();

    Video currentItem = player.getCurrentItem();
    if (currentItem != null) {
      String title = currentItem.getTitle();
      params.putString("title", title != null ? title : "");
      String description = currentItem.getDescription();
      params.putString("description", description != null ? description : "");

      String promoUrl = currentItem.getPromoImageURL(2000, 2000);
      params.putString("promoUrl", promoUrl != null ? promoUrl : "");

      String hostedAtUrl = player.getCurrentItem().getHostedAtUrl();
      params.putString("hostedAtUrl", hostedAtUrl != null ? hostedAtUrl : "");

      Double duration = currentItem.getDuration() / 1000.0;
      params.putDouble("duration", duration);
      params.putBoolean("live", currentItem.isLive());
      params.putInt("width", width);
      params.putInt("height", height);
      params.putInt("volume", currentVolume);
      if (currentItem.hasClosedCaptions()) {
        WritableArray languages = Arguments.createArray();
        for (String s : currentItem.getClosedCaptions().getLanguages()) {
          languages.pushString(s);
        }
        params.putArray("languages", languages);
      }
    }
    return params;
  }

  public static WritableMap buildDiscoveryResultsReceivedParams(JSONArray results) {
    WritableMap params = Arguments.createMap();
    if (results != null) {
      WritableArray discoveryResults = Arguments.createArray();
      for (int i = 1; i < results.length(); i++) {
        JSONObject jsonObject = null;
        try {
          jsonObject = results.getJSONObject(i);
        } catch (JSONException e) {
          e.printStackTrace();
        }
        WritableMap argument = Arguments.createMap();
        int duration1 = Integer.parseInt(jsonObject.optString("duration").toString());
        String embedCode = jsonObject.optString("embed_code").toString();
        String imageUrl = jsonObject.optString("preview_image_url").toString();
        String name = jsonObject.optString("name").toString();
        String bucketInfo = jsonObject.optString("bucket_info").toString();
        // we assume we always get a description, even if it is empty ("").
        String description = jsonObject.optString("description").toString();
        argument.putString("bucketInfo", bucketInfo);
        argument.putString("name", name);
        argument.putString("imageUrl", imageUrl);
        argument.putInt("duration", duration1);
        argument.putString("embedCode", embedCode);
        argument.putString("description", description);
        discoveryResults.pushMap(argument);
      }
      params.putArray("results", discoveryResults);
    }
    return params;
  }

  private static double stringSize(String fontName, int fontStyle, int textSize, String text) {
    if (text == null) {
      DebugMode.logE(TAG, "Trying to perform stringSize on a null string");
      return 0;
    }
    Paint paint = new Paint();
    Rect bounds = new Rect();
    Typeface typeface = Typeface.create(fontName, fontStyle);
    paint.setTypeface(typeface);
    paint.setTextSize(textSize);
    double size = paint.measureText(text);
    return size;
  }

  public static WritableMap buildAdsParams(Object data) {
    WritableMap params = Arguments.createMap();
    WritableMap argument = Arguments.createMap();

    String fontName = "AvenirNext-DemiBold";
    int fontStyle = Typeface.BOLD;
    int textSize = 16;
    if (data != null) {
      AdPodInfo ad = (AdPodInfo) data;

      String title = ad.getTitle() != null ? ad.getTitle() : "";
      params.putString("title", title);

      String description = ad.getDescription();
      params.putString("description", description != null ? description : "");

      String clickUrl = ad.getClickUrl();
      params.putString("clickUrl", clickUrl != null ? clickUrl : "");

      int adsCount = ad.getAdsCount();
      params.putInt("count", adsCount);

      int unplayedCount = ad.getUnplayedCount();
      params.putInt("unplayedCount", unplayedCount);

      Boolean adBar = ad.isAdbar();
      params.putBoolean("requireAdBar", adBar);

      Boolean controls = ad.isControls();
      params.putBoolean("requireControls", controls);

      Double skipoffset = ad.getSkipOffset();
      params.putDouble("skipoffset", skipoffset);

      if (ad.getIcons() != null && ad.getIcons().size() > 0) {
        WritableArray icons = Arguments.createArray();
        for (int i = 0; i < ad.getIcons().size(); ++i) {
          icons.pushMap(icon2Map(i, ad.getIcons().get(i)));
        }
        params.putArray("icons", icons);
      }

      double title1 = stringSize(fontName, fontStyle, textSize, title);
      argument.putDouble("title", title1);

      //TODO: Make sure this text is localized to correct language
      double learnmore = stringSize(fontName, fontStyle, textSize, "Learn More");
      argument.putDouble("learnmore", learnmore);

      //TODO: Make sure this text is localized to correct language
      double skipAd = stringSize(fontName, fontStyle, textSize, "Skip Ad");
      argument.putDouble("skipad", skipAd);

      //TODO: Make sure this text is localized to correct language
      double skipAdInTime = stringSize(fontName, fontStyle, textSize, "Skip Ad in 00:00");
      argument.putDouble("skipadintime", skipAdInTime);

      double count = stringSize(fontName, fontStyle, textSize, "(" + adsCount + "/" + unplayedCount + ")");
      argument.putDouble("count", count);

      //TODO: Make sure this text is localized to correct language
      double prefix = stringSize(fontName, fontStyle, textSize, "Ad playing:");
      argument.putDouble("prefix", prefix);

      double duration = stringSize(fontName, fontStyle, textSize, "00:00");
      argument.putDouble("duration", duration);

      params.putMap("measures", argument);
    }
    return params;
  }

  public static WritableMap buildAdOverlayParams(AdOverlayInfo overlayInfo) {
    WritableMap params = Arguments.createMap();
    if (overlayInfo != null) {
      params.putInt("width", overlayInfo.getWidth());
      params.putInt("height", overlayInfo.getHeight());
      params.putInt("expandedWidth", overlayInfo.getExpandedWidth());
      params.putInt("expandedHeight", overlayInfo.getExpandedHeight());
      params.putString("resourceUrl", overlayInfo.getResourceUrl());
      params.putString("clickUrl", overlayInfo.getClickUrl());
    }

    return params;
  }

  private static WritableMap icon2Map(int index, AdIconInfo info) {
    WritableMap icon = Arguments.createMap();

    icon.putInt("width", info.getWidth());
    icon.putInt("height", info.getHeight());
    icon.putInt("x", info.getxPosition());
    icon.putInt("y", info.getyPosition());
    icon.putDouble("offset", info.getOffset());
    icon.putDouble("duration", info.getDuration());
    icon.putString("url", info.getResourceUrl());
    return icon;
  }

  public static WritableMap buildCaptionsStyleParameters(ClosedCaptionsStyle closedCaptionsDeviceStyle, JSONObject closedCaptionsSkinStyles) {
    WritableMap params = Arguments.createMap();
    int textColor = 16777215;
    int backgroundColor = 0;
    int edgeType = 0;
    int edgeColor = 0;
    double textSize = 20;
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
      textSize = closedCaptionsDeviceStyle.textSize;
      textColor = closedCaptionsDeviceStyle.textColor;
      backgroundColor = closedCaptionsDeviceStyle.backgroundColor;
      edgeType = closedCaptionsDeviceStyle.edgeType;
      edgeColor = closedCaptionsDeviceStyle.edgeColor;
    }

    // Looking into the closed captions skin.json doesn't work, because skin.json uses text css values like "White" that we can't use
    //else if(closedCaptionsSkinStyles != null) {
//      try{
//        textSize = (double)closedCaptionsSkinStyles.get("defaultFontSize");
//        textColor = (int)closedCaptionsSkinStyles.get("defaultTextColor");
//        backgroundColor = (int) closedCaptionsSkinStyles.get("defaultBackgroundColor");
//      } catch (JSONException e) {
//        e.printStackTrace();
//      }
//    }
    //params.putArray("textFont", closedCaptionsStyle.textFont);        //how to handle typeFace
    params.putDouble("textSize", textSize);
    params.putString("textColor", "#" + String.format("%06x", textColor & 0xFFFFFF));
    params.putString("backgroundColor", "#" + String.format("%06x", backgroundColor & 0xFFFFFF));
    params.putInt("edgeType", edgeType);
    params.putString("edgeColor", "#" + String.format("%06x", edgeColor & 0xFFFFFF));
    return params;
  }

  public static WritableMap buildAdPodCompleteParams(OoyalaPlayer player) {
    WritableMap params = Arguments.createMap();
    Double duration = player.getDuration() / 1000.0;
    Double playhead = player.getPlayheadTime() / 1000.0;
    params.putDouble("duration", duration);
    params.putDouble("playhead", playhead);
    return params;
  }

  public static WritableMap buildSeekParams(Object data) {
    WritableMap params = Arguments.createMap();
    if (data != null) {
      SeekInfo seekInfo = (SeekInfo) data;

      double seekStart = seekInfo.getSeekStart() / 1000.0;
      params.putDouble("seekstart", seekStart);

      double seekEnd = seekInfo.getSeekEnd() / 1000.0;
      params.putDouble("seekend", seekEnd);

      double totalDuration = seekInfo.getTotalDuration() / 1000.0;
      params.putDouble("duration", totalDuration);
    }
    return params;
  }

  public static WritableMap buildVRParams(boolean vrContent, boolean isStereoSupported) {
    WritableMap params = Arguments.createMap();
    params.putBoolean("vrContent", vrContent);
    params.putBoolean("stereoSupported", vrContent && isStereoSupported);
    return params;
  }
}
