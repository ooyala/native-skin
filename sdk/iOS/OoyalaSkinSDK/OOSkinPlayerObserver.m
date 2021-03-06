//
//  OOSkinPlayerObserver.m
//  OoyalaSkinSDK
//
//  Created on 2/25/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOSkinPlayerObserver.h"
#import "OOReactSkinModel.h"

#import "NSString+Utils.h"
#import "NSDictionary+Utils.h"
#import "OOConstant.h"
#import "OOLocaleHelper.h"

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOVideo.h>
#import <OoyalaSDK/OOOoyalaError.h>
#import <OoyalaSDK/OODebugMode.h>
#import <OoyalaSDK/OOClosedCaptions.h>
#import <OoyalaSDK/OOCaption.h>
#import <OoyalaSDK/OOSeekInfo.h>
#import <OoyalaSDK/OOAudioTrackProtocol.h>
#import <OoyalaSDK/OOAudioSession.h>
#import <OoyalaSDK/OOClosedCaptionsStyle.h>
#import <OoyalaSDK/OOStreamPlayer.h>
#import <OoyalaSDK/OOPlayerInfo.h>
#import <OoyalaSDK/OOOptions.h>

@import AVKit.AVPictureInPictureController;

@interface OOSkinPlayerObserver ()

@property (nonatomic, weak) OOOoyalaPlayer *player;
@property (nonatomic, weak) OOReactSkinModel *ooReactSkinModel;
@property (nonatomic) struct LiveAssetHelper liveHelper;
@property (nonatomic) BOOL isAdPlaying;

@end

struct LiveAssetHelper { //OS: no need to use Obj-C class until there is no logic required for calculations or so on
  NSNumber *frozenSeekBackTime;
  BOOL isOnGuard;
};

@implementation OOSkinPlayerObserver

#pragma mark - Constants
#pragma mark Keys
static NSString *codeKey         = @"code";
static NSString *stateKey        = @"state";
static NSString *desiredStateKey = @"desiredState";
static NSString *liveKey         = @"live";
static NSString *volumeKey       = @"volume";
static NSString *contentTypeKey  = @"contentType";

static NSString *seekStartKey                 = @"seekstart";
static NSString *seekEndKey                   = @"seekend";
static NSString *seekInfoKey                  = @"seekInfo";
static NSString *screenTypeKey                = @"screenType";
static NSString *durationKey                  = @"duration";
static NSString *playheadKey                  = @"playhead";
static NSString *rateKey                      = @"rate";
static NSString *titleKey                     = @"title";
static NSString *videoKey                     = @"video";
static NSString *audioKey                     = @"audio";
static NSString *playbackSpeedEnabledKey      = @"playbackSpeedEnabled";
static NSString *selectedPlaybackSpeedRateKey = @"selectedPlaybackSpeedRate";
static NSString *markersKey                   = @"markers";
static NSString *deviceKey                    = @"devices";

static NSString *languagesKey        = @"languages";
static NSString *availableCCLangsKey = @"availableClosedCaptionsLanguages";
static NSString *cuePointsKey        = @"cuePoints";
static NSString *textKey             = @"text";
static NSString *descriptionKey      = @"description";
static NSString *promoUrlKey         = @"promoUrl";
static NSString *hostedAtUrlKey      = @"hostedAtUrl";
static NSString *resourceUrlKey      = @"resourceUrl";
static NSString *clickUrlKey         = @"clickUrl";

static NSString *widthKey          = @"width";
static NSString *heigthKey         = @"height";
static NSString *expandedWidthKey  = @"expandedWidth";
static NSString *expandedHeightKey = @"expandedHeight";
static NSString *userInfoKey       = @"userInfo";

static NSString *learnMoreKey       = @"learnmore";
static NSString *skipAdKey          = @"skipad";
static NSString *skipAdInTimeKey    = @"skipadintime";
static NSString *countKey           = @"count";
static NSString *unplayedKey        = @"unplayed";
static NSString *prefixKey          = @"prefix";
static NSString *measuresKey        = @"measures";
static NSString *skipOffsetKey      = @"skipoffset";
static NSString *requireControlsKey = @"requireControls";
static NSString *iconsKey           = @"icons";

static NSString *selectedAudioTrackKey = @"selectedAudioTrack";
static NSString *audioTracksTitlesKey  = @"audioTracksTitles";
static NSString *multiAudioEnabledKey  = @"multiAudioEnabled";

