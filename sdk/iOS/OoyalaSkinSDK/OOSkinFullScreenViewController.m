//
//  OOSkinFullScreenViewController.m
//  OoyalaSkinSDK
//
//  Created by Ivan Sakharovskii on 9/15/17.
//  Copyright © 2017 ooyala. All rights reserved.
//

#import "OOSkinFullScreenViewController.h"

@interface OOSkinFullScreenViewController ()

@end

@implementation OOSkinFullScreenViewController

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
  return _isStereoMode ? UIInterfaceOrientationMaskLandscapeRight : UIInterfaceOrientationMaskAll;
}

@end
