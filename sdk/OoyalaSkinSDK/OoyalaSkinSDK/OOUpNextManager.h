//
// Created by Daniel Kao on 7/6/15.
// Copyright (c) 2015 ooyala. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <OoyalaSDK/OOOoyalaPlayer.h>


@interface OOUpNextManager : NSObject

@property (nonatomic) BOOL isDismissed;
@property (nonatomic, readonly) OOOoyalaPlayer *player;
@property (nonatomic) NSDictionary * nextVideo;

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player;

- (void)setNextVideo:(NSMutableArray *)nextVideo;

- (void)playCompletedNotification:(NSNotification *)notification;
- (void)currentItemChangedNotification:(NSNotification *)notification;

- (void)goToNextVideo;
- (void)reset;
- (void)onDismissPressed;

@end