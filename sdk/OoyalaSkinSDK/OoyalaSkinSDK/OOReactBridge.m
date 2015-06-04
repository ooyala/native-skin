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

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOVideo.h>
#import <OoyalaSDK/OOCaption.h>
#import <OoyalaSDK/OOClosedCaptions.h>
#import <OoyalaSDK/OODiscoveryManager.h>

@implementation OOReactBridge

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

static OOReactBridge *sharedInstance = nil;
static NSString *nameKey = @"name";
static NSString *embedCodeKey = @"embedCode";
static NSString *percentageKey = @"percentage";
static NSString *playPauseButtonName = @"PlayPause";
static NSString *playButtonName = @"Play";
static NSString *fullscreenButtonName = @"Fullscreen";
static NSString *languageKey = @"language";
static NSString *bucketInfoKey = @"bucketInfo";
static NSString *actionKey = @"action";

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
  NSString *buttonName = [parameters objectForKey:nameKey];
  dispatch_async(dispatch_get_main_queue(), ^{
    if ([buttonName isEqualToString:playPauseButtonName]) {
      [self handlePlayPause];
    } else if ([buttonName isEqualToString:playButtonName]) {
      [self handlePlay];
    } else if ([buttonName isEqualToString:fullscreenButtonName]) {
      [_skinController toggleFullscreen];
    }
  });
}

RCT_EXPORT_METHOD(onClosedCaptionUpdateRequested:(NSDictionary *)parameters) {
  NSString *language = [parameters objectForKey:languageKey];
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *eventName = @"onClosedCaptionUpdate";
    NSDictionary *body = nil;
    if (self.player.currentItem.hasClosedCaptions) {
      OOCaption *pc = [self.player.currentItem.closedCaptions captionForLanguage:language time:self.player.playheadTime];
      if( pc != nil ) {
        body = @{ @"text":  pc.text,
                  @"begin": [NSNumber numberWithDouble:pc.begin],
                  @"end":   [NSNumber numberWithDouble:pc.end] };
     }
    }
    [OOReactBridge sendDeviceEventWithName:eventName body:body];
  });
}

-(void) handlePlayPause {
  if (_player.state == OOOoyalaPlayerStatePlaying) {
    [_player pause];
  } else {
    [_player play];
  }
}

-(void) handlePlay {
  [_player play];
}

RCT_EXPORT_METHOD(onScrub:(NSDictionary *)parameters) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSNumber *position = [parameters objectForKey:percentageKey];
    [_player seek:_player.duration * [position doubleValue]];
  });
}

RCT_EXPORT_METHOD(setEmbedCode:(NSDictionary *)parameters) {
  NSString *embedCode = [parameters objectForKey:embedCodeKey];
  dispatch_async(dispatch_get_main_queue(), ^{
    [_player setEmbedCode:embedCode];
    [_player play];
  });
}

RCT_EXPORT_METHOD(onDiscoveryRow:(NSDictionary *)parameters) {
  NSString *action = [parameters objectForKey:actionKey];
  NSString *bucketInfo = [parameters objectForKey:bucketInfoKey];
  if ([action isEqualToString:@"click"]) {
    NSString *embedCode = [parameters objectForKey:embedCodeKey];
    dispatch_async(dispatch_get_main_queue(), ^{
      [OODiscoveryManager sendClick:_skinController.discoveryOptions bucketInfo:bucketInfo pcode:_player.pcode parameters:nil];
      [_player setEmbedCode:embedCode];
      [_player play];
    });
  } else if ([action isEqualToString:@"impress"]) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [OODiscoveryManager sendImpression:_skinController.discoveryOptions bucketInfo:bucketInfo pcode:_player.pcode parameters:nil];
    });
  }
}

+ (void)sendDeviceEventWithName:(NSString *)eventName body:(id)body {
  NSLog(@"sendDeviceEventWithName: %@", eventName);
  [[OOReactBridge getInstance].bridge.eventDispatcher sendDeviceEventWithName:eventName body:body];
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}


@end