static NSString *adPlayingKey    = @"Ad Playing";
static NSString *adLearnMoreKey  = @"Learn More";
static NSString *adSkipKey       = @"Skip Ad";
static NSString *adSkipInKey     = @"Skip Ad in 00:00";
static NSString *requireAdBarKey = @"requireAdBar";

static NSString *castManagerDidUpdateDevices    = @"castDevicesAvailable";
static NSString *castManagerIsConnectingDevice  = @"castConnecting";
static NSString *castManagerDidConnectDevice    = @"castConnected";
static NSString *castManagerDidDisconnectDevice = @"castDisconnected";

#pragma mark - Initialization/deint
- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
              ooReactSkinModel:(OOReactSkinModel *)ooReactSkinModel {
  if (self = [super init]) {
    _ooReactSkinModel = ooReactSkinModel;
    _player = player;
    _isAdPlaying = NO;
    [self addSelfAsObserverToPlayer:player];
  }
  return self;
}

- (void)dealloc {
  LOG(@"OOSkinPlayerObserver dealloc");
}

#pragma mark - NSNotification
- (void)addSelfAsObserverToPlayer:(OOOoyalaPlayer *)player {
  [NSNotificationCenter.defaultCenter removeObserver:self];
  if (self.player) {
    NSDictionary *notificationsSelectors = @{
                                             OOOoyalaPlayerStateChangedNotification: @"bridgeStateChangedNotification:",
                                             OOOoyalaPlayerDesiredStateChangedNotification: @"bridgeDesiredStateChangedNotification:",
                                             OOOoyalaPlayerCurrentItemChangedNotification: @"bridgeCurrentItemChangedNotification:",
                                             OOOoyalaPlayerTimeChangedNotification: @"bridgeTimeChangedNotification:",
                                             OOOoyalaPlayerPlayCompletedNotification: @"bridgePlayCompletedNotification:",
                                             OOOoyalaPlayerAdStartedNotification: @"bridgeAdStartNotification:",
                                             OOOoyalaPlayerAdPodStartedNotification: @"bridgeAdPodStartedNotification:",
                                             OOOoyalaPlayerAdPodCompletedNotification: @"bridgeAdPodCompleteNotification:",
                                             OOOoyalaPlayerPlayStartedNotification: @"bridgePlayStartedNotification:",
                                             OOOoyalaPlayerErrorNotification: @"bridgeErrorNotification:",
                                             OOOoyalaPlayerAdTappedNotification: @"bridgeAdTappedNotification:",
                                             OOOoyalaPlayerEmbedCodeSetNotification: @"bridgeEmbedCodeNotification:",
                                             OOOoyalaPlayerAdOverlayNotification: @"bridgeAdOverlayNotification:",
                                             OOOoyalaPlayerSeekStartedNotification: @"bridgeSeekStartedNotification:",
                                             OOOoyalaPlayerSeekCompletedNotification: @"bridgeSeekCompletedNotification:",
                                             OOOoyalaPlayerVideoHasVRContent: @"bridgeHasVRContentNotification:",
                                             OOOoyalaPlayerMultiAudioEnabledNotification: @"bridgeHasMultiAudioNotification:",
                                             OOOoyalaPlayerAudioTrackChangedNotification: @"bridgeAudioTrackChangedNotification:",
                                             OOOoyalaPlayerCCManifestChangedNotification: @"bridgeCCManifestChangedNotification:",
                                             OOOoyalaPlayerPlaybackSpeedEnabledNotification: @"bridgePlaybackSpeedEnabledNotification:",
                                             OOOoyalaPlayerPlaybackSpeedRateChangedChangedNotification: @"bridgePlaybackSpeedRateChangedNotification:"
                                             };
    [self addNotificationsObservers:notificationsSelectors];
  }
}

- (void)addNotificationsObservers:(NSDictionary *)notificationsSelectors {
  [notificationsSelectors enumerateKeysAndObjectsUsingBlock:^(id _Nonnull key,
                                                              id _Nonnull obj,
                                                              BOOL * _Nonnull stop) {
    [NSNotificationCenter.defaultCenter addObserver:self
                                           selector:NSSelectorFromString(obj)
                                               name:(NSString *)key
                                             object:self.player];
  }];
}

