//
//  OOSkinPlayerObserver.m
//  OoyalaSkinSDK
//
//  Created by Michael Len on 2/25/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOSkinPlayerObserver.h"
#import "OOReactSkinModel.h"

#import "NSString+Utils.h"
#import "NSDictionary+Utils.h"
#import "OOConstant.h"
#import "OOLocaleHelper.h"
#import "OOVolumeManager.h"

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOVideo.h>
#import <OoyalaSDK/OOOoyalaError.h>
#import <OoyalaSDK/OODebugMode.h>
#import <OoyalaSDK/OOClosedCaptions.h>
#import <OoyalaSDK/OOCaption.h>
#import <OoyalaSDK/OOSeekInfo.h>
#import <OoyalaSDK/OOAudioTrackProtocol.h>


@interface OOSkinPlayerObserver ()

@property (weak) OOOoyalaPlayer *player;
@property (weak) OOReactSkinModel *ooReactSkinModel;

@end


@implementation OOSkinPlayerObserver
  
- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player ooReactSkinModel:(OOReactSkinModel *)ooReactSkinModel {
  _player = player;
  _ooReactSkinModel = ooReactSkinModel;

  if (self = [super init]) {
    [self addSelfAsObserverToPlayer: player];
  }
  return self;
}

- (void)addSelfAsObserverToPlayer:(OOOoyalaPlayer *)player {
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
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeHasVRContentNotification:) name:OOOoyalaPlayerVideoHasVRContent object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeHasMultiAudioNotification:) name:OOOoyalaPlayerMultiAudioEnabledNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAudioTrackChangedNotification:) name:OOOoyalaPlayerAudioTrackChangedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeCCManifestChangedNotification:) name:OOOoyalaPlayerCCManifestChangedNotification object:self.player.currentItem];
  }
}

// PBA-4831 Return total duration calculated from the seekable range
- (NSNumber *)getTotalDuration:(OOOoyalaPlayer *)player {
  CMTimeRange seekableRange = player.seekableTimeRange;
  Float64 duration;

  duration = CMTIMERANGE_IS_INVALID(seekableRange) ? player.duration : CMTimeGetSeconds(seekableRange.duration);

  return @(duration);
}

// PBA-4831 Return adjusted playhead calculated from the seekable range
- (NSNumber *)getAdjustedPlayhead:(OOOoyalaPlayer *)player {
  CMTimeRange seekableRange = player.seekableTimeRange;
  Float64 seekableStart = CMTimeGetSeconds(seekableRange.start);
  Float64 adjustedPlayhead;
  
  if (CMTIMERANGE_IS_INVALID(seekableRange)) {
    adjustedPlayhead = player.playheadTime;
  } else {
    adjustedPlayhead = player.playheadTime - seekableStart;
  }
  return @(adjustedPlayhead);
}

