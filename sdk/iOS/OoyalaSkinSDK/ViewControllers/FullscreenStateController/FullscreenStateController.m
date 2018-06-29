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


#define FULLSCREEN_ANIMATION_DURATION 0.5


@interface FullscreenStateController()

@property (nonatomic) UIView *parentView;
@property (nonatomic) UIView *containerView;
@property (nonatomic) UIView *videoView;
@property (nonatomic) UIViewController *rootViewController; // Root VC from visible UIWindow
@property (nonatomic) UIViewController *fullscreenViewController;
@property (nonatomic) NSOperationQueue *operationQueue; // Queue for fullscreen animation
@property (nonatomic) BOOL isFullscreen;
@property (nonatomic) BOOL isOriginalStatusBarHidden;
@property (nonatomic) PresentedViewControllerHelper *presentedViewControllerHelper;

@end


@implementation FullscreenStateController

#pragma mark - Initialziation

- (instancetype)initWithParentView:(UIView *)parentView
                     containerView:(UIView *)containerView
                         videoView:(UIView *)videoView
       andFullscreenViewController:(UIViewController *)fullscreenViewController {
  self = [super init];
  if (self) {
    self.parentView = parentView;
    self.containerView = containerView;
    self.videoView = videoView;
    self.fullscreenViewController = fullscreenViewController;
    self.presentedViewControllerHelper = [PresentedViewControllerHelper new];
    
    [self configure];
  }
  return self;
}

#pragma mark - Public functions

- (void)setFullscreen:(BOOL)fullscreen completion:(nullable void (^)())completion {
  for (NSOperation *operation in self.operationQueue.operations) {
    if (!operation.isExecuting) {
      [operation cancel];
    }
  }
  
  NSOperation *operation = [[FullscreenStateOperation alloc] initWithFullscreen:fullscreen enterFullscreenBlock:^(void (^animationCompletion)(void)) {
    if (self.isFullscreen == fullscreen) {
      animationCompletion();
    } else {
      [self openFullscreenMode:^{
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

#pragma mark - Private functions

- (void)configure {
  self.operationQueue = [NSOperationQueue new];
  [self.operationQueue setMaxConcurrentOperationCount:1];
  self.isOriginalStatusBarHidden = UIApplication.sharedApplication.isStatusBarHidden;
}

- (void)openFullscreenMode:(nullable void (^)())completion {
  UIWindow *window = [UIApplication sharedApplication].keyWindow;
  
  // Update original status bar state
  
  if (!self.isFullscreen) {
    self.isOriginalStatusBarHidden = UIApplication.sharedApplication.isStatusBarHidden;
  }
  
  // Save root VC
  
  UIInterfaceOrientation orientation = self.rootViewController.preferredInterfaceOrientationForPresentation;
  NSLog(@"Preffered orientation is: %ldl", (long)orientation);
  self.rootViewController = window.rootViewController;
  
  // Store presented view controller
  
  self.presentedViewControllerHelper.rootViewController = window.rootViewController;
  [_presentedViewControllerHelper findAndStorePresentedViewController];
  
  // Remove video view from container
  
  [self.videoView removeFromSuperview];
  
  // Configure fullscreen VC
  
  self.fullscreenViewController.view.frame = window.bounds;
  [self.fullscreenViewController.view addSubview:self.videoView];
  
  // Convert rect for animation
  
  CGRect frameInWindow = [self.parentView convertRect:self.containerView.frame
                                               toView:window];
  
  // Set start rect for video view
  
  self.videoView.frame = frameInWindow;
  
  // Add fullscreen VC on window as subview
  
  [window addSubview:self.fullscreenViewController.view];
  [window bringSubviewToFront:self.fullscreenViewController.view];
  
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
      
      // Completion
      
      if (completion) {
        completion();
      }
    }];
  }];
}

- (void)openInlineMode:(nullable void (^)())completion {
  UIWindow *window = [UIApplication sharedApplication].keyWindow;
  
  // Show status bar if needed (it needs when UIViewControllerBasedStatusBarAppearance = YES)
  
  UIApplication.sharedApplication.statusBarHidden = self.isOriginalStatusBarHidden;
  
  // Set stored root view controller
  
  window.rootViewController = self.rootViewController;

  // Show presented view controllers
  
  [self.presentedViewControllerHelper presentStoredControllersWithCompletionBlock:^{
    
    // Choose viewController's view that shows parentView
    
    UIView *viewControllersViewToShow;
    
    if (self.presentedViewControllerHelper.presentedViewController) {
      viewControllersViewToShow = self.presentedViewControllerHelper.presentedViewController.view;
      [window addSubview:self.fullscreenViewController.view];
      [window bringSubviewToFront:self.fullscreenViewController.view];
    } else {
      viewControllersViewToShow = self.fullscreenViewController.view;
    }
    
    // Convert rect for animation
    CGRect frameInFullscreenView = [self.parentView convertRect:self.containerView.frame
                                                         toView:viewControllersViewToShow];
    
    // Perform animation
    
    [UIView animateWithDuration:FULLSCREEN_ANIMATION_DURATION animations:^{
      self.videoView.frame = frameInFullscreenView;
    } completion:^(BOOL finished) {
      
      [self.fullscreenViewController.view removeFromSuperview];
      [self.videoView removeFromSuperview];
      
      [self.containerView addSubview:self.videoView];
      self.videoView.frame = self.parentView.bounds;
      
      // Update current fullscreen state
      
      self.isFullscreen = NO;
      
      // Completion
      
      if (completion) {
        completion();
      }
      
      // Clear data for presented view controller helper
      
      [self.presentedViewControllerHelper clearData];
    }];
  }];
}


@end
