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
#import <OoyalaSDK/OOOptions.h>

@implementation AppDelegate

NSString * const PCODE = @"c0cTkxOqALQviQIGAHWY5hP0q9gU";
NSString * const PLAYERDOMAIN = @"http://www.ooyala.com";
NSString * const EMBEDCODE = @"ZhMmkycjr4jlHIjvpIIimQSf_CjaQs48";
//NSString * const EMBEDCODE = @"92cWp0ZDpDm4Q8rzHfVK6q9m6OtFP-ww"; // vod with closed captions.
//NSString * const EMBEDCODE = @"ZwNThkdTrSfttI2N_-MH3MRIdJQ3Ox8I"; // vod to no-vod channel.

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  OOOptions *options = [OOOptions new];
  options.discoveryOptions = [[OODiscoveryOptions alloc] initWithType:OODiscoveryTypePopular timeout:60.0];
  OOOoyalaPlayer *ooyalaPlayer = [[OOOoyalaPlayer alloc] initWithPcode:PCODE domain:[[OOPlayerDomain alloc] initWithString:PLAYERDOMAIN] options:options];
  UIViewController *rootViewController = [[OOSkinViewController alloc] initWithPlayer:ooyalaPlayer rect:self.window.frame launchOptions:launchOptions];
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [ooyalaPlayer setEmbedCode:EMBEDCODE];
  return YES;
}

@end
