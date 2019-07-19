//
// Created on 7/6/15.
// Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOUpNextManager.h"
#import "OOReactSkinModel.h"

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OODebugMode.h>
#import <OoyalaSDK/OOVideo.h>
#import <OoyalaSDK/OOOoyalaError.h>

@interface OOUpNextManager ()

@property (nonatomic, weak) OOOoyalaPlayer *player;
@property (nonatomic, weak) OOReactSkinModel *ooReactSkinModel;
@property (nonatomic) BOOL upNextEnabled;
@property (nonatomic) BOOL isDismissed;
@property (nonatomic) NSDictionary *nextVideo;

@end


@implementation OOUpNextManager

#pragma mark - Constants
static NSString *showUpNextKey      = @"showUpNext";
static NSString *upNextDismissedKey = @"upNextDismissed";
static NSString *setNextVideoKey    = @"setNextVideo";
static NSString *embedCodeKey       = @"embedCode";

#pragma mark - Methods
- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
              ooReactSkinModel:(OOReactSkinModel *)ooReactSkinModel
                        config:(NSDictionary *)config {
  if (self = [super init]) {
  // Read the following value in from skin config
  _upNextEnabled = [config[showUpNextKey] boolValue];

  // Save the player passed in with the init
  _player = player;

  _ooReactSkinModel = ooReactSkinModel;

  // listen to currentItemChanged, on, reset state (player.currentItem.embedCode)
  [NSNotificationCenter.defaultCenter addObserver:self
                                          selector:@selector(currentItemChangedNotification:)
                                              name:OOOoyalaPlayerCurrentItemChangedNotification
                                            object:_player];

  // listen to ContentComplete, on, set Ec and play
  [NSNotificationCenter.defaultCenter addObserver:self
                                          selector:@selector(playCompletedNotification:)
                                              name:OOOoyalaPlayerPlayCompletedNotification
                                            object:_player];
  }

  return self;
}

- (void)setNextVideo:(NSDictionary *)nextVideo {
  if (nextVideo) {
    _nextVideo = nextVideo;

    // After the a new video has been set, let react know that isDismissed
    // is now false.
    [self.ooReactSkinModel sendEventWithName:upNextDismissedKey
                                        body:@{upNextDismissedKey: @(self.isDismissed)}];

    // Sets the next video to play in the upnext as specified by react.
    [self.ooReactSkinModel sendEventWithName:setNextVideoKey
                                        body:@{setNextVideoKey: self.nextVideo}];
  }
}

- (void)playCompletedNotification:(NSNotification *)notification {
  if (self.upNextEnabled) {
    [self goToNextVideo];
  }
}

- (void)goToNextVideo {
  // if upnext has not been dismissed and there is a next video, play the next video.
  LOG(@"Going to next video based on Up Next");
  if (!self.isDismissed && self.nextVideo) {
    
#warning: old API. Remove when SDK version > 4.46.0_GA. If you need to use old API, uncomment -playForJustChangedItem in -bridgeCurrentItemChangedNotification: of 'OOSkinPlayerObserver'
    //[self.player setEmbedCode:self.nextVideo[embedCodeKey]];
    
    //new API from OOyalaSDK. Available > 4.46.0_GA
    [self.player setEmbedCode:self.nextVideo[embedCodeKey] withCallback:^(OOOoyalaError *error) {
      LOG(@"goToNextVideo setEmbedCode got callback");
      if (error) {
        LOG(@"❌ Is setEmbedCode is NOT successfull. Error: %@", error.debugDescription);
      }
    }];
    
    __weak typeof(self) weakSelf = self;
    NSString *expectedEmbedCode = weakSelf.nextVideo[embedCodeKey];
    void (^expectedBlock) (OOVideo *currentItem); //params of OOCurrentItemChangedCallback
    expectedBlock = ^ (OOVideo *currentItem) {
      LOG(@"Method -goToNextVideo got expectedBlock");
      NSString *arrivedCode = currentItem.embedCode;
      if ([arrivedCode isEqualToString:expectedEmbedCode]) { //OS: must be checked, because OOBaseStreamPlayer observes 'AVPlayerItemStatusReadyToPlay' two times: when asset just attached and when asset is completed. If success - block must be removed after '[weakSelf.player play]', to prevent ignition from OOBaseStreamPlayer's KVO 'AVPlayerItemStatusReadyToPlay'
        NSLog(@"✅ SUCCESS: asset with EXPECTED embed code %@ ", arrivedCode);
        [weakSelf.player play];
        weakSelf.player.currentItemChangedCallback = nil;
      } else {
        NSLog(@"❌ player with embed code [%@] that is not expected", arrivedCode);
      }
    };
    
    self.player.currentItemChangedCallback = expectedBlock;
  }
}

- (void)currentItemChangedNotification:(NSNotification *)notification {
  // Set upNext back to non dismissed and the next video to nil.
  self.isDismissed = NO;
  self.nextVideo = nil;
}

- (void)onDismissPressed {
  self.isDismissed = YES;

  // Lets react know that dismiss has been pressed.
  [self.ooReactSkinModel sendEventWithName:upNextDismissedKey
                                      body:@{upNextDismissedKey: @(self.isDismissed)}];
}

- (void)dealloc {
  LOG(@"upnext dealloc");
}

@end
