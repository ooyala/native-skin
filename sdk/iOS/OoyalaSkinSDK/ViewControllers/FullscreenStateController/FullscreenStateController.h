//
//  FullscreenStateController.h
//  OoyalaSkinSDK
//
//  Copyright © 2018 ooyala. All rights reserved.
//

#import <Foundation/Foundation.h>


@class UIView;
@class UIViewController;


@interface FullscreenStateController : NSObject

- (instancetype _Nonnull)initWithParentView:(UIView *_Nonnull)parentView
                              containerView:(UIView *_Nonnull)containerView
                                  videoView:(UIView *_Nonnull)videoView
                andFullscreenViewController:(UIViewController *_Nonnull)fullscreenViewController;

- (void)setFullscreen:(BOOL)fullscreen completion:(nullable void (^)())completion;

@end
