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

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

- (OOReactSkinBridgeModuleType)moduleType {
  return OOReactSkinBridgeModuleTypeMain;
}

- (void)setSkinViewDelegate:(nonnull id<OOReactSkinModelDelegate>)delegate {
  _skinModelDelegate = delegate;
}

#pragma mark - Constants
#pragma mark Buttons
static NSString *playPauseButtonName    = @"PlayPause";
static NSString *playButtonName         = @"Play";
static NSString *rewindButtonName       = @"rewind";
static NSString *socialShareButtonName  = @"SocialShare";
static NSString *fullscreenButtonName   = @"fullscreen";
static NSString *learnMoreButtonName    = @"LearnMore";
static NSString *skipButtonName         = @"Skip";
static NSString *moreOptionButtonName   = @"More";
static NSString *upNextDismiss          = @"upNextDismiss";
static NSString *upNextClick            = @"upNextClick";
static NSString *adIconButtonName       = @"Icon";
static NSString *adOverlayButtonName    = @"Overlay";
static NSString *stereoscopicButtonName = @"stereoscopic";
static NSString *pipButtonName          = @"PIP";
static NSString *replayButtonName       = @"replay";

#pragma mark Keys
static NSString *nameKey              = @"name";
static NSString *embedCodeKey         = @"embedCode";
static NSString *percentageKey        = @"percentage";
static NSString *languageKey          = @"language";
static NSString *bucketInfoKey        = @"bucketInfo";
static NSString *actionKey            = @"action";
static NSString *audioTrackKey        = @"audioTrack";
static NSString *indexKey             = @"index";
static NSString *clickUrlKey          = @"clickUrl";
static NSString *eventNameKey         = @"eventName";
static NSString *playbackSpeedRateKey = @"playbackSpeedRate";
static NSString *volumeKey            = @"volume";

#pragma mark Values
static NSString *startValue   = @"start";
static NSString *moveValue    = @"move";
static NSString *endValue     = @"end";
static NSString *clickValue   = @"click";
static NSString *impressValue = @"impress";

#pragma mark - Exported Methods

RCT_EXPORT_METHOD(onVolumeChanged:(NSDictionary *)parameters) {
  float volume = [parameters[volumeKey] floatValue];
  [self.skinModelDelegate handleVolumeChanged:volume];
}

RCT_EXPORT_METHOD(onMounted) {
  LOG(@"onMounted - Not going to use at the moment");
}

RCT_EXPORT_METHOD(onLanguageSelected:(NSDictionary *)parameters) {
  [self.skinModelDelegate handleLanguageSelection:parameters[languageKey]];
}

RCT_EXPORT_METHOD(onAudioTrackSelected:(NSDictionary *)parameters) {
  [self.skinModelDelegate handleAudioTrackSelection:parameters[audioTrackKey]];
}

RCT_EXPORT_METHOD(onPlaybackSpeedRateSelected:(NSDictionary *)parameters) {
  [self.skinModelDelegate handlePlaybackSpeedRateSelection:parameters[playbackSpeedRateKey]];
}

RCT_EXPORT_METHOD(onPress:(NSDictionary *)parameters) {
  NSString *buttonName = parameters[nameKey];

  if ([buttonName isEqualToString:playPauseButtonName]) {
    [self.skinModelDelegate handlePlayPause];
  } else if([buttonName isEqualToString:playButtonName]) {
    [self.skinModelDelegate handlePlay];
  } else if([buttonName isEqualToString:replayButtonName]) {
    [self.skinModelDelegate handleReplay];
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
    [self.skinModelDelegate handleIconClick:[parameters[indexKey] integerValue]];
  } else if([buttonName isEqualToString:moreOptionButtonName]) {
    [self.skinModelDelegate handleMoreOption];
  } else if([buttonName isEqualToString:upNextDismiss]) {
    [self.skinModelDelegate handleUpNextDismiss];
  } else if([buttonName isEqualToString:upNextClick]) {
    [self.skinModelDelegate handleUpNextClick];
  } else if ([buttonName isEqualToString:adOverlayButtonName]) {
    [self.skinModelDelegate handleOverlay:parameters[clickUrlKey]];
  } else if ([buttonName isEqualToString:pipButtonName]) {
    [self.skinModelDelegate handlePip];
  } else if ([buttonName isEqualToString:stereoscopicButtonName]) {
    [self.skinModelDelegate toggleStereoMode];
  }
}

RCT_EXPORT_METHOD(handleTouchStart:(NSDictionary *)params){
  NSMutableDictionary *result = [[NSMutableDictionary alloc] initWithDictionary:params];
  [result mergeWith:@{eventNameKey: startValue}];
  [self.skinModelDelegate handleTouch:result];
}

RCT_EXPORT_METHOD(handleTouchMove:(NSDictionary *)params) {
  NSMutableDictionary *result = [[NSMutableDictionary alloc] initWithDictionary:params];
  [result mergeWith:@{eventNameKey: moveValue}];
  [self.skinModelDelegate handleTouch:result];
}

RCT_EXPORT_METHOD(handleTouchEnd:(NSDictionary *)params) {
  NSMutableDictionary *result = [[NSMutableDictionary alloc] initWithDictionary:params];
  [result mergeWith:@{eventNameKey: endValue}];
  [self.skinModelDelegate handleTouch:result];
}

RCT_EXPORT_METHOD(onScrub:(NSDictionary *)parameters) {
  Float64 position = [parameters[percentageKey] doubleValue];
  [self.skinModelDelegate handleScrub:position];
}

RCT_EXPORT_METHOD(setEmbedCode:(NSDictionary *)parameters) {
  NSString *embedCode = parameters[embedCodeKey];
  [self.skinModelDelegate setEmbedCode:embedCode];
}

RCT_EXPORT_METHOD(onDiscoveryRow:(NSDictionary *)parameters) {
  NSString *action     = parameters[actionKey];
  NSString *bucketInfo = parameters[bucketInfoKey];

  if ([action isEqualToString:clickValue]) {
    NSString *embedCode = parameters[embedCodeKey];
    [self.skinModelDelegate handleDiscoveryClick:bucketInfo embedCode:embedCode];
  } else if ([action isEqualToString:impressValue]) {
    [self.skinModelDelegate handleDiscoveryImpress:bucketInfo];
  }
}

@end
