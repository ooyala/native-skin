// @flow

export type Config = {
  castControls: {
    iconStyle: {
      active: {
        color: string,
      },
      inactive: {
        color: string,
      },
    },
  },
  controlBar: {
    adScrubberBar: {
      backgroundColor: string,
      bufferedColor: string,
      playedColor: string,
    },
    scrubberBar: {
      backgroundColor: string,
      bufferedColor: string,
      playedColor: string,
      scrubberHandleBorderColor: string,
      scrubberHandleColor: string,
    },
  },
  general: {
    accentColor: string,
  },
  icons: {
    'chromecast-disconnected': {
      fontString: string,
      fontFamilyName: string,
    },
    dismiss: {
      fontString: string,
      fontFamilyName: string,
    },
  },
  live: {
    forceDvrDisabled: boolean,
  }
};
