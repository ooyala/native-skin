//
//  Prese
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
  self.presentedViewController = [self findPresentedViewController:_rootViewController];
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
    [self presentViewController:_storedPresentedViewControllers.firstObject onViewController:_rootViewController withCompletionBlock:completion];
  }
}

- (void)clearData {
  self.rootViewController = nil;
  self.presentedViewController = nil;
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
    return startedViewController;
  }
  
  return [self findPresentedViewController:startedViewController.presentedViewController];
}

- (void)dismissViewControllerAndStoreIt:(nonnull UIViewController *)viewController withCompletionBlock:(void (^ __nullable)(void))completion {
  if ([viewController presentingViewController]) {
    __block UIViewController* presentedVC = [viewController presentedViewController];
    [viewController dismissViewControllerAnimated:NO completion:^{
      [_storedPresentedViewControllers addObject:viewController];
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

- (void)presentViewController:(nonnull UIViewController *)viewControllerToPresent onViewController:(nonnull UIViewController *)baseViewController withCompletionBlock:(void (^ __nullable)(void))completion {
  [baseViewController presentViewController:viewControllerToPresent animated:NO completion:^{
    [_storedPresentedViewControllers removeObject:viewControllerToPresent];
    if ([_storedPresentedViewControllers count] > 0) {
      [self presentViewController:_storedPresentedViewControllers.firstObject onViewController:viewControllerToPresent withCompletionBlock:completion];
    } else {
      if (completion) {
        completion();
      }
    }
  }];
}

@end
