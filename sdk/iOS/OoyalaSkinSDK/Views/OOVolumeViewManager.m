//
//  OOVolumeManager.m
//  OoyalaSkinSDK
//
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOVolumeViewManager.h"
#import <MediaPlayer/MPVolumeView.h>


@implementation OOVolumeViewManager

RCT_EXPORT_MODULE();

// React automatically resolves this class as "OOVolumeView"
- (UIView *)view {
  MPVolumeView *volumeView = [MPVolumeView new];
  volumeView.showsRouteButton = NO;
  volumeView.showsVolumeSlider = YES;
  
  NSDictionary *infoPlist = NSBundle.mainBundle.infoDictionary;
  
  [volumeView setVolumeThumbImage:[UIImage imageNamed:infoPlist[@"VolumeThumbImage"]]
                         forState:UIControlStateNormal];
  
  return volumeView;
}

RCT_EXPORT_VIEW_PROPERTY(showsVolumeSlider, BOOL)
RCT_REMAP_VIEW_PROPERTY(color, tintColor, UIColor)

@end
