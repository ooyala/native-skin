//
//  OOSkinViewController.h
//  OoyalaSkin
//
//  Created by Zhihui Chen on 4/16/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@class OOOoyalaPlayer;
@class OODiscoveryOptions;
@class UpNextManager;

@interface OOSkinViewController : UIViewController

@property (nonatomic, readonly) OODiscoveryOptions *discoveryOptions;
@property (nonatomic, readonly) OOOoyalaPlayer *player;
@property (nonatomic) UpNextManager *upNextManager;
@property (readonly) BOOL isFullscreen;

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
                        parent:(UIView *)parentView
              discoveryOptions:(OODiscoveryOptions *)discoveryOptions
                 launchOptions:(NSDictionary *)options
                jsCodeLocation:(NSURL *)jsCodeLocation;

- (void)loadStartScreenConfigureFile;
- (void)toggleFullscreen;

@end
