//
//  OOTVGestureManager.m
//  OoyalaTVSkinSDK
//
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOTVGestureManager.h"
#import <OoyalaTVSDK/OOOoyalaPlayer.h>
#import "OOOoyalaTVPlayerViewController.h"

#define SEEK_STEP 10

@interface OOTVGestureManager()<UIGestureRecognizerDelegate>

@property (nonatomic, weak) OOOoyalaTVPlayerViewController *controller;

@property (nonatomic, strong) UITapGestureRecognizer *tapForwardGesture;
@property (nonatomic, strong) UITapGestureRecognizer *tapBackwardGesture;
@property (nonatomic, strong) UITapGestureRecognizer *tapPlayPauseGesture;

@end

@implementation OOTVGestureManager

- (instancetype)initWithController:(OOOoyalaTVPlayerViewController *)controller {
  if (self = [super init]) {
    _controller = controller;
  }
  return self;
}

- (void)addGestures {
  self.tapForwardGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(seek:)];
  self.tapForwardGesture.allowedPressTypes = @[@(UIPressTypeRightArrow)];
  self.tapForwardGesture.delegate = self;

  self.tapBackwardGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(seek:)];
  self.tapBackwardGesture.allowedPressTypes = @[@(UIPressTypeLeftArrow)];
  self.tapBackwardGesture.delegate = self;

  self.tapPlayPauseGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(togglePlay:)];
  self.tapPlayPauseGesture.allowedPressTypes = @[@(UIPressTypePlayPause), @(UIPressTypeSelect)];
  self.tapPlayPauseGesture.delegate = self;

  [self.controller.view addGestureRecognizer:self.tapForwardGesture];
  [self.controller.view addGestureRecognizer:self.tapBackwardGesture];
  [self.controller.view addGestureRecognizer:self.tapPlayPauseGesture];
}

- (void)removeGestures {
  [self.controller.view removeGestureRecognizer:self.tapForwardGesture];
  [self.controller.view removeGestureRecognizer:self.tapBackwardGesture];
  [self.controller.view removeGestureRecognizer:self.tapPlayPauseGesture];
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer {
  if (gestureRecognizer == self.tapPlayPauseGesture) {
    return NO;
  }
  return YES;
}

- (void)seek:(UITapGestureRecognizer *)sender {

  NSTimeInterval seekTo = self.controller.player.playheadTime;
  if (sender == self.tapForwardGesture) {
    seekTo += SEEK_STEP;
  } else if (sender == self.tapBackwardGesture) {
    seekTo -= SEEK_STEP;
  }

  if (seekTo < 0) {
    seekTo = 0;
  } else if (seekTo > self.controller.player.duration) {
    seekTo = self.controller.player.duration;
  }

  [self.controller.player seek:seekTo];
  [self.controller showProgressBar];
}

- (void)togglePlay:(id)sender {
  if ([self.controller.player isPlaying]) {
    [self.controller.player pause];
  } else {
    [self.controller.player play];
  }
  [self.controller showProgressBar];
}

@end
