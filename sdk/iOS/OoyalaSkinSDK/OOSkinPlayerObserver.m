//
//  OOSkinPlayerObserver.m
//  OoyalaSkinSDK
//
//  Created by Michael Len on 2/25/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOSkinPlayerObserver.h"
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import "OOReactBridge.h"
#import <OoyalaSDK/OOVideo.h>
#import <OoyalaSDK/OOOoyalaError.h>
#import <OoyalaSDK/OODebugMode.h>
#import "OOLocaleHelper.h"
#import "OOSkinViewController.h"
#import "OOSkinViewController+Internal.h"
#import "OOVolumeManager.h"
#import <OoyalaSDK/OOClosedCaptions.h>
#import <OoyalaSDK/OOCaption.h>
#import <OoyalaSDK/OOSeekInfo.h>

#import "NSString+Utils.h"
#import "NSDictionary+Utils.h"
#import "OOConstant.h"

@interface OOSkinPlayerObserver ()

  @property (weak) OOOoyalaPlayer *player;
  @property (weak) OOSkinViewController *viewController;
@end

@implementation OOSkinPlayerObserver
  
- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player skinViewController:(OOSkinViewController *)viewController{
  self.player = player;
  self.viewController = viewController;

    if (self = [super init]) {
      [self addSelfAsObserverToPlayer: player];
    }
    return self;
  }

- (void) addSelfAsObserverToPlayer:(OOOoyalaPlayer *)player {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  _player = player;
  if (_player != nil) {
    SEL selector = NSSelectorFromString(@"disableAdLearnMoreButton");
    if ([player respondsToSelector:selector]) {
      [player performSelector:selector];
    }
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeStateChangedNotification:) name:OOOoyalaPlayerStateChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeDesiredStateChangedNotification:) name:OOOoyalaPlayerDesiredStateChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeCurrentItemChangedNotification:) name:OOOoyalaPlayerCurrentItemChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeTimeChangedNotification:) name:OOOoyalaPlayerTimeChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgePlayCompletedNotification:) name:OOOoyalaPlayerPlayCompletedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdStartNotification:) name:OOOoyalaPlayerAdStartedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdPodStartedNotification:) name:OOOoyalaPlayerAdPodStartedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdPodCompleteNotification:) name:OOOoyalaPlayerAdPodCompletedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgePlayStartedNotification:) name:OOOoyalaPlayerPlayStartedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeErrorNotification:) name:OOOoyalaPlayerErrorNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdTappedNotification:) name:OOOoyalaPlayerAdTappedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeEmbedCodeNotification:) name:OOOoyalaPlayerEmbedCodeSetNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdOverlayNotification:) name:OOOoyalaPlayerAdOverlayNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeSeekStartedNotification:) name:OOOoyalaPlayerSeekStartedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeSeekCompletedNotification:) name:OOOoyalaPlayerSeekCompletedNotification object:self.player];
    
  }
}


// PBA-4831 Calculate total duration from the seekable range so that seek events have a correct value for duration
- (NSNumber *) calculateTotalDuration {
    CMTimeRange seekableRange = _player.seekableTimeRange;
    Float64 duration;
    if (CMTIMERANGE_IS_INVALID(seekableRange)) {
        duration = _player.duration;
    } else {
        duration = CMTimeGetSeconds(seekableRange.duration);
    }
    return [NSNumber numberWithFloat:duration];
}

