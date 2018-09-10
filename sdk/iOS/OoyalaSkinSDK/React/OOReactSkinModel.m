//
//  OOReactSkinModel.m
//  OoyalaSkinSDK
//
//  Created by Maksim Kupetskii on 8/13/18.
//  Copyright © 2018 ooyala. All rights reserved.
//

#import <React/RCTRootView.h>

#import "OOReactSkinModel.h"
#import "OOReactSkinBridge.h"
#import "OOReactSkinBridgeModuleMain.h"

#import "OOSkinViewControllerDelegate.h"
#import "OOSkinOptions.h"
#import "OOSkinPlayerObserver.h"
#import "OOUpNextManager.h"
#import "NSDictionary+Utils.h"
#import "OOVolumeManager.h"

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OODebugMode.h>
#import <OoyalaSDK/OODiscoveryManager.h>
#import <OoyalaSDK/OOAudioTrackProtocol.h>


@interface OOReactSkinModel () <OOReactSkinBridgeDelegate, OOReactSkinModelDelegate>

@property (nonatomic, weak) id<OOSkinViewControllerDelegate> skinControllerDelegate;

@property (nonatomic) OOOoyalaPlayer *player;
@property OOSkinPlayerObserver *playerObserver;
@property (nonatomic) OOSkinOptions *skinOptions;
@property (nonatomic) OOUpNextManager *upNextManager;
@property (nonatomic, readwrite) RCTBridge *bridge;

@end


// TODO: Do we really need these to be global ?
static NSString *const DISCOVERY_RESULT_NOTIFICATION = @"discoveryResultsReceived";
static NSString *const CC_STYLING_CHANGED_NOTIFICATION = @"ccStylingChanged";

@implementation OOReactSkinModel

static NSString *volumeKey = @"volume";

- (instancetype)initWithWithPlayer:(OOOoyalaPlayer *)player
                       skinOptions:(OOSkinOptions *)skinOptions
            skinControllerDelegate:(id<OOSkinViewControllerDelegate>)skinControllerDelegate {
  self = [super init];
  if (self) {
    _player = player;
    _skinOptions = skinOptions;
    _skinControllerDelegate = skinControllerDelegate;
    _skinConfig = [NSDictionary dictionaryFromSkinConfigFile:_skinOptions.configFileName
                                                  mergedWith:_skinOptions.overrideConfigs];
    _bridge = [[OOReactSkinBridge alloc] initWithDelegate:self launchOptions:nil];

    [OOVolumeManager addVolumeObserver:self];

    _playerObserver = [[OOSkinPlayerObserver alloc] initWithPlayer:player ooReactSkinModel:self];
    _upNextManager = [[OOUpNextManager alloc] initWithPlayer:self.player ooReactSkinModel:self config:[self.skinConfig objectForKey:@"upNext"]];

    // Audio settings
    [self setupAudioSettingsFromConfig:_skinConfig];
  }
  return self;
}

- (RCTRootView *)viewForModuleWithName:(NSString *)moduleName{
  RCTRootView* rootView = [[RCTRootView alloc] initWithBridge:_bridge moduleName:moduleName initialProperties:self.skinConfig];
  return rootView;
}

- (void)sendEventWithName:(NSString *)eventName body:(id)body {
  [self.bridge.skinEventsEmitter sendDeviceEventWithName:eventName body:body];
}

- (void)setIsReactReady:(BOOL)isReactReady {
  self.bridge.skinEventsEmitter.isReactReady = isReactReady;
  [self sendEventWithName:VolumeChangeKey body:@{volumeKey: @([OOVolumeManager getCurrentVolume])}];
}

- (void)ccStyleChanged:(NSNotification *)notification {
  self.closedCaptionsDeviceStyle = [OOClosedCaptionsStyle new];
  NSMutableDictionary *params = [NSMutableDictionary new];
  NSNumber *textSize = @(self.closedCaptionsDeviceStyle.textSize);
  UIColor *textColor = self.closedCaptionsDeviceStyle.textColor;
  UIColor *backgroundColor = self.closedCaptionsDeviceStyle.windowColor;
  UIColor *textBackgroundColor = self.closedCaptionsDeviceStyle.backgroundColor;
  NSString *fontName = self.closedCaptionsDeviceStyle.textFontName;
  NSNumber *textOpacity = @(self.closedCaptionsDeviceStyle.textOpacity);
  NSNumber *backgroundOpacity = @(self.closedCaptionsDeviceStyle.backgroundOpacity);
  //  MACaptionAppearanceTextEdgeStyle edgeStyle = self.closedCaptionsDeviceStyle.edgeStyle;
  NSString *backgroundColorHexValue = [self hexStringFromColor:backgroundColor];
  NSString *textBackgroundColorHexValue = [self hexStringFromColor:textBackgroundColor];
  NSString *textColorHexValue = [self hexStringFromColor:textColor];
  [params setObject:textSize forKey:@"textSize"];
  [params setObject:textColorHexValue forKey:@"textColor"];
  [params setObject:backgroundColorHexValue forKey:@"backgroundColor"];
  [params setObject:textBackgroundColorHexValue forKey:@"textBackgroundColor"];
  [params setObject:backgroundOpacity forKey:@"backgroundOpacity"];
  [params setObject:textOpacity forKey:@"textOpacity"];
  [params setObject:fontName forKey:@"fontName"];
  [self sendEventWithName:CC_STYLING_CHANGED_NOTIFICATION body:params];
}

- (CGRect)videoViewFrame {
  return [self.skinControllerDelegate videoViewFrame];
}

