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
#import "OOSkinOptions.h"

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOVideo.h>
#import <OoyalaSDK/OOCaption.h>
#import <OoyalaSDK/OOClosedCaptions.h>
#import <OoyalaSDK/OODiscoveryManager.h>
#import "OOSkinViewController+Internal.h"
#import "OOUpNextManager.h"

@implementation OOReactBridge

RCT_EXPORT_MODULE();

static __weak RCTBridge *sharedBridge;
static __weak OOSkinViewController *sharedController = nil;
static NSString *nameKey = @"name";
static NSString *embedCodeKey = @"embedCode";
static NSString *percentageKey = @"percentage";
static NSString *playPauseButtonName = @"PlayPause";
static NSString *playButtonName = @"Play";
static NSString *socialShareButtonName = @"SocialShare";
static NSString *fullscreenButtonName = @"Fullscreen";
static NSString *learnMoreButtonName = @"LearnMore";
static NSString *moreOptionButtonName = @"More";
static NSString *languageKey = @"language";
static NSString *bucketInfoKey = @"bucketInfo";
static NSString *actionKey = @"action";
static NSString *upNextDismiss = @"upNextDismiss";
static NSString *upNextClick = @"upNextClick";

RCT_EXPORT_METHOD(onPress:(NSDictionary *)parameters) {
  NSString *buttonName = [parameters objectForKey:nameKey];
  dispatch_async(dispatch_get_main_queue(), ^{
    if ([buttonName isEqualToString:playPauseButtonName]) {
      [self handlePlayPause];
    } else if([buttonName isEqualToString:playButtonName]) {
      [self handlePlay];
    } else if([buttonName isEqualToString:socialShareButtonName]) {
      [self handleSocialShare];
    } else if([buttonName isEqualToString:fullscreenButtonName]) {
      [sharedController toggleFullscreen];
    } else if([buttonName isEqualToString:learnMoreButtonName]) {
      [self handleLearnMore];
    } else if([buttonName isEqualToString:moreOptionButtonName]) {
      [self handleMoreOption];
    } else if([buttonName isEqualToString:upNextDismiss]) {
      [self handleUpNextDismiss];
    } else if([buttonName isEqualToString:upNextClick]) {
      [self handleUpNextClick];
    }
  });
}

RCT_EXPORT_METHOD(onClosedCaptionUpdateRequested:(NSDictionary *)parameters) {
  NSString *language = [parameters objectForKey:languageKey];
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *eventName = @"onClosedCaptionUpdate";
    NSDictionary *body = nil;
    OOOoyalaPlayer *player = sharedController.player;
    if (player.currentItem.hasClosedCaptions) {
      OOCaption *pc = [player.currentItem.closedCaptions captionForLanguage:language time:player.playheadTime];
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
  OOOoyalaPlayer *player = sharedController.player;
  if (player.state == OOOoyalaPlayerStatePlaying) {
    [player pause];
  } else {
    [player play];
  }
}

-(void) handlePlay {
  [sharedController.player play];
}

-(void) handleSocialShare {
  [sharedController.player pause];
}

- (void)handleLearnMore {
  [sharedController.player pause];
  [sharedController.player clickAd];
}

- (void)handleMoreOption {
  [sharedController.player pause];
}

- (void)handleUpNextDismiss {
  [sharedController.upNextManager onDismissPressed];
}

- (void)handleUpNextClick {
  [sharedController.upNextManager goToNextVideo];
}

RCT_EXPORT_METHOD(onScrub:(NSDictionary *)parameters) {
  dispatch_async(dispatch_get_main_queue(), ^{
    OOOoyalaPlayer *player = sharedController.player;
    if (player) {
      CMTimeRange seekableRange = player.seekableTimeRange;
      Float64 duration = CMTimeGetSeconds(seekableRange.duration);
      Float64 start = CMTimeGetSeconds(seekableRange.start);
      NSNumber *position = [parameters objectForKey:percentageKey];
      Float64 playhead = [position doubleValue] * duration + start;
      [player seek:playhead];
    }
  });
}

RCT_EXPORT_METHOD(setEmbedCode:(NSDictionary *)parameters) {
  NSString *embedCode = [parameters objectForKey:embedCodeKey];
  dispatch_async(dispatch_get_main_queue(), ^{
    OOOoyalaPlayer *player = sharedController.player;
    [player setEmbedCode:embedCode];
    [player play];
  });
}

RCT_EXPORT_METHOD(onDiscoveryRow:(NSDictionary *)parameters) {
  NSString *action = [parameters objectForKey:actionKey];
  NSString *bucketInfo = [parameters objectForKey:bucketInfoKey];
  OOOoyalaPlayer *player = sharedController.player;
  if ([action isEqualToString:@"click"]) {
    NSString *embedCode = [parameters objectForKey:embedCodeKey];
    dispatch_async(dispatch_get_main_queue(), ^{
      [OODiscoveryManager sendClick:sharedController.skinOptions.discoveryOptions bucketInfo:bucketInfo pcode:player.pcode parameters:nil];
      [player setEmbedCode:embedCode];
      [player play];
    });
  } else if ([action isEqualToString:@"impress"]) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [OODiscoveryManager sendImpression:sharedController.skinOptions.discoveryOptions bucketInfo:bucketInfo pcode:player.pcode parameters:nil];
    });
  }
}

RCT_EXPORT_METHOD(queryState) {
  [sharedController queryState];
}

+ (void)sendDeviceEventWithName:(NSString *)eventName body:(id)body {
  NSLog(@"sendDeviceEventWithName: %@", eventName);
  [sharedBridge.eventDispatcher sendDeviceEventWithName:eventName body:body];
}

- (RCTBridge *)bridge {
  return  sharedBridge;
}

- (void)setBridge:(RCTBridge *)bridge {
  sharedBridge = bridge;
}

+ (void)registerController:(OOSkinViewController *)controller {
  sharedController = controller;
}

+ (void)deregisterController:(OOSkinViewController *)controller {
  if (sharedController == controller) {
    sharedController = nil;
  };
}


- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}


@end
