//
//  OOSkinPlayerObserver.h
//  OoyalaSkinSDK
//
//  Created by Michael Len on 2/25/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import <Foundation/Foundation.h>

@class OOOoyalaPlayer;
@class OOSkinViewController;

@interface OOSkinPlayerObserver : NSObject

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player skinViewController:(OOSkinViewController *)viewController;


- (void) bridgeCurrentItemChangedNotification:(NSNotification *)notification;
- (void) bridgeErrorNotification:(NSNotification *)notification;
- (void) bridgeStateChangedNotification:(NSNotification *)notification;
@end
