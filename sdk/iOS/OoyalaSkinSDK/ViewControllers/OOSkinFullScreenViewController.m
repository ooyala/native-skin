//
//  OOSkinFullScreenViewController.m
//  OoyalaSkinSDK
//
//  Copyright © 2017 ooyala. All rights reserved.
//

#import "OOSkinFullScreenViewController.h"


@interface OOSkinFullScreenViewController ()

// Interface orientation properties
#if !TARGET_OS_TV
@property (nonatomic) UIInterfaceOrientationMask supportedInterfaceOrientations;
#endif

@end


@implementation OOSkinFullScreenViewController

#pragma mark - Getters/setters

- (void)setEnableVRStereoMode:(BOOL)newValue {
  _enableVRStereoMode = newValue;

#if !TARGET_OS_TV
  _supportedInterfaceOrientations = newValue ? UIInterfaceOrientationMaskLandscapeRight : UIInterfaceOrientationMaskAll;
#endif
}

#pragma mark - Initialization

- (instancetype)init {
  if (self = [super init]) {
    _enableVRStereoMode = NO;
#if !TARGET_OS_TV
    _supportedInterfaceOrientations = UIInterfaceOrientationMaskAll;
#endif
  }
  return self;
}

#pragma mark - Override view controller functions

#if !TARGET_OS_TV
- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
  return _supportedInterfaceOrientations;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
  return NO;
}

- (BOOL)prefersStatusBarHidden {
  return YES;
}
#endif

@end
