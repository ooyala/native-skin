//
// Created by Daniel Kao on 7/6/15.
// Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOUpNextManager.h"
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OODiscoveryManager.h>
#import "OOReactBridge.h"

@interface OOUpNextManager()
@property(nonatomic) BOOL *upNextEnabled;
@end

@implementation OOUpNextManager

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player {

    // TODO Read the following value in from skin config
    _upNextEnabled = YES;

    // Save the player passed in with the init
    _player = player;

    //listen to currentItemChanged, on, reset state (player.currentItem.embedCode)
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(currentItemChangedNotification:) name:OOOoyalaPlayerCurrentItemChangedNotification object:_player];

    //listen to ContentComplete, on, set Ec and play
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(playCompletedNotification:) name:OOOoyalaPlayerPlayCompletedNotification object:_player];

    return self;
}

- (void)setNextVideo:(NSDictionary *)nextVideo {
    _nextVideo = nextVideo;

    // After the a new video has been set, let react know that isDismissed
    // is now false.
    [OOReactBridge sendDeviceEventWithName:@"upNextDismissed" body:@{@"upNextDismissed": [NSNumber numberWithBool:_isDismissed]}];

    // Sets the next video to play in the upnext as specified by react.
    [OOReactBridge sendDeviceEventWithName:@"setNextVideo" body:@{@"nextVideo": _nextVideo}];
}

- (void)playCompletedNotification:(NSNotification *)notification {
    if(_upNextEnabled) {
        [self goToNextVideo];
    }
}

- (void)goToNextVideo {
    // if upnext has not been dismissed and there is a next video, play the
    // next video.
    if(!_isDismissed && _nextVideo != NULL) {
        [_player setEmbedCode:[_nextVideo objectForKey:@"embedCode"]];
        [_player play];
    }
}

- (void)currentItemChangedNotification:(NSNotification *)notification {
    [self reset];
}

- (void)reset {
    // Set upNext back to non dismissed and the next video to null.
    _isDismissed = NO;
    _nextVideo = NULL;
}

- (void)onDismissPressed {
    _isDismissed = YES;

    // Lets react know that dismiss has been pressed.
    [OOReactBridge sendDeviceEventWithName:@"upNextDismissed" body:@{@"upNextDismissed": [NSNumber numberWithBool:_isDismissed]}];
}

@end