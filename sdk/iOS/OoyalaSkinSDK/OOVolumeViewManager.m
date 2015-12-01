//
//  OOVolumeManager.m
//  OoyalaSkinSDK
//
//  Created by Zhihui Chen on 7/8/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOVolumeViewManager.h"
#import <MediaPlayer/MPVolumeView.h>

@implementation OOVolumeViewManager

RCT_EXPORT_MODULE();

// React automatically resolves this class as "OOVolumeView"
-(UIView *)view {
  MPVolumeView *v = [MPVolumeView new];
  v.showsRouteButton = NO;
  v.showsVolumeSlider = YES;
  
  NSDictionary *infoPlist = [[NSBundle mainBundle] infoDictionary];
  
  [v setVolumeThumbImage:[UIImage imageNamed:infoPlist[@"VolumeThumbImage"]] forState:UIControlStateNormal];
  
  return v;
}

@end
