//
//  OOVolumeManager.m
//  OoyalaSkinSDK
//
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOVolumeViewManager.h"
#import <MediaPlayer/MPVolumeView.h>
#import <AVKit/AVKit.h>


@interface OOVolumeViewManager ()

@property (nonatomic) float volume;

@end

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

#pragma mark - Getters/setters

- (float)volume {
  return AVAudioSession.sharedInstance.outputVolume;
}

- (void)setVolume:(float)volume {
  if (volume == self.volume) {
    return;
  }
  
  MPVolumeView *volumeView = [MPVolumeView new];
  UISlider *volumeViewSlider;
  
  for (UIView *view in volumeView.subviews) {
    if ([view isKindOfClass:[UISlider class]]) {
      volumeViewSlider = (UISlider *)view;
      break;
    }
  }
  
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    volumeViewSlider.value = volume;
  });
}

RCT_REMAP_VIEW_PROPERTY(color, tintColor, UIColor)
RCT_CUSTOM_VIEW_PROPERTY(volume, float, OOVolumeViewManager) {
  self.volume = [RCTConvert float:json];
}

@end