- (void)bridgeSeekStartedNotification: (NSNotification *)notification {
  
  NSDictionary *seekInfoDictionaryObject = notification.userInfo;
  OOSeekInfo *seekInfo = seekInfoDictionaryObject[@"seekInfo"];
  NSNumber *seekStart = [NSNumber numberWithFloat:seekInfo.seekStart];
  NSNumber *seekEnd = [NSNumber numberWithFloat:seekInfo.seekEnd];
  NSNumber *totalDuration = [self calculateTotalDuration];
  NSDictionary *eventBody = @{
                              @"seekstart":seekStart,
                              @"seekend":seekEnd,
                              @"duration":totalDuration};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

- (void)bridgeSeekCompletedNotification: (NSNotification *)notification {
  NSDictionary *seekInfoDictionaryObject = notification.userInfo;
  OOSeekInfo *seekInfo = seekInfoDictionaryObject[@"seekInfo"];
  NSNumber *seekStart = [NSNumber numberWithFloat:seekInfo.seekStart];
  NSNumber *seekEnd = [NSNumber numberWithFloat:seekInfo.seekEnd];
  NSNumber *totalDuration = [self calculateTotalDuration];
  NSDictionary *eventBody = @{
                              @"seekstart":seekStart,
                              @"seekend":seekEnd,
                              @"duration":totalDuration,
                              @"screenType":@"video"};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

- (void)bridgeAdOverlayNotification: (NSNotification *)notification {
  NSDictionary *overlayInfo = notification.userInfo;
  NSMutableDictionary *eventBody = [[NSMutableDictionary alloc] init];
  
  NSInteger width = [overlayInfo[@"width"] integerValue];
  NSInteger height = [overlayInfo[@"height"] integerValue];
  NSInteger expandedWidth = [overlayInfo[@"expandedWidth"] integerValue];
  NSInteger expandedHeight = [overlayInfo[@"expandedHeight"] integerValue];
  NSString *resourceUrl = overlayInfo[@"resourceUrl"];
  NSString *clickUrl = overlayInfo[@"clickUrl"] == nil ? @"": overlayInfo[@"clickUrl"];
  
  [eventBody setObject:[NSNumber numberWithInt:width] forKey:@"width"];
  [eventBody setObject:[NSNumber numberWithInt:height] forKey:@"height"];
  [eventBody setObject:[NSNumber numberWithInt:expandedWidth] forKey:@"expandedWidth"];
  [eventBody setObject:[NSNumber numberWithInt:expandedHeight] forKey:@"expandedHeight"];
  [eventBody setObject:resourceUrl forKey:@"resourceUrl"];
  [eventBody setObject:clickUrl forKey:@"clickUrl"];
  

  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

- (void)bridgeTimeChangedNotification:(NSNotification *)notification {
  CMTimeRange seekableRange = _player.seekableTimeRange;
  Float64 duration;
  Float64 adjustedPlayhead;
  if (CMTIMERANGE_IS_INVALID(seekableRange)) {
    duration = _player.duration;
    adjustedPlayhead = _player.playheadTime;
  } else {
    duration = CMTimeGetSeconds(seekableRange.duration);
    adjustedPlayhead = _player.playheadTime - CMTimeGetSeconds(seekableRange.start);
  }

  NSNumber *playheadNumber = [NSNumber numberWithFloat:adjustedPlayhead];
  NSNumber *durationNumber = [NSNumber numberWithFloat:duration];
  NSNumber *rateNumber = [NSNumber numberWithFloat:_player.playbackRate];
  NSMutableArray *cuePoints = [NSMutableArray arrayWithArray:[[_player getCuePointsAtSecondsForCurrentPlayer] allObjects]];

  NSDictionary *eventBody = @{@"duration":durationNumber,
    @"playhead":playheadNumber,
    @"rate":rateNumber,
    @"availableClosedCaptionsLanguages":self.player.availableClosedCaptionsLanguages,
    @"cuePoints":cuePoints};

  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
  [self notifyClosedCaptionsUpdate];
}

- (void)notifyClosedCaptionsUpdate {
  if ([self.player.closedCaptionsLanguage isEqualToString:OOLiveClosedCaptionsLanguage]) {
    return;
  }

  if (!self.player.currentItem.hasClosedCaptions) {
    return;
  }

  NSString *captionText = @"";
  OOCaption *caption = [_player.currentItem.closedCaptions captionForLanguage:_player.closedCaptionsLanguage time:_player.playheadTime];
  if (caption) {
    captionText = [caption text];
  }

  NSDictionary *eventBody = @{@"text":captionText};
  [OOReactBridge sendDeviceEventWithName:OO_CLOSED_CAPTIONS_UPDATE_EVENT body:eventBody];
}

- (void) bridgeCurrentItemChangedNotification:(NSNotification *)notification {
  NSString *title = self.player.currentItem.title ? self.player.currentItem.title : @"";
  NSString *itemDescription = self.player.currentItem.itemDescription ? self.player.currentItem.itemDescription : @"";
  NSString *promoUrl = self.player.currentItem.promoImageURL ? self.player.currentItem.promoImageURL : @"";
  NSString *hostedAtUrl = self.player.currentItem.hostedAtURL ? self.player.currentItem.hostedAtURL : @"";
  NSNumber *durationNumber = [NSNumber numberWithFloat:_player.currentItem.duration];
  NSNumber *frameWidth = [NSNumber numberWithFloat:self.viewController.view.frame.size.width];
  NSNumber *frameHeight = [NSNumber numberWithFloat:self.viewController.view.frame.size.height];
  NSNumber *live = [NSNumber numberWithBool:_player.currentItem.live];
  NSArray *closedCaptionsLanguages = _player.availableClosedCaptionsLanguages;
  NSNumber *volume = [NSNumber numberWithFloat:[OOVolumeManager getCurrentVolume]];
  
  NSDictionary *eventBody =
  @{@"title":title,
    @"description":itemDescription,
    @"promoUrl":promoUrl,
    @"hostedAtUrl": hostedAtUrl,
    @"duration":durationNumber,
    @"live":live,
    @"languages":closedCaptionsLanguages,
    @"width":frameWidth,
    @"height":frameHeight,
    @"volume": volume};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
  
  [self.viewController maybeLoadDiscovery:_player.currentItem.embedCode];
}

- (void) bridgeStateChangedNotification:(NSNotification *)notification {
  NSString *stateString = [OOOoyalaPlayer playerStateToString:_player.state];
  OOClosedCaptionsStyle *newClosedCaptionsDeviceStyle = [OOClosedCaptionsStyle new];
  if ([self.viewController.closedCaptionsDeviceStyle compare:newClosedCaptionsDeviceStyle] != NSOrderedSame) {
  [self.viewController ccStyleChanged:nil];
  }
  NSDictionary *eventBody = @{@"state":stateString};

  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

- (void) bridgeDesiredStateChangedNotification:(NSNotification *)notification {
  NSString *stateString = [OOOoyalaPlayer playerDesiredStateToString:_player.desiredState];
  NSDictionary *eventBody = @{@"desiredState":stateString};
  
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

- (void) bridgeErrorNotification:(NSNotification *)notification {
  OOOoyalaError *error = self.player.error;
  int errorCode = error ? error.code : -1;
  NSNumber *code = [NSNumber numberWithInt:errorCode];
  NSString *detail = _player.error.description ? self.player.error.description : @"";
  NSDictionary *eventBody = @{@"code":code,@"description":detail};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

- (void) bridgePlayCompletedNotification:(NSNotification *)notification {
  NSString *title = _player.currentItem.title ? _player.currentItem.title : @"";
  NSString *itemDescription = _player.currentItem.itemDescription ? _player.currentItem.itemDescription : @"";
  NSString *promoUrl = _player.currentItem.promoImageURL ? _player.currentItem.promoImageURL : @"";
  NSNumber *durationNumber = [NSNumber numberWithFloat:_player.currentItem.duration];

  NSDictionary *eventBody =
  @{@"title":title,
    @"description":itemDescription,
    @"promoUrl":promoUrl,
    @"duration":durationNumber};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

- (void) bridgeAdStartNotification:(NSNotification *)notification {
  //TODO: read cutomized font and font size
  static NSString *adFontFamily = @"AvenirNext-DemiBold";
  static NSUInteger adFontSize = 16;

  NSDictionary *adInfo = notification.userInfo;

  NSInteger count = [adInfo[@"count"] integerValue];
  NSInteger unplayed = [adInfo[@"unplayed"] integerValue];
  NSString *countString = [NSString stringWithFormat:@"(%ld/%ld)", (count - unplayed), (long)count];
  NSNumber *skipoffset = [NSNumber numberWithFloat:[adInfo[@"skipoffset"] floatValue]];
  NSMutableArray *icons = adInfo[@"icons"];
  NSString *title = adInfo[@"title"];
  NSString *adTitle = [NSString stringWithFormat:@"%@ ", title];
  NSString *titlePrefix = [OOLocaleHelper localizedStringFromDictionary:self.viewController.skinConfig forKey:@"Ad Playing"];
  if (title.length > 0) {
    titlePrefix = [titlePrefix stringByAppendingString:@":"];
  }
  NSString *durationString = @"00:00";
  NSString *learnMoreString = [OOLocaleHelper localizedStringFromDictionary:self.viewController.skinConfig forKey:@"Learn More"];
  NSString *skipAdString = [OOLocaleHelper localizedStringFromDictionary:self.viewController.skinConfig forKey:@"Skip Ad"];
  NSString *skipAdInTimeString = [OOLocaleHelper localizedStringFromDictionary:self.viewController.skinConfig forKey:@"Skip Ad in 00:00"];

  CGSize titleSize = [adTitle textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize titlePrefixSize = [titlePrefix textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize countSize = [countString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize durationSize = [durationString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize learnMoreSize = [learnMoreString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize skipAdSize = [skipAdString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize skipAdInTimeSize = [skipAdInTimeString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  NSDictionary *measures = @{@"learnmore":[NSNumber numberWithFloat:learnMoreSize.width],
                             @"skipad":[NSNumber numberWithFloat:skipAdSize.width],
                             @"skipadintime":[NSNumber numberWithFloat:skipAdInTimeSize.width],
                             @"duration":[NSNumber numberWithFloat:durationSize.width],
                             @"count":[NSNumber numberWithFloat:countSize.width],
                             @"title":[NSNumber numberWithFloat:titleSize.width],
                             @"prefix":[NSNumber numberWithFloat:titlePrefixSize.width]};
  NSNumber *requireControls = [NSNumber numberWithBool:[adInfo[@"requireControls"]  boolValue]];

  NSMutableDictionary *eventBody = [NSMutableDictionary dictionaryWithDictionary:adInfo];
  [eventBody setObject:measures forKey:@"measures"];
  [eventBody setObject:adTitle forKey:@"title"];
  [eventBody setObject:skipoffset forKey:@"skipoffset"];
  [eventBody setObject:requireControls forKey:@"requireControls"];
  if (icons) {
    [eventBody setObject:icons forKey:@"icons"];
  }
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];


  if (![adInfo[@"requireAdBar"] boolValue]) {
    [self.viewController disableReactViewInteraction];
  }
}

- (void) bridgeAdTappedNotification:(NSNotification *)notification {
  // Note: This is for IMA ad playback only.
  // When IMA ad plays, IMA consumes clicks for learn more, skip, etc and notify ooyala if the click is not consumed.
  // toggle play/pause as if the alice ui is clicked.
  [self.viewController playPauseFromAdTappedNotification  ];
}

- (void) bridgeAdPodStartedNotification:(NSNotification *)notification {
  [OOReactBridge sendDeviceEventWithName:notification.name body:nil];
}

- (void) bridgeAdPodCompleteNotification:(NSNotification *)notification {

  Float64 duration = _player.duration;
  Float64 playhead = _player.playheadTime;

  NSNumber *durationNumber = [NSNumber numberWithFloat:duration];
  NSNumber *playheadNumber = [NSNumber numberWithFloat:playhead];
  
  NSDictionary *eventBody = @{@"duration":durationNumber,
                              @"playhead":playheadNumber};
  
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];

  [self.viewController enableReactViewInteraction];
}

- (void) bridgePlayStartedNotification:(NSNotification *)notification {
  [OOReactBridge sendDeviceEventWithName:notification.name body:nil];
}

- (void) bridgeEmbedCodeNotification:(NSNotification *)notification {
  [OOReactBridge sendDeviceEventWithName:notification.name body:nil];
}

- (void)dealloc {
  LOG(@"OOSkinPlayerObserver.dealloc");
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
