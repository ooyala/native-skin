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
#import <OoyalaSDK/OODebugMode.h>
#import <OoyalaSDK/OODiscoveryManager.h>
#import "OOSkinViewController+Internal.h"
#import "OOUpNextManager.h"
#import "OOConstant.h"

@interface OOReactBridge()
@property OOSkinViewController *controller;
@property RCTBridge *rctBridge;
@end

@implementation OOReactBridge


RCT_EXPORT_MODULE();
static NSString *nameKey = @"name";
static NSString *embedCodeKey = @"embedCode";
static NSString *percentageKey = @"percentage";
static NSString *playPauseButtonName = @"PlayPause";
static NSString *playButtonName = @"Play";
static NSString *rewindButtonName = @"rewind";
static NSString *socialShareButtonName = @"SocialShare";
static NSString *fullscreenButtonName = @"Fullscreen";
static NSString *learnMoreButtonName = @"LearnMore";
static NSString *skipButtonName = @"Skip";
static NSString *moreOptionButtonName = @"More";
static NSString *languageKey = @"language";
static NSString *bucketInfoKey = @"bucketInfo";
static NSString *actionKey = @"action";
static NSString *upNextDismiss = @"upNextDismiss";
static NSString *upNextClick = @"upNextClick";
static NSString *adIconButtonName = @"Icon";
static NSString *adOverlayButtonName = @"Overlay";

RCT_EXPORT_METHOD(onMounted) {
  LOG(@"onMounted - Not going to use at the moment");
}

RCT_EXPORT_METHOD(onLanguageSelected:(NSDictionary *)parameters) {
  [self handleLanguageSelection:[parameters objectForKey:@"language"]];
}

RCT_EXPORT_METHOD(onPress:(NSDictionary *)parameters) {
  NSString *buttonName = [parameters objectForKey:nameKey];
  dispatch_async(dispatch_get_main_queue(), ^{
    if ([buttonName isEqualToString:playPauseButtonName]) {
      [self handlePlayPause];
    } else if([buttonName isEqualToString:playButtonName]) {
      [self handlePlay];
    } else if([buttonName isEqualToString:rewindButtonName]) {
      [self handleRewind];
    } else if([buttonName isEqualToString:socialShareButtonName]) {
      [self handleSocialShare];
    } else if([buttonName isEqualToString:fullscreenButtonName]) {
      [self.controller toggleFullscreen];
    } else if([buttonName isEqualToString:learnMoreButtonName]) {
      [self handleLearnMore];
    } else if([buttonName isEqualToString:skipButtonName]) {
      [self handleSkip];
    } else if ([buttonName isEqualToString:adIconButtonName]) {
      [self handleIconClick:[[parameters objectForKey:@"index"] integerValue]];
    } else if([buttonName isEqualToString:moreOptionButtonName]) {
      [self handleMoreOption];
    } else if([buttonName isEqualToString:upNextDismiss]) {
      [self handleUpNextDismiss];
    } else if([buttonName isEqualToString:upNextClick]) {
      [self handleUpNextClick];
    } else if ([buttonName isEqualToString:adOverlayButtonName]) {
      [self handleOverlay:[parameters objectForKey:@"clickUrl"]];
    } else if ([buttonName isEqualToString:@"PIP"]) {
      [self handlePip];
    }
  });
}

- (void)handlePip {
  [self.controller.player togglePictureInPictureMode];
}

- (void)handleIconClick: (NSInteger)index {
  [self.controller.player onAdIconClicked:index];
}

- (void)handleOverlay: (NSString *)url {
  [self.controller.player onAdOverlayClicked:url];
}

-(void) handlePlayPause {
  OOOoyalaPlayer *player = self.controller.player;
  if (player.state == OOOoyalaPlayerStatePlaying) {
    [player pause];
  } else {
    [player play];
  }
}

-(void) handlePlay {
  [self.controller.player play];
}

-(void) handleRewind {
  dispatch_async(dispatch_get_main_queue(), ^{
    OOOoyalaPlayer *player = self.controller.player;
    if (player) {
      Float64 playheadTime = player.playheadTime;
      Float64 seekBackTo = playheadTime-10;
      if (player.seekableTimeRange.start.value > seekBackTo ) {
        seekBackTo = 0;
      }
      [player seek:seekBackTo];
    }
  });
}

-(void) handleSocialShare {
  [self.controller.player pause];
}

- (void)handleLearnMore {
  [self.controller.player clickAd];
}

- (void)handleSkip {
  [self.controller.player skipAd];
}

- (void)handleMoreOption {
  [self.controller.player pause];
}

- (void)handleUpNextDismiss {
  [self.controller.upNextManager onDismissPressed];
}

- (void)handleUpNextClick {
  [self.controller.upNextManager goToNextVideo];
}

- (void)handleLanguageSelection:(NSString *)language {
  [self.controller.player setClosedCaptionsLanguage:language];
}

RCT_EXPORT_METHOD(onScrub:(NSDictionary *)parameters) {
  dispatch_async(dispatch_get_main_queue(), ^{
    OOOoyalaPlayer *player = self.controller.player;
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
    OOOoyalaPlayer *player = self.controller.player;
    [player setEmbedCode:embedCode];
    [player play];
  });
}

RCT_EXPORT_METHOD(onDiscoveryRow:(NSDictionary *)parameters) {
  NSString *action = [parameters objectForKey:actionKey];
  NSString *bucketInfo = [parameters objectForKey:bucketInfoKey];
  OOOoyalaPlayer *player = self.controller.player;
  if ([action isEqualToString:@"click"]) {
    NSString *embedCode = [parameters objectForKey:embedCodeKey];
    dispatch_async(dispatch_get_main_queue(), ^{
      [OODiscoveryManager sendClick:self.controller.skinOptions.discoveryOptions bucketInfo:bucketInfo pcode:player.pcode parameters:nil];
      [player setEmbedCode:embedCode];
      [player play];
    });
  } else if ([action isEqualToString:@"impress"]) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [OODiscoveryManager sendImpression:self.controller.skinOptions.discoveryOptions bucketInfo:bucketInfo pcode:player.pcode parameters:nil];
    });
  }
}

- (void)sendDeviceEventWithName:(NSString *)eventName body:(id)body {
  if ([self.controller isReactReady]) {
    if (![eventName isEqualToString:OOOoyalaPlayerTimeChangedNotification] &&
        ![eventName isEqualToString:OO_CLOSED_CAPTIONS_UPDATE_EVENT]) {
      LOG(@"sendDeviceEventWithName: %@", eventName);
    }
    [self.rctBridge.eventDispatcher sendDeviceEventWithName:eventName body:body];
  } else {
    [self.controller queueEventWithName:eventName body:body];
  }
}

- (RCTBridge *)bridge {
  return self.rctBridge;
}

- (void)setBridge:(RCTBridge *)bridge {
  _rctBridge = bridge;
}

- (void)registerController:(OOSkinViewController *)controller {
  self.controller = controller;
}

- (void)deregisterController:(OOSkinViewController *)controller {
  if (self.controller == controller) {
    self.controller = nil;
  };
}


- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}


@end
