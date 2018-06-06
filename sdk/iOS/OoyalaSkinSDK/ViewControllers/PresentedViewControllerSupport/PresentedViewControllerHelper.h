//
// Created by Ivan Sakharovskii on 6/6/18.
// Copyright (c) 2018 ooyala. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface PresentedViewControllerHelper : NSObject

- (instancetype)initWithRootWiewController:(UIViewController *)rootViewController;

- (void)findAndStorePresentedViewController;

- (void)dismissPresentedViewControllersWithCompletionBlock:(void (^ __nullable)(void))completion;

- (void)presentStoredControllers;

@end
