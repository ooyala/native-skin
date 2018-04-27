//
//  OOSkinFullScreenViewController.m
//  OoyalaSkinSDK
//
//  Copyright © 2017 ooyala. All rights reserved.
//

#import "OOSkinFullScreenViewController.h"


@interface OOSkinFullScreenViewController ()

// Interface orientation properties
@property (nonatomic) UIInterfaceOrientationMask supportedInterfaceOrientations;

@end


@implementation OOSkinFullScreenViewController

#pragma mark - Getters/setters

- (void)setEnableVRStereoMode:(BOOL)newValue {
  _enableVRStereoMode = newValue;

  _supportedInterfaceOrientations = newValue ? UIInterfaceOrientationMaskLandscapeRight : UIInterfaceOrientationMaskAll;
}

#pragma mark - Initialization

- (instancetype)init {
  if (self = [super init]) {
    _enableVRStereoMode = NO;
    _supportedInterfaceOrientations = UIInterfaceOrientationMaskAll;
  }
  return self;
}

#pragma mark - Override view controller functions

- (BOOL)prefersHomeIndicatorAutoHidden {
  return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
  return _supportedInterfaceOrientations;
}

/// Called when UIViewControllerBasedStatusBarAppearance = YES
- (BOOL)prefersStatusBarHidden {
  return YES;
}

/// Called when UIViewControllerBasedStatusBarAppearance = YES
- (UIStatusBarAnimation)preferredStatusBarUpdateAnimation {
  return UIStatusBarAnimationFade;
}

@end
