// @flow

import { requireNativeComponent } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

// TODO: Use this type to check component props.
type Props = { // eslint-disable-line no-unused-vars
  countdown: {
    automatic: boolean,
    fill_color: string,
    main_color: string,
    max_time: number,
    progress: number,
    secondary_color: string,
    stroke_width: number,
    text_color: string,
    text_size: number,
  },
  data?: {
    bucketInfo: string,
    embedCode: string
  },
  style: ViewStyleProp,
}

export default requireNativeComponent('RCTCountdownView', { name: 'CountdownTimerIos' });
