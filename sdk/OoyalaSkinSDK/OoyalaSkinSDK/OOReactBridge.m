/**
 * @file       OOReactBridge.m
 * @class      OOReactBridge OOReactBridge.m "OOReactBridge.m"
 * @brief      OOReactBridge
 * @details    OOReactBridge.h in OoyalaSDK
 * @date       4/2/15
 * @copyright Copyright (c) 2015 Ooyala, Inc. All rights reserved.
 */

#import "OOReactBridge.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTConvert.h"


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

RCT_EXPORT_METHOD(onPress:(NSDictionary *)parameters) {
  NSString *buttonName = [parameters objectForKey:@"name"];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    if ([buttonName isEqualToString:@"PlayPause"]) {
      if (_player.state == OOOoyalaPlayerStatePlaying) {
        [_player pause];
      } else {
        [_player play];
      }
    }
  
  });
}

RCT_EXPORT_METHOD(onScrub:(NSDictionary *)parameters) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSNumber *position = [parameters objectForKey:@"percentage"];
    [_player seek:_player.duration * [position doubleValue]];
  });
}

+ (void)sendDeviceEventWithName:(NSString *)eventName body:(id)body {
  [[OOReactBridge getInstance].bridge.eventDispatcher sendDeviceEventWithName:eventName body:body];
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}


@end
