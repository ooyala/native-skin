//
//  OOVolumeManager.m
//  OoyalaSkinSDK
//
//  Created by Zhihui Chen on 7/8/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOVolumeViewManager.h"
#import <MediaPlayer/MediaPlayer.h>

@implementation OOVolumeViewManager

RCT_EXPORT_MODULE();

-(UIView *)view {
  MPVolumeView *v = [MPVolumeView new];
  v.showsRouteButton = NO;
  v.showsVolumeSlider = YES;
  return v;
}

@end
