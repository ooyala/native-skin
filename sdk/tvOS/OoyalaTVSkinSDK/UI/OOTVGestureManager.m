//
//  OOTVGestureManager.m
//  OoyalaTVSkinSDK
//
//  Copyright © 2016 ooyala. All rights reserved.
//

#import <OOTVGestureManager.h>
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OOOoyalaTVPlayerViewController.h>
#import <OOOoyalaTVConstants.h>
#import "NSMutableDictionary+Utils.h"

@interface OOTVGestureManager () <UIGestureRecognizerDelegate>

@property (nonatomic, weak) OOOoyalaTVPlayerViewController *controller;

@property (nonatomic) CGPoint lastPanPoint;
@property (nonatomic) Float64 lastPlayhead;

@property (nonatomic) UITapGestureRecognizer *tapForwardGesture;
@property (nonatomic) UITapGestureRecognizer *tapBackwardGesture;
@property (nonatomic) UITapGestureRecognizer *tapPlayPauseGesture;
@property (nonatomic) UIPanGestureRecognizer *panGesture;
@property (nonatomic) UITapGestureRecognizer *tapUpGesture;

@end


@implementation OOTVGestureManager

#pragma mark - Constants

static NSString *const kTouchEventNameKey = @"eventName";
static NSString *const kTouchStartEventName = @"start";
static NSString *const kTouchMoveEventName = @"move";
static NSString *const kTouchEndEventName = @"end";
static NSString *const kTouchXLocationFiledName = @"x_location";
static NSString *const kTouchYLocationFiledName = @"y_location";

#pragma mark - Initialization

- (instancetype)initWithController:(OOOoyalaTVPlayerViewController *)controller {
  if (self = [super init]) {
    _controller = controller;
  }
  return self;
}

#pragma mark - Public functions

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
  
  self.tapUpGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(closedCaptionsSelector:)];
  self.tapUpGesture.allowedPressTypes = @[@(UIPressTypeUpArrow)];
  self.tapUpGesture.delegate = self;
  
  self.panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(onSwipe:)];
  self.panGesture.delegate = self;
  
  [self.controller.view addGestureRecognizer:self.tapForwardGesture];
  [self.controller.view addGestureRecognizer:self.tapBackwardGesture];
  [self.controller.view addGestureRecognizer:self.tapPlayPauseGesture];
  [self.controller.view addGestureRecognizer:self.panGesture];
  [self.controller.view addGestureRecognizer:self.tapUpGesture];
  
  [self.tapPlayPauseGesture setCancelsTouchesInView:NO];
  [self.tapForwardGesture setCancelsTouchesInView:NO];
  [self.tapBackwardGesture setCancelsTouchesInView:NO];
}

- (void)removeGestures {
  [self.controller.view removeGestureRecognizer:self.tapForwardGesture];
  [self.controller.view removeGestureRecognizer:self.tapBackwardGesture];
  [self.controller.view removeGestureRecognizer:self.tapPlayPauseGesture];
  [self.controller.view removeGestureRecognizer:self.panGesture];
  [self.controller.view removeGestureRecognizer:self.tapUpGesture];
}

