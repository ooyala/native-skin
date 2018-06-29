//
//  PresentedViewControllerHelper.m
//  OoyalaSkinSDK
//
//
// Copyright (c) 2018 ooyala. All rights reserved.
//

#import "PresentedViewControllerHelper.h"


@interface PresentedViewControllerHelper ()

@property (nonatomic) NSMutableArray *storedPresentedViewControllers;

@end

@implementation PresentedViewControllerHelper

#pragma mark - Initialization

- (instancetype)init {
  if (self = [super init]) {
    _storedPresentedViewControllers = [NSMutableArray new];
  }
  return self;
}

#pragma mark - Public functions

- (void)findAndStorePresentedViewController {
  self.presentedViewController = [self findPresentedViewController:self.rootViewController];
}

- (void)dismissPresentedViewControllersWithCompletionBlock:(void (^)(void))completion {
  if (_presentedViewController != nil) {
    [self dismissViewControllerAndStoreIt:_presentedViewController withCompletionBlock:completion];
  } else {
    if (completion) {
      completion();
    }
  }
}

- (void)presentStoredControllersWithCompletionBlock:(void (^)(void))completion {
  if ([_storedPresentedViewControllers count] > 0) {
    [self presentViewController:self.storedPresentedViewControllers.firstObject onViewController:_rootViewController withCompletionBlock:completion];
  } else {
    if (completion) {
      completion();
    }
  }
}

- (void)clearData {
  self.rootViewController = nil;
  self.presentedViewController = nil;
  [self.storedPresentedViewControllers removeAllObjects];
}

#pragma mark - Private functions

- (nullable UIViewController *)findPresentedViewController:(nonnull UIViewController *)startedViewController {
  if ([startedViewController isKindOfClass:[UINavigationController class]]) {
    return [self findPresentedViewController:[(UINavigationController *)startedViewController topViewController]];
  }
  
  if ([startedViewController isKindOfClass:[UITabBarController class]]) {
    return [self findPresentedViewController:[(UITabBarController *)startedViewController selectedViewController]];
  }
  
  if (startedViewController.presentedViewController == nil || startedViewController.presentedViewController.isBeingDismissed) {
    if (startedViewController.presentingViewController != nil) {
      return startedViewController;
    } else {
      return nil;
    }
  }
  
  return [self findPresentedViewController:startedViewController.presentedViewController];
}

- (void)dismissViewControllerAndStoreIt:(nonnull UIViewController *)viewController
                    withCompletionBlock:(nullable void (^)(void))completion {
  if ([viewController presentingViewController]) {
    UIViewController* presentedVC = [viewController presentedViewController];
    [viewController dismissViewControllerAnimated:NO completion:^{
      [self.storedPresentedViewControllers addObject:viewController];
      if ([presentedVC presentingViewController]) {
        [self dismissViewControllerAndStoreIt:presentedVC withCompletionBlock:completion];
      } else {
        if (completion) {
          completion();
        }
      }
    }];
  }
}

- (void)presentViewController:(nonnull UIViewController *)viewControllerToPresent
             onViewController:(nonnull UIViewController *)baseViewController
          withCompletionBlock:(nullable void (^)(void))completion {
  [baseViewController presentViewController:viewControllerToPresent animated:NO completion:^{
    [self.storedPresentedViewControllers removeObject:viewControllerToPresent];
    if ([self.storedPresentedViewControllers count] > 0) {
      [self presentViewController:self.storedPresentedViewControllers.firstObject onViewController:viewControllerToPresent withCompletionBlock:completion];
    } else {
      if (completion) {
        completion();
      }
    }
  }];
}

@end
