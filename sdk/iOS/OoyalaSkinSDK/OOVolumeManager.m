//
//  OOVolumeManager.m
//  OoyalaSkinSDK
//
//  Created by Eric Vargas on 10/26/15.
//  Copyright © 2015 ooyala. All rights reserved.
//

#import "OOVolumeManager.h"

#import <AVFoundation/AVAudioSession.h>

#import "OOReactBridge.h"

NSString *const VolumePropertyKey = @"outputVolume";
NSString *const VolumeChangeKey = @"volumeChanged";

@implementation OOVolumeManager

+ (void)addVolumeObserver:(NSObject *)observer
{
  [[AVAudioSession sharedInstance] addObserver:observer forKeyPath:VolumePropertyKey options:NSKeyValueObservingOptionNew context:nil];
}

+ (void)removeVolumeObserver:(NSObject *)observer
{
  [[AVAudioSession sharedInstance] removeObserver:observer forKeyPath:VolumePropertyKey];
}

+ (float)getCurrentVolume
{
  return [[AVAudioSession sharedInstance] outputVolume];
}

@end
