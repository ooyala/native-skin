//
//  OOReactSkinModel.m
//  OoyalaSkinSDK
//
//  Created by Maksim Kupetskii on 8/13/18.
//  Copyright © 2018 ooyala. All rights reserved.
//

#import <React/RCTRootView.h>

#import <MediaPlayer/MPVolumeView.h>

#import "OOReactSkinModel.h"
#import "OOReactSkinBridge.h"
#import "OOReactSkinBridgeModuleMain.h"

#import "OOSkinViewControllerDelegate.h"
#import "OOSkinOptions.h"
#import "OOSkinPlayerObserver.h"
#import "OOUpNextManager.h"
#import "NSDictionary+Utils.h"
#import "UIColor+Utils.h"

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OODebugMode.h>
#import <OoyalaSDK/OODiscoveryManager.h>
#import <OoyalaSDK/OOAudioTrackProtocol.h>
#import <OoyalaSDK/OOAudioSession.h>
#import <OoyalaSDK/OOClosedCaptionsStyle.h>
#import <OoyalaSDK/OOVideo.h>

@interface OOReactSkinModel () <OOReactSkinBridgeDelegate, OOReactSkinModelDelegate, OOAudioSessionDelegate>

@property (nonatomic, weak) id<OOSkinViewControllerDelegate> skinControllerDelegate;

@property (nonatomic, weak) OOOoyalaPlayer *player;
@property (nonatomic, weak) OOSkinOptions *skinOptions;
@property (nonatomic) OOSkinPlayerObserver *playerObserver;
@property (nonatomic) OOUpNextManager *upNextManager;
@property (nonatomic, readwrite) RCTBridge *bridge;

@end

@implementation OOReactSkinModel

#pragma mark - Constants
#pragma mark Events
static NSString *discoveryResultsReceived = @"discoveryResultsReceived";
static NSString *ccStylingChanged         = @"ccStylingChanged";

#pragma mark Keys
static NSString *upNextKey              = @"upNext";
static NSString *volumeKey              = @"volume";
static NSString *textSizeKey            = @"textSize";
static NSString *textColorKey           = @"textColor";
static NSString *backgroundColorKey     = @"backgroundColor";
static NSString *textBackgroundColorKey = @"textBackgroundColor";
static NSString *backgroundOpacityKey   = @"backgroundOpacity";
static NSString *textOpacityKey         = @"textOpacity";
static NSString *fontNameKey            = @"fontName";
static NSString *audioKey               = @"audio";
static NSString *audioLanguageKey       = @"audioLanguage";
static NSString *embed_CodeKey          = @"embed_code";
static NSString *embedCodeKey           = @"embedCode";
static NSString *nameKey                = @"name";
static NSString *previewImgUrlKey       = @"preview_image_url";
static NSString *durationKey            = @"duration";
static NSString *bucket_InfoKey         = @"bucket_info";
static NSString *bucketInfoKey          = @"bucketInfo";
static NSString *descriptionKey         = @"description";
static NSString *imageUrlKey            = @"imageUrl";
static NSString *resultsKey             = @"results";
static NSString *volumePropertyKey      = @"outputVolume";
static NSString *volumeChangeKey        = @"volumeChanged";

#pragma mark - Init
- (instancetype)initWithWithPlayer:(OOOoyalaPlayer *)player
                       skinOptions:(OOSkinOptions *)skinOptions
            skinControllerDelegate:(id<OOSkinViewControllerDelegate>)skinControllerDelegate {
  if (self = [super init]) {
    _player = player;
    _skinOptions = skinOptions;
    _skinControllerDelegate = skinControllerDelegate;
    _skinConfig = [NSDictionary dictionaryFromSkinConfigFile:_skinOptions.configFileName
                                                  mergedWith:_skinOptions.overrideConfigs];
    _bridge = [[OOReactSkinBridge alloc] initWithDelegate:self launchOptions:nil];

    OOAudioSession.sharedInstance.delegate = self;

    _playerObserver = [[OOSkinPlayerObserver alloc] initWithPlayer:player ooReactSkinModel:self];
    _upNextManager = [[OOUpNextManager alloc] initWithPlayer:self.player
                                            ooReactSkinModel:self
                                                      config:self.skinConfig[upNextKey]];

    // Audio settings
    [self setupAudioSettingsFromConfig:_skinConfig];
  }
  return self;
}

- (void)dealloc {
}

#pragma mark - Public

- (RCTRootView *)viewForModuleWithName:(NSString *)moduleName{
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:self.bridge
                                                   moduleName:moduleName
                                            initialProperties:self.skinConfig];
  return rootView;
}

- (void)sendEventWithName:(NSString *)eventName body:(id)body {
  [self.bridge.skinEventsEmitter sendDeviceEventWithName:eventName body:body];
}

- (void)setIsReactReady:(BOOL)isReactReady {
  self.bridge.skinEventsEmitter.isReactReady = isReactReady;
  [self sendEventWithName:volumeChangeKey
                     body:@{volumeKey: @(OOAudioSession.sharedInstance.applicationVolume)}];
}

