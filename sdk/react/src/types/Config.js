// @flow

export type Config = {
  controlBar: {
    adScrubberBar: {
      backgroundColor?: ?string,
      bufferedColor?: ?string,
      playedColor?: ?string,
    },
    scrubberBar: {
      backgroundColor?: ?string,
      bufferedColor?: ?string,
      playedColor?: ?string,
      scrubberHandleBorderColor?: ?string,
      scrubberHandleColor?: ?string,
    },
  },
  general: {
    accentColor?: ?string,
  },
  live?: {
    forceDvrDisabled?: ?boolean,
  }
};
