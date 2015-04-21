/**
 * @file       OOReactBridge.m
 * @class      OOReactBridge OOReactBridge.m "OOReactBridge.m"
 * @brief      OOReactBridge
 * @details    OOReactBridge.h in OoyalaSDK
 * @date       4/2/15
 * @copyright Copyright (c) 2015 Ooyala, Inc. All rights reserved.
 */

#import "OOReactBridge.h"
#import "AppDelegate.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOVideo.h>

@implementation OOReactBridge

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

static OOReactBridge *sharedInstance = nil;

/**
// !!!Warning: this object MUST be created by the react view
// otherwise it won't be properly initialized.
// ooyala code should ALWAYS call getInstance to access
// the singleton instant
//
*/
+ (id)allocWithZone:(NSZone *)zone
{
  if (sharedInstance != nil) {
    return nil;
  }

  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

+ (instancetype)getInstance {
  return sharedInstance;
}

RCT_EXPORT_METHOD(onPress) {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (_player.state == OOOoyalaPlayerStatePlaying) {
      [_player pause];
    } else {
      [_player play];
    }
  });
}

RCT_EXPORT_METHOD(onScrub:(NSDictionary *)parameters) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSNumber *position = [parameters objectForKey:@"value"];
    [_player seek:_player.duration * [position doubleValue]];
  });
}

- (void)onEvent:(NSNotification *)notification {
  NSNumber *playheadNumber = [NSNumber numberWithFloat:_player.playheadTime];
  NSNumber *durationNumber = [NSNumber numberWithFloat:_player.duration];
  NSNumber *rateNumber = [NSNumber numberWithFloat:_player.playbackRate];
  NSString *title = _player.currentItem.title ? _player.currentItem.title : @"";

  NSDictionary * eventBody =
    @{@"duration":durationNumber,
      @"playhead":playheadNumber,
      @"rate":rateNumber,
      @"title":title};
  [_bridge.eventDispatcher sendDeviceEventWithName:@"playerState" body:eventBody];
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)setPlayer:(OOOoyalaPlayer *)player {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  _player = player;
  if (_player != nil) {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onEvent:) name:OOOoyalaPlayerStateChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onEvent:) name:OOOoyalaPlayerCurrentItemChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onEvent:) name:OOOoyalaPlayerTimeChangedNotification object:_player];
  }
}

@end
