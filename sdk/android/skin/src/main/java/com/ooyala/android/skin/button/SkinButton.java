package com.ooyala.android.skin.button;

public enum SkinButton {

  PLAY_PAUSE("PlayPause"),
  PLAY("Play"),
  SHARE("Share"),
  REWIND("rewind"),
  SOCIAL_SHARE("SocialShare"),
  FULLSCREEN("Fullscreen"),
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
}