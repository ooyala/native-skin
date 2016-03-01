//
//  OOSkinViewController+Internal.h
//  OoyalaSkinSDK
//
//  Created by Zhihui Chen on 8/12/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOSkinViewController.h"
@class OOUpNextManager;

@interface OOSkinViewController (Internal)

@property (nonatomic) NSDictionary *skinConfig;

- (void)toggleFullscreen;
- (BOOL)isReactReady;
- (OOUpNextManager *)upNextManager;
- (void)maybeLoadDiscovery:(NSString *)embedCode;

- (void)disableReactViewInteraction;
- (void)enableReactViewInteraction;
- (BOOL)isReactViewInteractionEnabled;

// Note: This is for IMA ad playback only.
// When IMA ad plays, IMA consumes clicks for learn more, skip, etc and notify ooyala if the click is not consumed.
// toggle play/pause as if the alice ui is clicked.
// see: OOSkinPlayerObserver bridgeAdTappedNotification
- (void)playPauseFromAdTappedNotification;
@end
