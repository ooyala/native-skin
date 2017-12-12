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

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
  return _supportedInterfaceOrientations;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
  return NO;
}

- (BOOL)prefersStatusBarHidden {
  return YES;
}

@end
