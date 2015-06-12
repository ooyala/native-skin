//
//  MasterViewController.m
//  OoyalaSkin
//
//  Created by Zhihui Chen on 6/3/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "MasterViewController.h"
#import <OoyalaSkinSDK/OOSkinViewController.h>
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOPlayerDomain.h>
#import <OoyalaSDK/OOOptions.h>
#import <OoyalaSDK/OODiscoveryOptions.h>

NSString * const PCODE = @"c0cTkxOqALQviQIGAHWY5hP0q9gU";
NSString * const PLAYERDOMAIN = @"http://www.ooyala.com";
NSString * const EMBEDCODE = @"ZhMmkycjr4jlHIjvpIIimQSf_CjaQs48";
//NSString * const EMBEDCODE = @"92cWp0ZDpDm4Q8rzHfVK6q9m6OtFP-ww"; // vod with closed captions.
//NSString * const EMBEDCODE = @"ZwNThkdTrSfttI2N_-MH3MRIdJQ3Ox8I"; // vod to no-vod channel.

@interface MasterViewController ()

@property (nonatomic, retain) OOSkinViewController *skinController;
@end

@implementation MasterViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  OOOptions *options = [OOOptions new];
  OOOoyalaPlayer *ooyalaPlayer = [[OOOoyalaPlayer alloc] initWithPcode:PCODE domain:[[OOPlayerDomain alloc] initWithString:PLAYERDOMAIN] options:options];
  OODiscoveryOptions *discoveryOptions = [[OODiscoveryOptions alloc] initWithType:OODiscoveryTypePopular limit:10 timeout:60];

  _skinController = [[OOSkinViewController alloc] initWithPlayer:ooyalaPlayer parent:_videoView discoveryOptions:discoveryOptions launchOptions:nil];
  [self addChildViewController:_skinController];
  [ooyalaPlayer setEmbedCode:EMBEDCODE];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
