//
// Copyright (c) 2018 ooyala. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface PresentedViewControllerHelper : NSObject

- (_Nonnull instancetype)initWithRootWiewController:(UIViewController *)rootViewController;

- (void)findAndStorePresentedViewController;

- (void)dismissPresentedViewControllersWithCompletionBlock:(void (^ __nullable)(void))completion;

- (void)presentStoredControllers;

@end