- (void)setReactViewInteractionEnabled:(BOOL)reactViewInteractionEnabled {
  [self.skinControllerDelegate setReactViewInteractionEnabled:reactViewInteractionEnabled];
}

#pragma mark - Private

- (void)setupAudioSettingsFromConfig:(NSDictionary *)config {
  NSDictionary *audioSettingsJSON = [config objectForKey:@"audio"];
  NSString *defaultAudioLanguageCode = [audioSettingsJSON objectForKey:@"audioLanguage"];

  if (defaultAudioLanguageCode) {
    [self.player setDefaultConfigAudioTrackLanguageCode:defaultAudioLanguageCode];
  }
}

- (NSString *)hexStringFromColor:(UIColor *)color {
  const CGFloat *components = CGColorGetComponents(color.CGColor);

  CGFloat r = components[0];
  CGFloat g = components[1];
  CGFloat b = components[2];

  return [NSString stringWithFormat:@"#%02lX%02lX%02lX",
          lroundf(r * 255),
          lroundf(g * 255),
          lroundf(b * 255)];
}

#pragma mark - Discovery UI

- (void)maybeLoadDiscovery:(NSString *)embedCode {
  if (self.player.currentItem.embedCode && self.skinOptions.discoveryOptions) {
    [OODiscoveryManager getResults:self.skinOptions.discoveryOptions embedCode:embedCode pcode:self.player.pcode parameters:nil callback:^(NSArray *results, OOOoyalaError *error) {
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
    NSString *embedCode = [dict objectForKey:@"embed_code"];
    if ([embedCode isEqualToString:currentEmbedCode]) {
      continue;
    }
    NSString *name = [dict objectForKey:@"name"];
    NSString *imageUrl = [dict objectForKey:@"preview_image_url"];
    NSNumber *duration = @([[dict objectForKey:@"duration"] doubleValue] / 1000);
    NSString *bucketInfo = [dict objectForKey:@"bucket_info"];
    // we assume we always get a string description, even if it is empty ("")
    NSString *description = [dict objectForKey:@"description"];
    NSDictionary *discoveryItem = @{@"name": name,
                                    @"embedCode": embedCode,
                                    @"imageUrl": imageUrl,
                                    @"duration": duration,
                                    @"bucketInfo": bucketInfo,
                                    @"description": description};
    [discoveryArray addObject:discoveryItem];
  }
  if ([discoveryArray count] > 0 && (discoveryArray[0] != nil)) {
    [self.upNextManager setNextVideo:discoveryArray[0]];
  }
  NSDictionary *eventBody = @{@"results": discoveryArray};
  [self sendEventWithName:DISCOVERY_RESULT_NOTIFICATION body:eventBody];
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  [OOVolumeManager removeVolumeObserver:self];
}

#pragma mark - RCTBridgeDelegate

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  return self.skinOptions.jsCodeLocation;
}

#pragma mark - OOReactSkinBridgeDelegate
// Binding ooReactSkinModel as a delegate for handling RN events
- (void)bridge:(OOReactSkinBridge *)bridge didLoadModule:(id<OOReactSkinBridgeModule>)module {
  if ([module isKindOfClass:[OOReactSkinBridgeModuleMain class]]) {
    [(OOReactSkinBridgeModuleMain*)module setSkinViewDelegate:self];
  }
}

#pragma mark - OOReactSkinModelDelegate

- (void)handleAudioTrackSelection:(NSString *)audioTrackName {
  // TODO: Can we move this logic to core?
  for (id<OOAudioTrackProtocol> audioTrack in [self.player availableAudioTracks]) {
    // This check is a temporary solution
    // Need to wait conclusion about tracks names (how need create them) from Ooyala
    if ([audioTrack.title isEqualToString:audioTrackName]) {
      [self.player setDefaultAudioTrack:audioTrack];
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
  [OODiscoveryManager sendClick:self.skinOptions.discoveryOptions bucketInfo:bucketInfo pcode:self.player.pcode parameters:nil];
  [self.player setEmbedCode:embedCode];
  [self.player play];
}

- (void)handleDiscoveryImpress:(NSString *)bucketInfo {
  [OODiscoveryManager sendImpression:self.skinOptions.discoveryOptions bucketInfo:bucketInfo pcode:self.player.pcode parameters:nil];
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
  if (![self.skinControllerDelegate isReactViewInteractionEnabled]) {
    [self handlePlayPause];
  }
}

- (void)handleReplay {
  [self.player seek:0];
  [self.player play];
}

- (void)handleRewind {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (self.player) {
      Float64 playheadTime = self.player.playheadTime;
      Float64 seekBackTo = playheadTime - 10;
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
    Float64 start = CMTimeGetSeconds(seekableRange.start);
    Float64 duration = CMTimeGetSeconds(seekableRange.duration);
    Float64 playhead = position * duration + start;
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
  [[NSNotificationCenter defaultCenter] postNotificationName:OOOoyalaPlayerHandleTouchNotification object:result];
}

- (void)handleUpNextClick {
  [self.upNextManager goToNextVideo];
}

- (void)handleUpNextDismiss {
  [self.upNextManager onDismissPressed];
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

#pragma mark - KVO

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object
                        change:(NSDictionary *)change context:(void *)context {
  if ([keyPath isEqualToString:VolumePropertyKey]) {
    [self sendEventWithName:VolumeChangeKey body:@{volumeKey: @([change[NSKeyValueChangeNewKey] floatValue])}];
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

@end