- (void)ccStyleChanged:(NSNotification *)notification {
  self.closedCaptionsDeviceStyle = [OOClosedCaptionsStyle new];
  NSNumber *textSize                    = @(self.closedCaptionsDeviceStyle.textSize);
  UIColor *textColor                    = self.closedCaptionsDeviceStyle.textColor;
  UIColor *backgroundColor              = self.closedCaptionsDeviceStyle.windowColor;
  UIColor *textBackgroundColor          = self.closedCaptionsDeviceStyle.backgroundColor;
  NSString *fontName                    = self.closedCaptionsDeviceStyle.textFontName;
  NSNumber *textOpacity                 = @(self.closedCaptionsDeviceStyle.textOpacity);
  NSNumber *backgroundOpacity           = @(self.closedCaptionsDeviceStyle.backgroundOpacity);
  NSString *backgroundColorHexValue     = [UIColor hexStringFromColor:backgroundColor];
  NSString *textBackgroundColorHexValue = [UIColor hexStringFromColor:textBackgroundColor];
  NSString *textColorHexValue           = [UIColor hexStringFromColor:textColor];
//  MACaptionAppearanceTextEdgeStyle edgeStyle = self.closedCaptionsDeviceStyle.edgeStyle;

  NSDictionary *params = @{textSizeKey:            textSize,
                           textColorKey:           textColorHexValue,
                           backgroundColorKey:     backgroundColorHexValue,
                           textBackgroundColorKey: textBackgroundColorHexValue,
                           backgroundOpacityKey:   backgroundOpacity,
                           textOpacityKey:         textOpacity,
                           fontNameKey:            fontName};
  [self sendEventWithName:ccStylingChanged body:params];
}

- (CGRect)videoViewFrame {
  return self.skinControllerDelegate.videoViewFrame;
}

- (void)setReactViewInteractionEnabled:(BOOL)reactViewInteractionEnabled {
  self.skinControllerDelegate.reactViewInteractionEnabled = reactViewInteractionEnabled;
}

#pragma mark - Private

- (void)setupAudioSettingsFromConfig:(NSDictionary *)config {
  NSDictionary *audioSettingsJSON    = config[audioKey];
  NSString *defaultAudioLanguageCode = audioSettingsJSON[audioLanguageKey];

  if (defaultAudioLanguageCode) {
    [self.player setDefaultConfigAudioTrackLanguageCode:defaultAudioLanguageCode];
  }
}

#pragma mark - Discovery UI

- (void)maybeLoadDiscovery:(NSString *)embedCode {
  if (self.player.currentItem.embedCode && self.skinOptions.discoveryOptions) {
    [OODiscoveryManager getResults:self.skinOptions.discoveryOptions
                         embedCode:embedCode
                             pcode:self.player.pcode
                        parameters:nil
                          callback:^(NSArray *results, OOOoyalaError *error) {
      if (error) {
        LOG(@"discovery request failed, error is %@", error.description);
      } else {
        [self handleDiscoveryResults:results embedCode:embedCode];
      }
    }];
  }
}

- (void)handleDiscoveryResults:(NSArray *)results embedCode:(NSString *)currentEmbedCode {
  NSMutableArray *discoveryArray = [NSMutableArray new];
  for (NSDictionary *dict in results) {
    NSString *embedCode = dict[embed_CodeKey];
    if ([embedCode isEqualToString:currentEmbedCode]) { continue; }
    NSString *name              = dict[nameKey];
    NSString *imageUrl          = dict[previewImgUrlKey];
    NSNumber *duration          = @([dict[durationKey] doubleValue] / 1000);
    NSString *bucketInfo        = dict[bucket_InfoKey];
    NSString *description       = dict[descriptionKey];// we assume we always get a string description, even if it is empty ("")
    NSDictionary *discoveryItem = @{nameKey:        name,
                                    embedCodeKey:   embedCode,
                                    imageUrlKey:    (NSNull *)imageUrl != NSNull.null ? imageUrl : @"",
                                    durationKey:    duration,
                                    bucketInfoKey:  bucketInfo,
                                    descriptionKey: description};
    [discoveryArray addObject:discoveryItem];
  }
  if (discoveryArray.count > 0 && discoveryArray[0]) {
    [self.upNextManager setNextVideo:discoveryArray[0]];
  }
  NSDictionary *eventBody = @{resultsKey: discoveryArray};
  [self sendEventWithName:discoveryResultsReceived body:eventBody];
}


#pragma mark - RCTBridgeDelegate

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  return self.skinOptions.jsCodeLocation;
}

#pragma mark - OOReactSkinBridgeDelegate
// Binding ooReactSkinModel as a delegate for handling RN events
- (void)bridge:(OOReactSkinBridge *)bridge didLoadModule:(id<OOReactSkinBridgeModule>)module {
  if ([module isKindOfClass:OOReactSkinBridgeModuleMain.class]) {
    [(OOReactSkinBridgeModuleMain *)module setSkinViewDelegate:self];
  }
}