#pragma mark - UIGestureRecognizerDelegate

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer {
  return !((gestureRecognizer == self.tapPlayPauseGesture)
           && [otherGestureRecognizer isKindOfClass:UIPanGestureRecognizer.class]);
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRequireFailureOfGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer {
  return NO;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldBeRequiredToFailByGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer {
  return gestureRecognizer == self.tapPlayPauseGesture &&
         otherGestureRecognizer == self.panGesture;
}

#pragma mark - Actions

- (void)seek:(UITapGestureRecognizer *)sender {
  if (self.controller.closedCaptionMenuDisplayed) {
    [self.controller removeClosedCaptionsMenu];
  }
  NSTimeInterval seekTo = self.controller.player.playheadTime;
  if (sender == self.tapForwardGesture) {
    seekTo += FF_SEEK_STEP;
  } else if (sender == self.tapBackwardGesture) {
    seekTo -= FF_SEEK_STEP;
  }
  
  if (seekTo < 0) {
    seekTo = 0;
  } else if (seekTo > self.durationTime) {
    seekTo = self.durationTime;
  }
  
  CGFloat viewWidth = self.controller.view.frame.size.width;
  
  if (viewWidth == 0) {
    viewWidth = 1920;
  }

  self.lastPlayhead = seekTo;
  
  [self.controller.player seek:seekTo];
  [self.controller showProgressBar];
  [self.controller updatePlayheadWithSeekTime:(double)seekTo];
}

- (void)togglePlay:(id)sender {
  if (self.controller.closedCaptionMenuDisplayed) {
    [self.controller removeClosedCaptionsMenu];
  }
  if ([self.controller.player isPlaying]) {
    [self.controller.player pause];
  } else {
    [self.controller.player play];
  }
  [self.controller showProgressBar];
}

- (void)closedCaptionsSelector:(UITapGestureRecognizer *)sender {
  [self.controller setupClosedCaptionsMenu];
}

- (void)onSwipe:(id)sender {
  // Notify observers what pan gesture state changed
  if (sender == _panGesture && _controller.player.isPlaying) {
    [self notifyObserversWhatPanGestureStateChangedWithPanGestureRecognizer:sender];
  }
  
  if (!self.controller.closedCaptionMenuDisplayed &&
      !self.controller.player.isPlaying) {
    if (sender == self.panGesture) {
      CGPoint currentPoint = [self.panGesture translationInView:self.controller.view];
      CGFloat viewWidth = self.controller.view.frame.size.width;
      
      if (viewWidth == 0) {
        viewWidth = 1920;
      }
      
      CGFloat seekScale = self.controller.player.duration / viewWidth * SWIPE_TO_SEEK_MULTIPLIER;
      
      [self.controller showProgressBar];
      
      switch (self.panGesture.state) {
        case UIGestureRecognizerStateBegan:
          self.lastPanPoint = currentPoint;
          self.lastPlayhead = self.playheadTime;
          break;
        case UIGestureRecognizerStateChanged: {
          CGFloat distance = currentPoint.x - self.lastPanPoint.x;
          
          self.lastPanPoint = currentPoint;
          self.lastPlayhead += distance * seekScale;
          
          if (self.lastPlayhead < 0) {
            self.lastPlayhead = 0;
          } else if (self.lastPlayhead > self.durationTime) {
            self.lastPlayhead = self.durationTime;
          }
          
          [self.controller updatePlayheadWithSeekTime:(double)self.lastPlayhead];
          
          break;
        }
        case UIGestureRecognizerStateEnded:
          [self.controller updatePlayheadWithSeekTime:(double)self.lastPlayhead];
          [self.controller.player seek:self.lastPlayhead];
          break;
        default:
          break;
      }
    }
  }
}

#pragma mark - Private functions

- (void)notifyObserversWhatPanGestureStateChangedWithPanGestureRecognizer:(UIPanGestureRecognizer *)panRecognizer {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  
  switch (panRecognizer.state) {
    case UIGestureRecognizerStateBegan: {
      [result mergeWith:@{kTouchEventNameKey: kTouchStartEventName}];
      break;
    }
      
    case UIGestureRecognizerStateChanged: {
      NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
      CGPoint current = [panRecognizer translationInView:self.controller.view];
      
      dictionary[kTouchXLocationFiledName] = @(current.x);
      dictionary[kTouchYLocationFiledName] = @(current.y);
      
      result = [NSMutableDictionary dictionaryWithDictionary:dictionary];
      
      [result mergeWith:@{kTouchEventNameKey: kTouchMoveEventName}];
      
      break;
    }
    default: {
      [result mergeWith:@{kTouchEventNameKey: kTouchEndEventName}];
      break;
    }
  }
  
  [NSNotificationCenter.defaultCenter postNotificationName:OOOoyalaPlayerHandleTouchNotification object:result];
}

@end
