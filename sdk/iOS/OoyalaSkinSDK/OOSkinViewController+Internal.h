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

- (void)toggleFullscreen;
- (void)onUIReady;
- (OOUpNextManager *)upNextManager;

@end
