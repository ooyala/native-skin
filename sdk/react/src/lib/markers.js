// @flow

import Log from './log';
import type { Marker } from '../types/Markers';

// eslint-disable-next-line import/prefer-default-export
export const parseInputArray = (markers: ?Array<string>): Array<Marker> => {
  if (!markers) {
    return [];
  }

  return markers
    .map((serializedJson) => {
      try {
        return JSON.parse(serializedJson);
      } catch (error) {
        Log.error('Error caught trying parse serialized marker JSON', error);
        // Flow doesn't match input type for the map call and output of the function here. We filter out `null` values,
        // so we never get it in the result array.
        // $FlowFixMe
        return null;
      }
    })
    .filter(marker => Boolean(marker));
};
