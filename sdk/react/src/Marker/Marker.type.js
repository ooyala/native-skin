// @flow

type BaseMarkerType = {
  backgroundColor?: string,
  end?: number | 'end', // number of seconds or till the end
  hoverColor?: string,
  markerColor?: string,
  start: number | 'start', // number of seconds or from the start
  type: string,
};

type TextMarkerType = BaseMarkerType & {
  text?: string,
  type: 'text',
};

type IconMarkerType = BaseMarkerType & {
  iconUrl?: string,
  imageUrl?: string,
  type: 'icon',
};

export type MarkerType = IconMarkerType | TextMarkerType;