#pragma mark - OOReactSkinModelDelegate

- (void)handleAudioTrackSelection:(NSString *)audioTrackName {
  // TODO: Can we move this logic to core?
  for (id<OOAudioTrackProtocol> audioTrack in self.player.availableAudioTracks) {
    // This check is a temporary solution
    // Need to wait conclusion about tracks names (how need create them) from Ooyala
    if ([audioTrack.title isEqualToString:audioTrackName]) {
      self.player.defaultAudioTrack = audioTrack;
      [self.player setAudioTrack:audioTrack];
      return;
    }
  }

  LOG(@"handleAudioTrackSelection - Can't find audio track");
}

- (void)handlePlaybackSpeedRateSelection:(nullable NSNumber *)selectedPlaybackSpeedRate {
  if (selectedPlaybackSpeedRate) {
    [self.player changePlaybackSpeedRate:selectedPlaybackSpeedRate.floatValue];
  } else {
    LOG(@"handlePlaybackSpeedRateSelection - selectedPlaybackSpeedRate invalid type");
  }
}

- (void)handleDiscoveryClick:(NSString *)bucketInfo embedCode:(NSString *)embedCode {
  [OODiscoveryManager sendClick:self.skinOptions.discoveryOptions
                     bucketInfo:bucketInfo
                          pcode:self.player.pcode
                     parameters:nil];
  [self.player setEmbedCode:embedCode];
  [self.player play];
}

- (void)handleDiscoveryImpress:(NSString *)bucketInfo {
  [OODiscoveryManager sendImpression:self.skinOptions.discoveryOptions
                          bucketInfo:bucketInfo
                               pcode:self.player.pcode
                          parameters:nil];
}

- (void)handleIconClick:(NSInteger)index {
  [self.player onAdIconClicked:index];
}

- (void)handleLanguageSelection:(NSString *)language {
  [self.player setClosedCaptionsLanguage:language];
}

- (void)handleLearnMore {
  [self.player clickAd];
}

- (void)handleMoreOption {
  [self.player pause];
}

- (void)handleOverlay:(NSString *)url {
  [self.player onAdOverlayClicked:url];
}

- (void)handlePip {
  [self.player togglePictureInPictureMode];
}

- (void)handlePlay {
  [self.player play];
}

- (void)handlePlayPause {
  self.player.state == OOOoyalaPlayerStatePlaying ? [self.player pause] : [self.player play];
}

- (void)playPauseFromAdTappedNotification {
  if (!self.skinControllerDelegate.isReactViewInteractionEnabled) {
    [self handlePlayPause];
  }
}

- (void)handleReplay {
  [self.player play];
}

- (void)handleRewind {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (self.player) {
      Float64 playheadTime = self.player.playheadTime;
      Float64 seekBackTo   = playheadTime - 10;
      if (self.player.seekableTimeRange.start.value > seekBackTo ) {
        seekBackTo = 0;
      }
      [self.player seek:seekBackTo];
    }
  });
}

- (void)handleScrub:(Float64)position {
  if (self.player) {
    CMTimeRange seekableRange = self.player.seekableTimeRange;
    Float64 start             = CMTimeGetSeconds(seekableRange.start);
    Float64 duration          = CMTimeGetSeconds(seekableRange.duration);
    Float64 playhead          = position * duration + start;
    if (playhead < 0.0f) {
      playhead = 0.0f;
    }
    
    [self.player seek:playhead];
  }
}

- (void)handleSkip {
  [self.player skipAd];
}

- (void)handleSocialShare {
  [self.player pause];
}

- (void)handleTouch:(NSDictionary *)result {
  [NSNotificationCenter.defaultCenter postNotificationName:OOOoyalaPlayerHandleTouchNotification object:result];
}

- (void)handleUpNextClick {
  [self.upNextManager goToNextVideo];
}

- (void)handleUpNextDismiss {
  [self.upNextManager onDismissPressed];
}

- (void)handleVolumeChanged:(float)volume {
  MPVolumeView *volumeView = [MPVolumeView new];
  UISlider *volumeViewSlider;
  
  for (UIView *view in volumeView.subviews) {
    if ([view isKindOfClass:UISlider.class]) {
      volumeViewSlider = (UISlider *)view;
      break;
    }
  }
  
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    volumeViewSlider.value = volume;
  });
}

- (void)setEmbedCode:(NSString *)embedCode {
  [self.player setEmbedCode:embedCode];
  [self.player play];
}

- (void)toggleFullscreen {
  [self.skinControllerDelegate toggleFullscreen];
}

- (void)toggleStereoMode {
  [self.skinControllerDelegate toggleStereoMode];
}

#pragma mark - OOAudioSessionDelegate

- (void)volumeChanged:(float)volume {
  [self sendEventWithName:volumeChangeKey
                     body:@{volumeKey: @(volume)}];
}

@end
