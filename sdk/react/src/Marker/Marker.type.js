// @flow

export type MarkerType = {
  color?: string,
  end?: number | 'end', // number of seconds or till the end
  start: number | 'start', // number of seconds or from the start
};
