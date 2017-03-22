//
// Created by Daniel Kao on 7/6/15.
// Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOUpNextManager.h"
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OODiscoveryManager.h>
#import "OOReactBridge.h"
#import <OoyalaSDK/OODebugMode.h>

@interface OOUpNextManager ()
@property(nonatomic) BOOL upNextEnabled;
@property (nonatomic, weak) OOOoyalaPlayer *player;
@property (nonatomic, weak) OOReactBridge *ooBridge;
@property (nonatomic) BOOL isDismissed;
@property (nonatomic) NSDictionary * nextVideo;
@end

@implementation OOUpNextManager

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
                        bridge:(OOReactBridge *)bridge
                 config:(NSDictionary *)config {

  if (self = [super init]) {
  // Read the following value in from skin config
  _upNextEnabled = [[config objectForKey:@"showUpNext"] boolValue];

  // Save the player passed in with the init
  _player = player;

  _ooBridge = bridge;

  //listen to currentItemChanged, on, reset state (player.currentItem.embedCode)
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(currentItemChangedNotification:) name:OOOoyalaPlayerCurrentItemChangedNotification object:_player];

  //listen to ContentComplete, on, set Ec and play
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(playCompletedNotification:) name:OOOoyalaPlayerPlayCompletedNotification object:_player];
  }

  return self;
}

- (void)setNextVideo:(NSDictionary *)nextVideo {
  if(nextVideo != nil) {
    _nextVideo = nextVideo;

    // After the a new video has been set, let react know that isDismissed
    // is now false.
    [self.ooBridge sendDeviceEventWithName:@"upNextDismissed" body:@{@"upNextDismissed" : [NSNumber numberWithBool:[self isDismissed]]}];

    // Sets the next video to play in the upnext as specified by react.
    [self.ooBridge sendDeviceEventWithName:@"setNextVideo" body:@{@"nextVideo" : _nextVideo}];
  }
}

- (void)playCompletedNotification:(NSNotification *)notification {
  if ([self upNextEnabled]) {
    [self goToNextVideo];
  }
}

- (void)goToNextVideo {
  // if upnext has not been dismissed and there is a next video, play the
  // next video.
  LOG(@"Going to next video based on Up Next");
  if (!self.isDismissed && self.nextVideo != NULL) {
    [[self player] setEmbedCode:[[self nextVideo] objectForKey:@"embedCode"]];
    [[self player] play];
  }
}

- (void)currentItemChangedNotification:(NSNotification *)notification {
  // Set upNext back to non dismissed and the next video to null.
  self.isDismissed = NO;
  self.nextVideo = NULL;
}

- (void)onDismissPressed {
  self.isDismissed = YES;

  // Lets react know that dismiss has been pressed.
  [self.ooBridge sendDeviceEventWithName:@"upNextDismissed" body:@{@"upNextDismissed" : [NSNumber numberWithBool:[self isDismissed]]}];
}

- (void)dealloc {
  LOG(@"upnext dealloc");
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
