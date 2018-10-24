package com.ooyala.android.skin.configuration;

import android.content.Context;
import android.os.Bundle;

import com.ooyala.android.skin.util.AssetUtil;
import com.ooyala.android.skin.util.BundleJSONConverter;
import com.ooyala.android.skin.util.JsonUtil;
import com.ooyala.android.util.DebugMode;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Locale;

import javax.annotation.Nullable;

public class SkinConfigManager {

  private final String TAG = this.getClass().toString();

  public static final String CONFIG_PLAYBACK_SPEED = "playbackSpeed";
  public static final String CONFIG_PLAYBACK_SPEED_OPTIONS = "options";

  public static final String CONFIG_LOCALIZATION = "localization";
  public static final String CONFIG_LOCALIZATION_FILE = "availableLanguageFile";
  public static final String CONFIG_LOCALIZATION_FILE_LANGUAGE = "language";
  public static final String CONFIG_LOCALIZATION_FILE_ANDROID_RESOURCE = "androidResource";

  public static final String CONFIG_AUDIO = "audio";
  public static final String CONFIG_AUDIO_LANGUAGE = "audioLanguage";

  public static final String CONFIG_UP_NEXT = "upNext";
  public static final String CONFIG_UP_NEXT_SHOW = "showUpNext";
  public static final boolean CONFIG_UP_NEXT_SHOW_DEFAULT = false;

  public static final String CONFIG_CLOSED_CAPTIONS_OPTIONS = "closedCaptionOptions";
  public static final String CONFIG_LOCALE = "locale";

  private final JSONObject config;

  public SkinConfigManager(JSONObject config) {
    this.config = config;
  }

  public JSONObject getClosedCaptionOptions() throws JSONException {
    return config.getJSONObject(CONFIG_CLOSED_CAPTIONS_OPTIONS);
  }

  public void putLocale(String locale) throws JSONException {
    config.put(CONFIG_LOCALE, locale);
  }

  @Nullable
  public JSONObject getPlaybackSpeedObject() {
    return config.optJSONObject(CONFIG_PLAYBACK_SPEED);
  }

  @Nullable
  public JSONArray getPlaybackSpeedOptions() {
    JSONObject playbackSpeedObject = getPlaybackSpeedObject();
    if (playbackSpeedObject != null) {
      return playbackSpeedObject.optJSONArray(CONFIG_PLAYBACK_SPEED_OPTIONS);
    }
    return null;
  }

  public JSONObject getUpNextObject() throws JSONException {
    return config.getJSONObject(CONFIG_UP_NEXT);
  }

  public boolean getShowUpNext() throws JSONException {
    return getUpNextObject().getBoolean(CONFIG_UP_NEXT_SHOW);
  }

  public boolean getShowUpNextOrDefault() {
    try {
      return getShowUpNext();
    } catch (JSONException e) {
      DebugMode.logE(TAG, "Up Next parse failed. The player will not show the up next widget.");
      return CONFIG_UP_NEXT_SHOW_DEFAULT;
    }
  }

  public JSONObject getAudioObject() throws JSONException {
    return config.getJSONObject(CONFIG_AUDIO);
  }

  public String getAudioLanguage() throws JSONException {
    return getAudioObject().getString(CONFIG_AUDIO_LANGUAGE);
  }

  public JSONObject getLocalizationObject() throws JSONException {
    return config.getJSONObject(CONFIG_LOCALIZATION);
  }

  public JSONArray getAvailableLanguageFiles() throws JSONException {
    return getLocalizationObject().getJSONArray(CONFIG_LOCALIZATION_FILE);
  }

  public HashMap<String, String> getLocaleLanguageFileNames() {
    HashMap<String, String> languageFiles = new HashMap<>();
    try {
      JSONArray localeFiles = getAvailableLanguageFiles();
      for (int i = 0; i < localeFiles.length(); i++) {
        JSONObject jsonObject = (JSONObject) localeFiles.get(i);
        String localeCode = jsonObject.getString(CONFIG_LOCALIZATION_FILE_LANGUAGE);
        String languageFile = jsonObject.getString(CONFIG_LOCALIZATION_FILE_ANDROID_RESOURCE);
        languageFiles.put(localeCode, languageFile);
      }
    } catch (JSONException e) {
      // Localization file for current locale is not set in config. Ignore.
    }
    return languageFiles;
  }

  public void injectLocalizedResources(Context context) {
    try {
      putLocale(Locale.getDefault().getLanguage());
      HashMap<String, String> languageFileNames = getLocaleLanguageFileNames();
      JSONObject localizedResources = new JSONObject();
      for (String languageKey : languageFileNames.keySet()) {
        String path = languageFileNames.get(languageKey);
        JSONObject localized = AssetUtil.loadJsonAsset(context, path);
        if (localized != null) {
          localizedResources.put(languageKey, localized);
        }
      }
      if (localizedResources.length() > 0) {
        JSONObject localizationJson = new JSONObject();
        localizationJson.put(SkinConfigManager.CONFIG_LOCALIZATION, localizedResources);
        JsonUtil.mergeJson(config, localizationJson);
      } else {
        DebugMode.logE(TAG, "No localization files found.");
      }
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public void removeNullsFromPlaybackArray() {
    JsonUtil.removeNullsFromChildArray(
      getPlaybackSpeedObject(),
      getPlaybackSpeedOptions(),
      SkinConfigManager.CONFIG_PLAYBACK_SPEED_OPTIONS
    );
  }

  public void applySkinOverrides(SkinOptions skinOptions) {
    JsonUtil.mergeJson(config, skinOptions.getSkinOverrides());
  }

  public Bundle toBundle() {
    try {
      return BundleJSONConverter.convertToBundle(config);
    } catch (JSONException e) {
      throw new RuntimeException(e);
    }
  }
}
