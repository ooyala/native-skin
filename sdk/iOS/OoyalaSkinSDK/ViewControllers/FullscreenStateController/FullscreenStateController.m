//
//  FullscreenStateController.m
//  OoyalaSkinSDK
//
//  Copyright © 2018 ooyala. All rights reserved.
//

#import "FullscreenStateController.h"
#import <UIKit/UIKit.h>
#import "FullscreenStateOperation.h"
#import "PresentedViewControllerHelper.h"


@interface FullscreenStateController()

@property (nonatomic) UIView *parentView;
@property (nonatomic) UIView *containerView;
@property (nonatomic) UIView *videoView;
@property (nonatomic) CGRect originalVideoViewFrame;
@property (nonatomic) UIViewController *rootViewController; // Root VC from visible UIWindow
@property (nonatomic) UIViewController *fullscreenViewController;
@property (nonatomic) NSOperationQueue *operationQueue; // Queue for fullscreen animation
@property (nonatomic) BOOL isFullscreen;
@property (nonatomic) BOOL isOriginalStatusBarHidden;
@property (nonatomic) PresentedViewControllerHelper *presentedViewControllerHelper;

@end


@implementation FullscreenStateController

#pragma mark - Constants

static double const FULLSCREEN_ANIMATION_DURATION = 0.4;

#pragma mark - Initialziation

- (instancetype)initWithParentView:(UIView *)parentView
                     containerView:(UIView *)containerView
                         videoView:(UIView *)videoView
       andFullscreenViewController:(UIViewController *)fullscreenViewController {
  if (self = [super init]) {
    _parentView = parentView;
    _containerView = containerView;
    _videoView = videoView;
    _fullscreenViewController = fullscreenViewController;
    _presentedViewControllerHelper = [PresentedViewControllerHelper new];
    
    [self configure];
  }
  return self;
}

#pragma mark - Public functions

- (void)setFullscreen:(BOOL)fullscreen
withOrientaionChanges:(BOOL)isOrientaionChanges
           completion:(nullable void (^)())completion {
  for (NSOperation *operation in self.operationQueue.operations) {
    if (!operation.isExecuting) {
      [operation cancel];
    }
  }
  
  NSOperation *operation = [[FullscreenStateOperation alloc] initWithFullscreen:fullscreen
                                                           enterFullscreenBlock:^(void (^animationCompletion)(void)) {
    if (self.isFullscreen == fullscreen) {
      animationCompletion();
    } else {
      [self openFullscreenModeWithOrientaionChanges:isOrientaionChanges completion:^{
        animationCompletion();
      }];
    }
  } enterInlineBlock:^(void (^animationCompletion)(void)) {
    if (self.isFullscreen != fullscreen) {
      [self openInlineMode:^{
        animationCompletion();
      }];
    } else {
      animationCompletion();
    }
  } andCompleteStateChanges:completion];
  
  [self.operationQueue addOperation:operation];
}

- (void)viewWillTransition:(BOOL)isAutoFullscreenWithRotatedEnabled {
  UIWindow *window = UIApplication.sharedApplication.keyWindow;
  CGRect frameInWindow = [self.videoView.superview convertRect:self.videoView.frame toView:window];
  
  if (isAutoFullscreenWithRotatedEnabled) {
    self.originalVideoViewFrame = frameInWindow;
  } else {
    self.originalVideoViewFrame = CGRectZero;
  }
}

#pragma mark - Private functions

- (void)configure {
  self.operationQueue = [NSOperationQueue new];
  [self.operationQueue setMaxConcurrentOperationCount:1];
  self.isOriginalStatusBarHidden = UIApplication.sharedApplication.isStatusBarHidden;
}

