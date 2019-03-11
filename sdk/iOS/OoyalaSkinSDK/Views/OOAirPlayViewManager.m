//
//  OOAirPlayViewManager.m
//  OoyalaSkinSDK
//
//  Created on 2/22/19.
//  Copyright © 2019 ooyala. All rights reserved.
//

#import "OOAirPlayViewManager.h"
#import <AVKit/AVRoutePickerView.h>
#import <MediaPlayer/MPVolumeView.h>

@implementation OOAirPlayViewManager

RCT_EXPORT_MODULE();

- (UIView *)view {
  if (@available(iOS 11.0, *)) {
    AVRoutePickerView *routePicker = [AVRoutePickerView new];
    routePicker.tintColor = UIColor.whiteColor;
    return routePicker;
  } else {
    MPVolumeView *volumeView = [MPVolumeView new];
    volumeView.showsVolumeSlider = NO;
    return volumeView;
  }
}

@end