- (void)bridgeSeekStartedNotification:(NSNotification *)notification {
  NSDictionary *seekInfoDictionaryObject = notification.userInfo;
  OOSeekInfo *seekInfo = seekInfoDictionaryObject[@"seekInfo"];
  
  CMTimeRange seekableRange = self.player.seekableTimeRange;
  Float64 seekableStart = CMTimeGetSeconds(seekableRange.start);
  Float64 seekableDuration = CMTimeGetSeconds(seekableRange.duration);
  Float64 seekStart = seekInfo.seekStart - seekableStart;
  Float64 seekEnd = seekInfo.seekEnd - seekableStart;

  NSDictionary *eventBody = @{@"seekstart":@(seekStart),
                              @"seekend":@(seekEnd),
                              @"duration":@(seekableDuration)};
  
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeSeekCompletedNotification:(NSNotification *)notification {
  NSDictionary *seekInfoDictionaryObject = notification.userInfo;
  OOSeekInfo *seekInfo = seekInfoDictionaryObject[@"seekInfo"];
  
  CMTimeRange seekableRange = self.player.seekableTimeRange;
  Float64 seekStart = seekInfo.seekStart;
  Float64 seekEnd = seekInfo.seekEnd;
  Float64 seekableDuration = self.player.duration;
  
  // Check seekable range
  if (CMTIMERANGE_IS_VALID(seekableRange)) {
    Float64 seekableStart = CMTimeGetSeconds(seekableRange.start);
    seekableDuration = CMTimeGetSeconds(seekableRange.duration);
    
    seekStart = seekInfo.seekStart - seekableStart;
    seekEnd = seekInfo.seekEnd - seekableStart;
    
    if (seekableStart > seekInfo.seekStart) {
      seekStart = 0;
    }
  }
  
  NSDictionary *eventBody = @{@"seekstart":@(seekStart),
                              @"seekend":@(seekEnd),
                              @"duration":@(seekableDuration),
                              @"screenType":@"video"};
  
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeAdOverlayNotification:(NSNotification *)notification {
  NSDictionary *overlayInfo = notification.userInfo;
  NSMutableDictionary *eventBody = [[NSMutableDictionary alloc] init];
  
  NSInteger width = [overlayInfo[@"width"] integerValue];
  NSInteger height = [overlayInfo[@"height"] integerValue];
  NSInteger expandedWidth = [overlayInfo[@"expandedWidth"] integerValue];
  NSInteger expandedHeight = [overlayInfo[@"expandedHeight"] integerValue];
  NSString *resourceUrl = overlayInfo[@"resourceUrl"];
  NSString *clickUrl = overlayInfo[@"clickUrl"] == nil ? @"": overlayInfo[@"clickUrl"];
  
  [eventBody setObject:@(width) forKey:@"width"];
  [eventBody setObject:@(height) forKey:@"height"];
  [eventBody setObject:@(expandedWidth) forKey:@"expandedWidth"];
  [eventBody setObject:@(expandedHeight) forKey:@"expandedHeight"];
  [eventBody setObject:resourceUrl forKey:@"resourceUrl"];
  [eventBody setObject:clickUrl forKey:@"clickUrl"];

  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeTimeChangedNotification:(NSNotification *)notification {
  NSNumber *playheadNumber = [self getAdjustedPlayhead: self.player];
  NSNumber *durationNumber = [self getTotalDuration: self.player];
  NSNumber *rateNumber = @(_player.playbackRate);
  NSMutableArray *cuePoints = [NSMutableArray arrayWithArray:[[_player getCuePointsAtSecondsForCurrentPlayer] allObjects]];

  NSDictionary *eventBody = @{@"duration": durationNumber,
                              @"playhead": playheadNumber,
                              @"rate": rateNumber,
                              @"availableClosedCaptionsLanguages": self.player.availableClosedCaptionsLanguages,
                              @"cuePoints": cuePoints};
  
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
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

  NSDictionary *eventBody = @{@"text": captionText};
  [self.ooReactSkinModel sendEventWithName:OO_CLOSED_CAPTIONS_UPDATE_EVENT body:eventBody];
}

- (void)bridgeCurrentItemChangedNotification:(NSNotification *)notification {
  NSString *title = self.player.currentItem.title ? self.player.currentItem.title : @"";
  NSString *itemDescription = self.player.currentItem.itemDescription ? self.player.currentItem.itemDescription : @"";
  NSString *promoUrl = self.player.currentItem.promoImageURL ? self.player.currentItem.promoImageURL : @"";
  NSString *hostedAtUrl = self.player.currentItem.hostedAtURL ? self.player.currentItem.hostedAtURL : @"";
  NSNumber *durationNumber = @(self.player.currentItem.duration);
  NSNumber *frameWidth = @(CGRectGetWidth(self.ooReactSkinModel.videoViewFrame));
  NSNumber *frameHeight = @(CGRectGetHeight(self.ooReactSkinModel.videoViewFrame));
  NSNumber *live = @(self.player.currentItem.live);
  NSArray *closedCaptionsLanguages = self.player.availableClosedCaptionsLanguages;
  NSNumber *volume = @([OOVolumeManager getCurrentVolume]);
  
  NSDictionary *eventBody = @{@"title": title,
                              @"description": itemDescription,
                              @"promoUrl": promoUrl,
                              @"hostedAtUrl": hostedAtUrl,
                              @"duration": durationNumber,
                              @"live": live,
                              @"languages": closedCaptionsLanguages,
                              @"width": frameWidth,
                              @"height": frameHeight,
                              @"volume": volume};
  
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
  [self.ooReactSkinModel maybeLoadDiscovery:_player.currentItem.embedCode];
}

- (void)bridgeStateChangedNotification:(NSNotification *)notification {
  NSString *stateString = [OOOoyalaPlayer playerStateToString:_player.state];
  OOClosedCaptionsStyle *newClosedCaptionsDeviceStyle = [OOClosedCaptionsStyle new];
  if ([self.ooReactSkinModel.closedCaptionsDeviceStyle compare:newClosedCaptionsDeviceStyle] != NSOrderedSame) {
    [self.ooReactSkinModel ccStyleChanged:nil];
  }
  NSDictionary *eventBody = @{@"state":stateString};

  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeDesiredStateChangedNotification:(NSNotification *)notification {
  NSString *stateString = [OOOoyalaPlayer playerDesiredStateToString:_player.desiredState];
  NSDictionary *eventBody = @{@"desiredState": stateString};
  
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeErrorNotification:(NSNotification *)notification {
  OOOoyalaError *error = self.player.error;
  int errorCode = error ? error.code : -1;
  NSNumber *code = @(errorCode);
  NSString *detail = _player.error.description ? self.player.error.description : @"";
  NSDictionary *userInfo = self.player.error.userInfo ? self.player.error.userInfo : @{};
  NSDictionary *eventBody = @{@"code": code,
                              @"description": detail,
                              @"userInfo": userInfo};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgePlayCompletedNotification:(NSNotification *)notification {
  NSString *title = _player.currentItem.title ? _player.currentItem.title : @"";
  NSString *itemDescription = _player.currentItem.itemDescription ? _player.currentItem.itemDescription : @"";
  NSString *promoUrl = _player.currentItem.promoImageURL ? _player.currentItem.promoImageURL : @"";
  NSNumber *durationNumber = @(_player.currentItem.duration);

  NSDictionary *eventBody = @{@"title": title,
                              @"description": itemDescription,
                              @"promoUrl": promoUrl,
                              @"duration": durationNumber};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeAdStartNotification:(NSNotification *)notification {
  //TODO: read cutomized font and font size
  static NSString *adFontFamily = @"AvenirNext-DemiBold";
  static NSUInteger adFontSize = 16;

  NSDictionary *adInfo = notification.userInfo;

  NSInteger count = [adInfo[@"count"] integerValue];
  NSInteger unplayed = [adInfo[@"unplayed"] integerValue];
  NSString *countString = [NSString stringWithFormat:@"(%ld/%ld)", (count - unplayed), (long)count];
  NSNumber *skipoffset = @([adInfo[@"skipoffset"] floatValue]);
  NSMutableArray *icons = adInfo[@"icons"];
  NSString *title = adInfo[@"title"];
  NSString *adTitle = [NSString stringWithFormat:@"%@ ", title];
  NSString *titlePrefix = [OOLocaleHelper localizedStringFromDictionary:self.ooReactSkinModel.skinConfig forKey:@"Ad Playing"];
  if (title.length > 0) {
    titlePrefix = [titlePrefix stringByAppendingString:@":"];
  }
  NSString *durationString = @"00:00";
  NSString *learnMoreString = [OOLocaleHelper localizedStringFromDictionary:self.ooReactSkinModel.skinConfig forKey:@"Learn More"];
  NSString *skipAdString = [OOLocaleHelper localizedStringFromDictionary:self.ooReactSkinModel.skinConfig forKey:@"Skip Ad"];
  NSString *skipAdInTimeString = [OOLocaleHelper localizedStringFromDictionary:self.ooReactSkinModel.skinConfig forKey:@"Skip Ad in 00:00"];

  CGSize titleSize = [adTitle textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize titlePrefixSize = [titlePrefix textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize countSize = [countString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize durationSize = [durationString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize learnMoreSize = [learnMoreString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize skipAdSize = [skipAdString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize skipAdInTimeSize = [skipAdInTimeString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  NSDictionary *measures = @{@"learnmore":@(learnMoreSize.width),
                             @"skipad":@(skipAdSize.width),
                             @"skipadintime":@(skipAdInTimeSize.width),
                             @"duration":@(durationSize.width),
                             @"count":@(countSize.width),
                             @"title":@(titleSize.width),
                             @"prefix":@(titlePrefixSize.width)};
  NSNumber *requireControls = @([adInfo[@"requireControls"]  boolValue]);

  NSMutableDictionary *eventBody = [NSMutableDictionary dictionaryWithDictionary:adInfo];
  [eventBody setObject:measures forKey:@"measures"];
  [eventBody setObject:adTitle forKey:@"title"];
  [eventBody setObject:skipoffset forKey:@"skipoffset"];
  [eventBody setObject:requireControls forKey:@"requireControls"];
  if (icons) {
    [eventBody setObject:icons forKey:@"icons"];
  }
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];

  if (![adInfo[@"requireAdBar"] boolValue]) {
    [self.ooReactSkinModel setReactViewInteractionEnabled:NO];
  }
}

- (void)bridgeAdTappedNotification:(NSNotification *)notification {
  // Note: This is for IMA ad playback only.
  // When IMA ad plays, IMA consumes clicks for learn more, skip, etc and notify ooyala if the click is not consumed.
  // toggle play/pause as if the alice ui is clicked.
  [self.ooReactSkinModel playPauseFromAdTappedNotification];
}

- (void)bridgeAdPodStartedNotification:(NSNotification *)notification {
  [self.ooReactSkinModel sendEventWithName:notification.name body:nil];
}

- (void)bridgeAdPodCompleteNotification:(NSNotification *)notification {
  Float64 duration = _player.duration;
  Float64 playhead = _player.playheadTime;
  
  NSDictionary *eventBody = @{@"duration":@(duration),
                              @"playhead":@(playhead)};
  
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
  [self.ooReactSkinModel setReactViewInteractionEnabled:YES];
}

- (void)bridgePlayStartedNotification:(NSNotification *)notification {
  [self.ooReactSkinModel sendEventWithName:notification.name body:nil];
}

- (void)bridgeEmbedCodeNotification:(NSNotification *)notification {
  [self.ooReactSkinModel sendEventWithName:notification.name body:nil];
}

- (void)bridgeHasVRContentNotification:(NSNotification *)notification {
  NSDictionary *userInfo = notification.userInfo;
  [self.ooReactSkinModel sendEventWithName:notification.name body:userInfo];
}

- (void)bridgeHasMultiAudioNotification:(NSNotification *)notification {
  NSMutableDictionary *eventBody = [NSMutableDictionary new];
  NSMutableArray *audioTracksTitles = [NSMutableArray new];
  
  for (id<OOAudioTrackProtocol> audioTrack in [self.player availableAudioTracks]) {
    [audioTracksTitles addObject:audioTrack.title];
  }

  eventBody[@"selectedAudioTrack"] = self.player.selectedAudioTrack.title;
  eventBody[@"audioTracksTitles"] = audioTracksTitles;
  eventBody[@"multiAudioEnabled"] = @(self.player.hasMultipleAudioTracks);
  
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeAudioTrackChangedNotification:(NSNotification *)notification {
  NSDictionary *eventBody = @{@"selectedAudioTrack": self.player.selectedAudioTrack.title};
  
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeCCManifestChangedNotification:(NSNotification *)notification{
  NSArray *closedCaptionsLanguages = self.player.availableClosedCaptionsLanguages;
  NSDictionary *eventBody = @{@"languages": closedCaptionsLanguages};
  
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
  [self.ooReactSkinModel maybeLoadDiscovery:_player.currentItem.embedCode];
}

- (void)dealloc {
  LOG(@"OOSkinPlayerObserver.dealloc");
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
