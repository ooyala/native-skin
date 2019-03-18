// @flow

export type BaseMarker = {
  backgroundColor?: string,
  end?: number | 'end', // number of seconds or till the end
  hoverColor?: string,
  markerColor?: string,
  start: number | 'start', // number of seconds or from the start
};

export type TextMarker = BaseMarker & {
  text?: string,
  type: 'text',
};

export type IconMarker = BaseMarker & {
  iconUrl?: string,
  imageUrl?: string,
  type: 'icon',
};

export type Marker = TextMarker | IconMarker;