#pragma mark - Calculation helpers (private)
// PBA-4831 Return total duration calculated from the seekable range
- (NSNumber *)totalDuration {
  CMTimeRange seekableRange = self.player.seekableTimeRange;
  Float64 duration;

  duration = CMTIMERANGE_IS_INVALID(seekableRange) ?
             self.player.duration : CMTimeGetSeconds(seekableRange.duration);
  return @(duration);
}

// PBA-4831 Return adjusted playhead calculated from the seekable range
- (NSNumber *)adjustedPlayhead {
  CMTimeRange seekableRange = self.player.seekableTimeRange;
  Float64 seekableStart     = CMTimeGetSeconds(seekableRange.start);
  Float64 adjustedPlayhead  = self.player.playheadTime;

  if (!CMTIMERANGE_IS_INVALID(seekableRange)) {
    adjustedPlayhead = self.player.playheadTime - seekableStart;
  }
  return @(adjustedPlayhead);
}

#pragma mark - Sending events to bridge
- (void)bridgeSeekStartedNotification:(NSNotification *)notification {
  NSDictionary *seekInfoDictionaryObject = notification.userInfo;
  OOSeekInfo *seekInfo                   = seekInfoDictionaryObject[seekInfoKey];

  CMTimeRange seekableRange = self.player.seekableTimeRange;
  Float64 seekableStart     = CMTimeGetSeconds(seekableRange.start);
  Float64 seekableDuration  = CMTimeGetSeconds(seekableRange.duration);
  Float64 seekStart         = seekInfo.seekStart - seekableStart;
  Float64 seekEnd           = seekInfo.seekEnd - seekableStart;

  NSDictionary *eventBody = @{seekStartKey: @(seekStart),
                              seekEndKey:   @(seekEnd),
                              durationKey:  @(seekableDuration)};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeSeekCompletedNotification:(NSNotification *)notification {
  NSDictionary *seekInfoDictionaryObject = notification.userInfo;
  OOSeekInfo *seekInfo                   = seekInfoDictionaryObject[seekInfoKey];

  CMTimeRange seekableRange = self.player.seekableTimeRange;
  Float64 seekStart        = seekInfo.seekStart;
  Float64 seekEnd          = seekInfo.seekEnd;
  Float64 seekableDuration = self.player.duration;

  // Check seekable range
  if CMTIMERANGE_IS_VALID(seekableRange) {
    Float64 seekableStart = CMTimeGetSeconds(seekableRange.start);
    seekableDuration      = CMTimeGetSeconds(seekableRange.duration);

    seekStart = seekInfo.seekStart - seekableStart;
    seekEnd   = seekInfo.seekEnd - seekableStart;

    if (seekableStart > seekInfo.seekStart) {
      seekStart = 0;
    }
  }
  //OS: to keep playhead time static, because playhead and live go forward simultaneously (PLAYER-5491)
  if (self.player.currentItem.live) {
    self.liveHelper = (struct LiveAssetHelper) {self.adjustedPlayhead, YES};
  }
  
  NSDictionary *eventBody = @{seekStartKey:  @(seekStart),
                              seekEndKey:    @(seekEnd),
                              durationKey:   @(seekableDuration),
                              screenTypeKey: OOStreamPlayer.defaultPlayerInfo.isAudioOnly ?
                                             audioKey : videoKey};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeAdOverlayNotification:(NSNotification *)notification {
  NSDictionary *overlayInfo = notification.userInfo;

  NSInteger width          = [overlayInfo[widthKey] integerValue];
  NSInteger height         = [overlayInfo[heigthKey] integerValue];
  NSInteger expandedWidth  = [overlayInfo[expandedWidthKey] integerValue];
  NSInteger expandedHeight = [overlayInfo[expandedHeightKey] integerValue];
  NSString *resourceUrl    = overlayInfo[resourceUrlKey];
  NSString *clickUrl       = overlayInfo[clickUrlKey] ?: @"";

  NSDictionary *eventBody = @{widthKey:          @(width),
                              heigthKey:         @(height),
                              expandedWidthKey:  @(expandedWidth),
                              expandedHeightKey: @(expandedHeight),
                              resourceUrlKey:    resourceUrl,
                              clickUrlKey:       clickUrl};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeTimeChangedNotification:(NSNotification *)notification {
  NSNumber *playheadNumber  = self.adjustedPlayhead;
  NSNumber *durationNumber  = self.totalDuration;

  //OS: pass to JS static playhead time, because playhead and live go forward simultaneously (PLAYER-5491)
  if (self.player.currentItem.live && self.liveHelper.isOnGuard && !self.isAdPlaying) {
    playheadNumber = self.liveHelper.frozenSeekBackTime;
  }
  
  NSNumber *rateNumber      = @(self.player.playbackRate);
  NSArray *cuePoints = [NSArray arrayWithArray:[self.player getCuePointsAtSecondsForCurrentPlayer].allObjects];

  NSDictionary *eventBody = @{durationKey:         durationNumber,
                              playheadKey:         playheadNumber,
                              rateKey:             rateNumber,
                              availableCCLangsKey: self.player.availableClosedCaptionsLanguages,
                              cuePointsKey:        cuePoints};
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

  OOCaption *caption = [self.player.currentItem.closedCaptions captionForLanguage:self.player.closedCaptionsLanguage
                                                                             time:self.player.playheadTime];
  NSString *captionText = caption.text ?: @"";
  
  NSDictionary *eventBody = @{textKey: captionText};
  [self.ooReactSkinModel sendEventWithName:OO_CLOSED_CAPTIONS_UPDATE_EVENT body:eventBody];
}

- (void)bridgeCurrentItemChangedNotification:(NSNotification *)notification {
  [self.ooReactSkinModel forceUpdateCast];
  
  NSString *title                  = self.player.currentItem.title ?: @"";
  NSString *itemDescription        = self.player.currentItem.itemDescription ?: @"";
  NSString *promoUrl               = self.player.currentItem.promoImageURL ?: @"";
  NSString *hostedAtUrl            = self.player.currentItem.hostedAtURL ?: @"";
  NSNumber *durationNumber         = @(self.player.currentItem.duration);
  NSNumber *frameWidth             = @(CGRectGetWidth(self.ooReactSkinModel.videoViewFrame));
  NSNumber *frameHeight            = @(CGRectGetHeight(self.ooReactSkinModel.videoViewFrame));
  NSNumber *live                   = @(self.player.currentItem.live);
  NSArray *closedCaptionsLanguages = self.player.availableClosedCaptionsLanguages;
  NSNumber *volume                 = @(OOAudioSession.sharedInstance.applicationVolume);
  NSString *contentType            = OOStreamPlayer.defaultPlayerInfo.isAudioOnly ?
                                     @"Audio" : @"Video";

  NSArray *markersStrings          = self.player.currentItem.markersJSONArray;

  NSDictionary *eventBody = @{titleKey:       title,
                              descriptionKey: itemDescription,
                              promoUrlKey:    promoUrl,
                              hostedAtUrlKey: hostedAtUrl,
                              durationKey:    durationNumber,
                              liveKey:        live,
                              languagesKey:   closedCaptionsLanguages,
                              widthKey:       frameWidth,
                              heigthKey:      frameHeight,
                              volumeKey:      volume,
                              contentTypeKey: contentType,
                              markersKey:     markersStrings
                              };
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
  [self.ooReactSkinModel maybeLoadDiscovery:self.player.currentItem.embedCode];
  
  //OS: Flag must be changed depends on if current asset has new is-live-status
  self.liveHelper = (struct LiveAssetHelper) {self.adjustedPlayhead, self.player.currentItem.live};
}

- (void)bridgeStateChangedNotification:(NSNotification *)notification {
  NSNumber *stateObject = notification.userInfo[@"newState"] ?: @(self.player.state);
  NSString *stateString = [OOOoyalaPlayerStateConverter playerStateToString:stateObject.integerValue];
  
  //OS: for live assets need to update frozen time, because playhead that based on current live position was changed since player was paused
  if (self.player.currentItem.live && self.player.state == OOOoyalaPlayerStatePlaying) {
    self.liveHelper = (struct LiveAssetHelper) {self.adjustedPlayhead, YES};
  }
  OOClosedCaptionsStyle *newClosedCaptionsDeviceStyle = [OOClosedCaptionsStyle new];
  if ([self.ooReactSkinModel.closedCaptionsDeviceStyle compare:newClosedCaptionsDeviceStyle] != NSOrderedSame) {
    [self.ooReactSkinModel ccStyleChanged:nil];
  }

  NSDictionary *eventBody = @{stateKey: stateString};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeDesiredStateChangedNotification:(NSNotification *)notification {
  NSString *stateString   = [OOOoyalaPlayerStateConverter playerDesiredStateToString:self.player.desiredState];
  NSDictionary *eventBody = @{desiredStateKey: stateString};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeErrorNotification:(NSNotification *)notification {
  OOOoyalaError *error = self.player.error;
  int errorCode = error ? error.code : -1;
  NSNumber *code          = @(errorCode);
  NSString *detailRaw     = self.player.error.description ?: @"";
  NSMutableString *detail = [NSMutableString stringWithString:detailRaw];
  NSDictionary *userInfo  = self.player.error.userInfo ?: @{};

  if (self.player.currentItem.haEnabled && self.player.currentItem.retryCount > 0) {
    [detail appendString:@"\n\nWe are trying to reconnect"];
  }

  NSDictionary *eventBody = @{codeKey:        code,
                              descriptionKey: detail,
                              userInfoKey:    userInfo,
                              screenTypeKey:  OOStreamPlayer.defaultPlayerInfo.isAudioOnly ?
                                              @"audio" : @"video"};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgePlayCompletedNotification:(NSNotification *)notification {
  NSString *title           = self.player.currentItem.title ?: @"";
  NSString *itemDescription = self.player.currentItem.itemDescription ?: @"";
  NSString *promoUrl        = self.player.currentItem.promoImageURL ?: @"";
  NSNumber *durationNumber  = @(self.player.currentItem.duration);

  NSDictionary *eventBody = @{titleKey:       title,
                              descriptionKey: itemDescription,
                              promoUrlKey:    promoUrl,
                              durationKey:    durationNumber};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeAdStartNotification:(NSNotification *)notification {
  //TODO: read cutomized font and font size
  static NSString *adFontFamily = @"AvenirNext-DemiBold";
  static NSUInteger adFontSize  = 16;

  NSDictionary *adInfo = notification.userInfo;

  NSInteger count       = [adInfo[countKey] integerValue];
  NSInteger unplayed    = [adInfo[unplayedKey] integerValue];
  NSString *countString = [NSString stringWithFormat:@"(%ld/%ld)", (long)(count - unplayed), (long)count];
  NSNumber *skipoffset  = @([adInfo[skipOffsetKey] floatValue]);
  NSArray *icons        = adInfo[iconsKey];
  NSString *title       = adInfo[titleKey];
  NSString *adTitle     = [NSString stringWithFormat:@"%@ ", title];
  NSString *titlePrefix = [OOLocaleHelper localizedStringFromDictionary:self.ooReactSkinModel.skinConfig
                                                                 forKey:adPlayingKey];
  if (title.length > 0) {
    titlePrefix = [titlePrefix stringByAppendingString:@":"];
  }
  NSString *durationString     = @"00:00";
  NSString *learnMoreString    = [OOLocaleHelper localizedStringFromDictionary:self.ooReactSkinModel.skinConfig
                                                                        forKey:adLearnMoreKey];
  NSString *skipAdString       = [OOLocaleHelper localizedStringFromDictionary:self.ooReactSkinModel.skinConfig
                                                                        forKey:adSkipKey];
  NSString *skipAdInTimeString = [OOLocaleHelper localizedStringFromDictionary:self.ooReactSkinModel.skinConfig
                                                                        forKey:adSkipInKey];

  CGSize titleSize        = [adTitle            textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize titlePrefixSize  = [titlePrefix        textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize countSize        = [countString        textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize durationSize     = [durationString     textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize learnMoreSize    = [learnMoreString    textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize skipAdSize       = [skipAdString       textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize skipAdInTimeSize = [skipAdInTimeString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  NSDictionary *measures = @{learnMoreKey:    @(learnMoreSize.width),
                             skipAdKey:       @(skipAdSize.width),
                             skipAdInTimeKey: @(skipAdInTimeSize.width),
                             durationKey:     @(durationSize.width),
                             countKey:        @(countSize.width),
                             titleKey:        @(titleSize.width),
                             prefixKey:       @(titlePrefixSize.width)};
  NSNumber *requireControls = @([adInfo[requireControlsKey]  boolValue]);

  NSMutableDictionary *eventBody = [NSMutableDictionary dictionaryWithDictionary:adInfo];
  eventBody[measuresKey]        = measures;
  eventBody[titleKey]           = adTitle;
  eventBody[skipOffsetKey]      = skipoffset;
  eventBody[requireControlsKey] = requireControls;
  eventBody[iconsKey]           = icons;
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];

  if (![adInfo[requireAdBarKey] boolValue]) {
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
  self.isAdPlaying = YES;
  [self.ooReactSkinModel sendEventWithName:notification.name body:nil];
}

- (void)bridgeAdPodCompleteNotification:(NSNotification *)notification {
  self.isAdPlaying = NO;
  NSNumber *playheadNumber  = self.adjustedPlayhead;
  NSNumber *durationNumber  = self.totalDuration;
  
  //OS: pass to JS static playhead time, because playhead and live go forward simultaneously (PLAYER-5491)
  if (self.player.currentItem.live && self.liveHelper.isOnGuard) {
    playheadNumber = self.liveHelper.frozenSeekBackTime;
  }
  
  NSDictionary *eventBody = @{durationKey: durationNumber,
                              playheadKey: playheadNumber};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
  [self.ooReactSkinModel setReactViewInteractionEnabled:YES];
}

- (void)bridgePlayStartedNotification:(NSNotification *)notification {
  //OS: this is the point where player controlls on JS-Video-view appears, so it's usefull to set visibility of button for device-idiom-depened feature
  //TODO: used in many places, so should be moved to new method of  OOOoyalaPlayer
  BOOL isPiPSupportRequested = self.player.options.enablePictureInPictureSupport;
  BOOL isButtonVisible = isPiPSupportRequested &&
                         AVPictureInPictureController.isPictureInPictureSupported &&
                         !self.player.isAudioOnly;
  id params = @{isPipButtonVisibleKey: @(isButtonVisible)};
  [self.ooReactSkinModel sendEventWithName:notification.name body:params];
}

- (void)bridgePlaybackSpeedEnabledNotification:(NSNotification *)notification {
  NSDictionary *eventBody = @{playbackSpeedEnabledKey: @(self.player.isPlaybackSpeedEnabled),
                              selectedPlaybackSpeedRateKey: @(self.player.selectedPlaybackSpeedRate)};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgePlaybackSpeedRateChangedNotification:(NSNotification *)notification {
  NSDictionary *eventBody = @{selectedPlaybackSpeedRateKey: @(self.player.selectedPlaybackSpeedRate)};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeEmbedCodeNotification:(NSNotification *)notification {
  [self.ooReactSkinModel sendEventWithName:notification.name body:nil];
}

- (void)bridgeHasVRContentNotification:(NSNotification *)notification {
  NSDictionary *userInfo = notification.userInfo;
  [self.ooReactSkinModel sendEventWithName:notification.name body:userInfo];
}

- (void)bridgeHasMultiAudioNotification:(NSNotification *)notification {
  NSMutableArray *audioTracksTitles = [NSMutableArray new];
  for (id<OOAudioTrackProtocol> audioTrack in self.player.availableAudioTracks) {
    [audioTracksTitles addObject:audioTrack.title];
  }

  NSMutableDictionary *eventBody = [NSMutableDictionary new];
  eventBody[selectedAudioTrackKey] = self.player.selectedAudioTrack.title;
  eventBody[audioTracksTitlesKey]  = audioTracksTitles;
  eventBody[multiAudioEnabledKey]  = @(self.player.hasMultipleAudioTracks);
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeAudioTrackChangedNotification:(NSNotification *)notification {
  NSDictionary *eventBody = @{selectedAudioTrackKey: self.player.selectedAudioTrack.title};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
}

- (void)bridgeCCManifestChangedNotification:(NSNotification *)notification {
  NSArray *closedCaptionsLanguages = self.player.availableClosedCaptionsLanguages;
  NSDictionary *eventBody          = @{languagesKey: closedCaptionsLanguages};
  [self.ooReactSkinModel sendEventWithName:notification.name body:eventBody];
  [self.ooReactSkinModel maybeLoadDiscovery:self.player.currentItem.embedCode];
}

#pragma mark - OOCastNotifiable
- (void)castManagerDidUpdateDeviceList:(NSDictionary *)deviceList {
  [self.ooReactSkinModel sendEventWithName:castManagerDidUpdateDevices body:deviceList];
}

- (void)castManagerIsConnectingToDevice {
  [self.ooReactSkinModel sendEventWithName:castManagerIsConnectingDevice body:nil];
}

- (void)castManagerDidConnectToDevice:(NSDictionary *)deviceInfo {
  [self.ooReactSkinModel sendEventWithName:castManagerDidConnectDevice body:deviceInfo];
}

- (void)castManagerDidDisconnectFromCurrentDevice {
  [self.ooReactSkinModel sendEventWithName:castManagerDidDisconnectDevice body:nil];
}

@end
