package com.ooyala.android.skin;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.AdPodInfo;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.item.Caption;
import com.ooyala.android.item.Video;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.Set;

/**
 * Created by michael.len on 2/1/16.
 */
class BridgeMessageBuilder {
  public static WritableMap buildTimeChangedEvent(OoyalaPlayer player) {
    WritableMap params = Arguments.createMap();

    Double duration = player.getDuration() / 1000.0;
    Double playhead = player.getPlayheadTime() / 1000.0;

    WritableArray cuePoints = Arguments.createArray();
    Set<Integer> cuePointsPercentValues = player.getCuePointsInPercentage();
    for (Iterator<Integer> i = cuePointsPercentValues.iterator(); i.hasNext(); ) {
      int cuePointLocation =(int) Math.round ((i.next()/100.0)*duration);
      cuePoints.pushInt(cuePointLocation);
    }

    WritableArray languages = Arguments.createArray();
    Set<String> ccLanguages = player.getAvailableClosedCaptionsLanguages();
    for (Iterator<String> j = ccLanguages.iterator(); j.hasNext(); ) {
      String languageItem=j.next();
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

  public static WritableMap buildCurrentItemChangedParams(OoyalaPlayer player, int width, int height) {
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

  public static WritableMap buildClosedCaptionUpdateParams(OoyalaPlayer player, String language, double currentTime) {
    WritableMap params = Arguments.createMap();
    Video currentItem = player.getCurrentItem();
    if (currentItem != null && currentItem.getClosedCaptions() != null) {
      Caption caption = currentItem.getClosedCaptions().getCaption(language, currentTime);
      if (caption != null) {
        params.putString("text", caption.getText());
        params.putDouble("end", caption.getEnd());
        params.putDouble("begin", caption.getBegin());
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
        argument.putString("bucketInfo", bucketInfo);
        argument.putString("name", name);
        argument.putString("imageUrl", imageUrl);
        argument.putInt("duration", duration1);
        argument.putString("embedCode", embedCode);
        discoveryResults.pushMap(argument);
      }
      params.putArray("results", discoveryResults);
    }
    return params;
  }

  public static WritableMap buildAdsParams(Object data) {
    WritableMap params = Arguments.createMap();
    WritableArray measures = Arguments.createArray();
    WritableMap argument = Arguments.createMap();

    if(data != null) {
      AdPodInfo ad = (AdPodInfo) data;

      String title = ad.getTitle();
      params.putString("title", title != null ? title : "");

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

      Boolean controls= ad.isControls();
      params.putBoolean("requireControls", controls);

      Double skipoffset = ad.getSkipOffset();
      params.putDouble("skipoffset", skipoffset);

      //hard coded the values for learnMore for now to prevent from the crash and enabling the learnmore button.
      double title1=74.672;
      argument.putDouble("title",title1);

      double learnmore=84.112;
      argument.putDouble("learnmore",learnmore);

      double count=36.304;
      argument.putDouble("count",count);

      double prefix=85.008;
      argument.putDouble("prefix",prefix);

      double duration=43.84;
      argument.putDouble("duration", duration);
      
      params.putMap("measures", argument);
    }
    return params;
  }
}
