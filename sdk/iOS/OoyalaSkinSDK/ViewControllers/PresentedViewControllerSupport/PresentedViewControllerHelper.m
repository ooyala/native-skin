//
// Copyright (c) 2018 ooyala. All rights reserved.
//

#import "PresentedViewControllerHelper.h"


@interface PresentedViewControllerHelper ()

@property (nonatomic) UIViewController *rootViewController;
@property (nonatomic) UIViewController *presentedViewController;
@property (nonatomic) NSMutableArray *storedPresentedViewControllers;

@end

@implementation PresentedViewControllerHelper {

}

#pragma mark - Initialization

- (instancetype)initWithRootWiewController:(UIViewController *)rootViewController {
  if (self = [super init]) {
    self.rootViewController = rootViewController;
    self.storedPresentedViewControllers = [NSMutableArray new];
  }
  return self;
}

- (void)findAndStorePresentedViewController {
  self.presentedViewController = [self findPresentedViewController:_rootViewController];
}

- (void)dismissPresentedViewControllersWithCompletionBlock:(void (^)(void))completion {
  [self dismissViewControllerAndStoreIt:_presentedViewController];
  if (completion) {
    completion();
  }
}

- (void)presentStoredControllers {
  [self presentViewController:_storedPresentedViewControllers.firstObject onViewController:_rootViewController];
}

#pragma mark - Private functions

- (UIViewController *)findPresentedViewController:(UIViewController *)startedViewController {
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

- (void)dismissViewControllerAndStoreIt:(UIViewController *)viewController {
  if ([viewController presentingViewController]) {
    __block UIViewController* presentedVC = [viewController presentedViewController];
    [viewController dismissViewControllerAnimated:NO completion:^{
      [_storedPresentedViewControllers addObject:viewController];
      if ([presentedVC presentingViewController]) {
        [self dismissViewControllerAndStoreIt:presentedVC];
      }
    }];
  }
}

- (void)presentViewController:(UIViewController *)viewControllerToPresent onViewController:(UIViewController *)baseViewController {
  [baseViewController presentViewController:viewControllerToPresent animated:NO completion:^{
    [_storedPresentedViewControllers removeObject:viewControllerToPresent];
    if ([_storedPresentedViewControllers count] > 0) {
      [self presentViewController:_storedPresentedViewControllers.firstObject onViewController:viewControllerToPresent];
    }
  }];
}

@end
