//
//  OOReactSkinBridgeModuleMain.m
//  OoyalaSkinSDK
//
//  Created by Maksim Kupetskii on 8/14/18.
//  Copyright © 2018 ooyala. All rights reserved.
//

#import "OOReactSkinBridgeModuleMain.h"
#import "NSMutableDictionary+Utils.h"

#import <OoyalaSDK/OODebugMode.h>
#import <OoyalaSDK/OOOoyalaPlayer.h>

@interface OOReactSkinBridgeModuleMain ()

@property (nonatomic, weak, nullable) id<OOReactSkinModelDelegate> skinModelDelegate;

@end


@implementation OOReactSkinBridgeModuleMain

@synthesize bridge;

RCT_EXPORT_MODULE(OOReactSkinBridgeModuleMain);

- (OOReactSkinBridgeModuleType)moduleType {
  return OOReactSkinBridgeModuleTypeMain;
}

- (void)setSkinViewDelegate:(nonnull id<OOReactSkinModelDelegate>)delegate {
  _skinModelDelegate = delegate;
}


#pragma mark - Constants
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
static NSString *stereoscopicButtonName = @"stereoscopic";
static NSString *audioTrackKey = @"audioTrack";

#pragma mark - Exported Methods

RCT_EXPORT_METHOD(onMounted) {
  LOG(@"onMounted - Not going to use at the moment");
}

RCT_EXPORT_METHOD(onLanguageSelected:(NSDictionary *)parameters) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.skinModelDelegate handleLanguageSelection:[parameters objectForKey:@"language"]];
  });
}

RCT_EXPORT_METHOD(onAudioTrackSelected:(NSDictionary *)parameters) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.skinModelDelegate handleAudioTrackSelection:[parameters objectForKey:audioTrackKey]];
  });
}

RCT_EXPORT_METHOD(onPress:(NSDictionary *)parameters) {
  NSString *buttonName = [parameters objectForKey:nameKey];
  dispatch_async(dispatch_get_main_queue(), ^{
    if ([buttonName isEqualToString:playPauseButtonName]) {
      [self.skinModelDelegate handlePlayPause];
    } else if([buttonName isEqualToString:playButtonName]) {
      [self.skinModelDelegate handlePlay];
    } else if([buttonName isEqualToString:rewindButtonName]) {
      [self.skinModelDelegate handleRewind];
    } else if([buttonName isEqualToString:socialShareButtonName]) {
      [self.skinModelDelegate handleSocialShare];
    } else if([buttonName isEqualToString:fullscreenButtonName]) {
      [self.skinModelDelegate toggleFullscreen];
    } else if([buttonName isEqualToString:learnMoreButtonName]) {
      [self.skinModelDelegate handleLearnMore];
    } else if([buttonName isEqualToString:skipButtonName]) {
      [self.skinModelDelegate handleSkip];
    } else if ([buttonName isEqualToString:adIconButtonName]) {
      [self.skinModelDelegate handleIconClick:[[parameters objectForKey:@"index"] integerValue]];
    } else if([buttonName isEqualToString:moreOptionButtonName]) {
      [self.skinModelDelegate handleMoreOption];
    } else if([buttonName isEqualToString:upNextDismiss]) {
      [self.skinModelDelegate handleUpNextDismiss];
    } else if([buttonName isEqualToString:upNextClick]) {
      [self.skinModelDelegate handleUpNextClick];
    } else if ([buttonName isEqualToString:adOverlayButtonName]) {
      [self.skinModelDelegate handleOverlay:[parameters objectForKey:@"clickUrl"]];
    } else if ([buttonName isEqualToString:@"PIP"]) {
      [self.skinModelDelegate handlePip];
    } else if ([buttonName isEqualToString:stereoscopicButtonName]) {
      [self.skinModelDelegate toggleStereoMode];
    }
  });
}

RCT_EXPORT_METHOD(handleTouchMove:(NSDictionary *)params) {
  NSMutableDictionary *result = [[NSMutableDictionary alloc] initWithDictionary:params];
  [result mergeWith:@{@"eventName" : @"move"}];
  [self.skinModelDelegate handleTouch:result];
}

RCT_EXPORT_METHOD(handleTouchEnd:(NSDictionary *)params) {
  NSMutableDictionary *result = [[NSMutableDictionary alloc] initWithDictionary:params];
  [result mergeWith:@{@"eventName" : @"end"}];
  [self.skinModelDelegate handleTouch:result];
}

RCT_EXPORT_METHOD(handleTouchStart: (NSDictionary *)params){
  NSMutableDictionary *result = [[NSMutableDictionary alloc] initWithDictionary:params];
  [result mergeWith:@{@"eventName" : @"start"}];
  [self.skinModelDelegate handleTouch:result];
}

RCT_EXPORT_METHOD(onScrub:(NSDictionary *)parameters) {
  Float64 position = [[parameters objectForKey:percentageKey] doubleValue];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.skinModelDelegate handleScrub:position];
  });
}

RCT_EXPORT_METHOD(setEmbedCode:(NSDictionary *)parameters) {
  NSString *embedCode = [parameters objectForKey:embedCodeKey];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.skinModelDelegate setEmbedCode:embedCode];
  });
}

RCT_EXPORT_METHOD(onDiscoveryRow:(NSDictionary *)parameters) {
  NSString *action = [parameters objectForKey:actionKey];
  NSString *bucketInfo = [parameters objectForKey:bucketInfoKey];

  if ([action isEqualToString:@"click"]) {
    NSString *embedCode = [parameters objectForKey:embedCodeKey];
    dispatch_async(dispatch_get_main_queue(), ^{
      [self.skinModelDelegate handleDiscoveryClick:bucketInfo embedCode:embedCode];
    });
  } else if ([action isEqualToString:@"impress"]) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self.skinModelDelegate handleDiscoveryImpress:bucketInfo];
    });
  }
}

@end
