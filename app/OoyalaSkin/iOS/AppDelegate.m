/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <OoyalaSkinSDK/OOSkinViewController.h>
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOPlayerDomain.h>

@implementation AppDelegate

NSString * const PCODE = @"3dff4c81919e43c98c6c4a45b7b7b8c3";
NSString * const PLAYERDOMAIN = @"http://www.ooyala.com";
NSString * const EMBEDCODE = @"ZhMmkycjr4jlHIjvpIIimQSf_CjaQs48"; // big buck bunny.
//NSString * const EMBEDCODE = @"92cWp0ZDpDm4Q8rzHfVK6q9m6OtFP-ww"; // vod with closed captions.
//NSString * const EMBEDCODE = @"ozNTJ2ZDqvPWyXTriQF_Ovcd1VuKHGdH"; // channel.

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  OOOoyalaPlayer *ooyalaPlayer = [[OOOoyalaPlayer alloc] initWithPcode:PCODE domain:[[OOPlayerDomain alloc] initWithString:PLAYERDOMAIN]];
  UIViewController *rootViewController = [[OOSkinViewController alloc] initWithPlayer:ooyalaPlayer rect:self.window.frame launchOptions:launchOptions];
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [ooyalaPlayer setEmbedCode:EMBEDCODE];
  return YES;
}

@end