- (void)openFullscreenModeWithOrientaionChanges:(BOOL)isOrientationChanges completion:(nullable void (^)())completion {
  UIWindow *window = UIApplication.sharedApplication.keyWindow;

  // Update original status bar state
  if (!self.isFullscreen) {
    self.isOriginalStatusBarHidden = UIApplication.sharedApplication.isStatusBarHidden;
  }

  // Save root VC
  self.rootViewController = window.rootViewController;

  // Store presented view controller
  self.presentedViewControllerHelper.rootViewController = window.rootViewController;
  [self.presentedViewControllerHelper findAndStorePresentedViewController];
  
  // Save start rect for not orientation fullscreen mode
  CGRect currentVideoViewFrame = [self.videoView.superview convertRect:self.videoView.frame toView:window];
  
  // Remove video view from container
  [self.videoView removeFromSuperview];

  // Add fullscreen VC on window as subview
  [window addSubview:self.fullscreenViewController.view];
  [window bringSubviewToFront:self.fullscreenViewController.view];

  // Configure fullscreen VC
  self.fullscreenViewController.view.frame = window.bounds;
  [self.fullscreenViewController.view addSubview:self.videoView];

  // Set start rect for video view
  if (isOrientationChanges) {
    self.videoView.frame = self.originalVideoViewFrame;
  } else {
    self.videoView.frame = currentVideoViewFrame;
  }
  
  // Perform animation
  [UIView animateWithDuration:FULLSCREEN_ANIMATION_DURATION animations:^{
    self.videoView.frame = window.bounds;
  } completion:^(BOOL finished) {
    
    // Dismiss presented VCs
    [_presentedViewControllerHelper dismissPresentedViewControllersWithCompletionBlock:^{

      // Change root VC
      window.rootViewController = self.fullscreenViewController;

      // Update current fullscreen state
      self.isFullscreen = YES;

      // Hide status bar (it needs when UIViewControllerBasedStatusBarAppearance = YES)
      UIApplication.sharedApplication.statusBarHidden = YES;

      // Clear data for orientation fullscreen mode
      self.originalVideoViewFrame = CGRectNull;

      // Completion
      if (completion) {
        completion();
      }
    }];
  }];
}

- (void)openInlineMode:(nullable void (^)())completion {
  UIWindow *window = UIApplication.sharedApplication.keyWindow;
  
  // Show status bar if needed (it needs when UIViewControllerBasedStatusBarAppearance = YES)
  UIApplication.sharedApplication.statusBarHidden = self.isOriginalStatusBarHidden;
  
  // Set stored root view controller
  window.rootViewController = self.rootViewController;
  
  // Add fullscreen VC on window as subview
  [window addSubview:self.fullscreenViewController.view];
  [window bringSubviewToFront:self.fullscreenViewController.view];

  // Show presented view controllers
  [self.presentedViewControllerHelper presentStoredControllersWithCompletionBlock:^{

    // Choose viewController's view that shows parentView
    UIView *viewControllersViewToShow;

    if (self.presentedViewControllerHelper.presentedViewController) {
      viewControllersViewToShow = self.presentedViewControllerHelper.presentedViewController.view;
    } else {
      viewControllersViewToShow = self.fullscreenViewController.view;
    }

    // Convert rect for animation
    CGRect videoViewFrameInFullscreenView = [self.parentView convertRect:self.containerView.frame
                                                                  toView:viewControllersViewToShow];

    // Perform animation
    [UIView animateWithDuration:FULLSCREEN_ANIMATION_DURATION animations:^{
      self.videoView.frame = videoViewFrameInFullscreenView;
    } completion:^(BOOL finished) {

      [self.fullscreenViewController.view removeFromSuperview];
      [self.videoView removeFromSuperview];

      [self.containerView addSubview:self.videoView];
      self.videoView.frame = self.containerView.bounds;

      // Update current fullscreen state
      self.isFullscreen = NO;

      // Clear data for presented view controller helper
      [self.presentedViewControllerHelper clearData];

      // Clear data for orientation fullscreen mode
      self.originalVideoViewFrame = CGRectNull;

      // Completion
      if (completion) {
        completion();
      }
    }];
  }];
}


@end
