//
//  FullscreenStateOperation.m
//  OoyalaSkinSDK
//
//  Copyright © 2018 ooyala. All rights reserved.
//

#import "FullscreenStateOperation.h"


@interface FullscreenStateOperation()

@property (nonatomic, copy) void (^fullscreenBlock)(void (^animationCompletion)());
@property (nonatomic, copy) void (^inlineBlock)(void (^animationCompletion)());
@property (nonatomic, copy) void (^completeStateChanges)();
@property (nonatomic) BOOL isFullscreen;

@property (atomic, readwrite) BOOL executing;
@property (atomic, readwrite) BOOL finished;

@end


@implementation FullscreenStateOperation

#pragma mark - Synthesize properties

@synthesize executing = _executing;
@synthesize finished = _finished;

#pragma mark - Initialization

- (instancetype)initWithFullscreen:(BOOL)isFullscreen
              enterFullscreenBlock:(void (^)(void (^animationCompletion)()))fullscreenBlock
                  enterInlineBlock:(void (^)(void (^animationCompletion)()))inlineBlock
           andCompleteStateChanges:(void (^)())completeStateChanges {
  self = [super init];
  if (self) {
    self.isFullscreen = isFullscreen;
    self.fullscreenBlock = fullscreenBlock;
    self.inlineBlock = inlineBlock;
    self.completeStateChanges = completeStateChanges;
  }
  return self;
}

#pragma mark - Override methods

- (void)main {
  if (self.cancelled) {
    [self cancelOperation];
    return;
  }
}

- (void)start {
  if (self.cancelled) {
    [self cancelOperation];
    return;
  }
  
  [self willChangeValueForKey:@"isExecuting"];
  self.executing = YES;
  [self didChangeValueForKey:@"isExecuting"];
  
  dispatch_group_t dispatchGroup = dispatch_group_create();
  
  dispatch_group_enter(dispatchGroup);

  dispatch_async(dispatch_get_main_queue(), ^{
    
    if (self.isFullscreen) {
      self.fullscreenBlock(^{
        dispatch_group_leave(dispatchGroup);
      });
    } else {
      self.inlineBlock(^{
        dispatch_group_leave(dispatchGroup);
      });
    }
  });

  dispatch_group_wait(dispatchGroup, DISPATCH_TIME_FOREVER);
  
  // Call completion block
  
  self.completeStateChanges();
  
  // Finish operation
  
  [self completeOperation];
}

- (BOOL)isAsynchronous {
  return YES;
}

- (BOOL)isExecuting {
  return _executing;
}

- (BOOL)isFinished {
  return _finished;
}

#pragma mark - Private functions

- (void)completeOperation {
  [self willChangeValueForKey:@"isFinished"];
  [self willChangeValueForKey:@"isExecuting"];
  
  self.executing = NO;
  self.finished = YES;
  
  [self didChangeValueForKey:@"isExecuting"];
  [self didChangeValueForKey:@"isFinished"];
}

- (void)cancelOperation {
  
  // Move the operation to the finished state if it is canceled
  
  [self willChangeValueForKey:@"isFinished"];
  self.finished = YES;
  [self didChangeValueForKey:@"isFinished"];
}


@end
