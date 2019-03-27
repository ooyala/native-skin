// @flow

export type Config = {
  controlBar: {
    scrubberBar: {
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
