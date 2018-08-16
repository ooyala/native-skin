//
//  OOReactSkinModel.h
//  OoyalaSkinSDK
//
//  Created by Maksim Kupetskii on 8/13/18.
//  Copyright © 2018 ooyala. All rights reserved.
//

#import <React/RCTBridgeDelegate.h>
#import "OOSkinViewControllerDelegate.h"

@class OOOoyalaPlayer;
@class OOSkinOptions;
@class OOClosedCaptionsStyle;
@class RCTRootView;

@interface OOReactSkinModel : NSObject<RCTBridgeDelegate>

@property (nonatomic) NSDictionary *skinConfig;
@property (nonatomic, strong, readwrite) OOClosedCaptionsStyle *closedCaptionsDeviceStyle;
@property (nonatomic, readonly) CGRect videoViewFrame;

- (instancetype)initWithWithPlayer:(OOOoyalaPlayer *)player
                       skinOptions:(OOSkinOptions *)skinOptions
            skinControllerDelegate:(id<OOSkinViewControllerDelegate>)skinControllerDelegate;
- (RCTRootView*)viewForModuleWithName:(NSString *)moduleName;
- (void)sendEventWithName:(NSString *)eventName body:(id)body;
- (void)setIsReactReady:(BOOL)isReactReady;
- (void)ccStyleChanged:(NSNotification *)notification;

// Note: This is for IMA ad playback only.
// When IMA ad plays, IMA consumes clicks for learn more, skip, etc and notify ooyala if the click is not consumed.
// toggle play/pause as if the alice ui is clicked.
// see: OOSkinPlayerObserver bridgeAdTappedNotification
- (void)playPauseFromAdTappedNotification;
- (void)maybeLoadDiscovery:(NSString *)embedCode;
- (void)setReactViewInteractionEnabled:(BOOL)reactViewInteractionEnabled;

@end


@protocol OOReactSkinModelDelegate <NSObject>
// Handling events sent from RN
- (void)toggleFullscreen;
- (void)toggleStereoMode;
- (void)handlePip;
- (void)handleIconClick:(NSInteger)index;
- (void)handlePlayPause;
- (void)handlePlay;
- (void)handleRewind;
- (void)handleSocialShare;
- (void)handleLearnMore;
- (void)handleSkip;
- (void)handleMoreOption;
- (void)handleUpNextDismiss;
- (void)handleUpNextClick;
- (void)handleLanguageSelection:(NSString *)language;
- (void)handleAudioTrackSelection:(NSString *)audioTrackName;
- (void)handleOverlay:(NSString *)url;
- (void)handleTouch:(NSDictionary *)result;
- (void)handleScrub:(Float64)position;
- (void)setEmbedCode:(NSString *)embedCode;
- (void)handleDiscoveryClick:(NSString *)bucketInfo embedCode:(NSString *)embedCode;
- (void)handleDiscoveryImpress:(NSString *)bucketInfo;

@end
