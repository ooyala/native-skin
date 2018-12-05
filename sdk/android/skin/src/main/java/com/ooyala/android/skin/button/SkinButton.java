package com.ooyala.android.skin.button;

import java.util.HashSet;
import java.util.Set;

public enum SkinButton {

  PLAY_PAUSE("PlayPause"),
  PLAY("Play"),
  SHARE("Share"),
  REWIND("rewind"),
  SOCIAL_SHARE("SocialShare"),
  FULLSCREEN("fullscreen"),
  LEARN_MORE("LearnMore"),
  MORE("More"),
  UP_NEXT_DISMISS("upNextDismiss"),
  UN_NEXT_CLICK("upNextClick"),
  BUTTON_SKIP("Skip"),
  BUTTON_AD_ICON("Icon"),
  BUTTON_ADD_OVERLAY("Overlay"),
  BUTTON_STEREOSCOPIC("stereoscopic"),
  BUTTON_PLAYBACK_SPEED_RATE("playbackSpeedRate"),
  BUTTON_REPLAY("replay"),
  UNKNOWN("unknown");

  public static final Set<SkinButton> SUPPORTED_AUDIO_BUTTONS;

  static {
    SUPPORTED_AUDIO_BUTTONS = new HashSet<>();
    SUPPORTED_AUDIO_BUTTONS.add(SkinButton.PLAY);
    SUPPORTED_AUDIO_BUTTONS.add(SkinButton.PLAY_PAUSE);
    SUPPORTED_AUDIO_BUTTONS.add(SkinButton.REWIND);
    SUPPORTED_AUDIO_BUTTONS.add(SkinButton.SHARE);
    SUPPORTED_AUDIO_BUTTONS.add(SkinButton.LEARN_MORE);
    SUPPORTED_AUDIO_BUTTONS.add(SkinButton.BUTTON_SKIP);
    SUPPORTED_AUDIO_BUTTONS.add(SkinButton.BUTTON_REPLAY);
  }

  private final String value;

  SkinButton(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  public static SkinButton fromValue(String value) {
    for (SkinButton type : SkinButton.values()) {
      if (type.getValue().equalsIgnoreCase(value)) {
        return type;
      }
    }
    return UNKNOWN;
  }

  public static boolean isSupportedAudioSkinButton(SkinButton skinButton) {
    return SUPPORTED_AUDIO_BUTTONS.contains(skinButton);
  }
}