//
//  OOSkinViewController.m
//  OoyalaSkin
//
//  Created by Zhihui Chen on 4/16/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "OOSkinViewController.h"
#import "OOReactBridge.h"
#import "RCTRootView.h"
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOVideo.h>

@interface OOSkinViewController () {
  RCTRootView *_reactView;
}

@end

@implementation OOSkinViewController

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player rect:(CGRect)rect launchOptions:(NSDictionary *)options{
  if (self = [super init]) {
    self.player = player;
    NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/ooyalaSkin.bundle"];
    _reactView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                             moduleName:@"OoyalaSkin"
                                          launchOptions:nil];
    [self.view setFrame:rect];
    [_player.view setFrame:rect];
    [_reactView setFrame:rect];
    [_reactView setOpaque:NO];
    [_reactView setBackgroundColor:[UIColor clearColor]];

    [self.view addSubview:_player.view];
    [self.view addSubview:_reactView];
    [OOReactBridge getInstance].player = _player;
  }
  return self;
}

- (void)viewDidLoad {
  [super viewDidLoad];

}


- (void)setPlayer:(OOOoyalaPlayer *)player {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  _player = player;
  if (_player != nil) {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onEvent:) name:OOOoyalaPlayerStateChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onEvent:) name:OOOoyalaPlayerCurrentItemChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onEvent:) name:OOOoyalaPlayerTimeChangedNotification object:_player];
  }
}

- (void)onEvent:(NSNotification *)notification {
  NSString *notificationName = notification.name;
  if ([notificationName isEqualToString:OOOoyalaPlayerTimeChangedNotification]) {
    NSNumber *playheadNumber = [NSNumber numberWithFloat:_player.playheadTime];
    NSNumber *durationNumber = [NSNumber numberWithFloat:_player.duration];
    NSNumber *rateNumber = [NSNumber numberWithFloat:_player.playbackRate];
    NSString *title = _player.currentItem.title ? _player.currentItem.title : @"";

    NSDictionary * eventBody =
    @{@"duration":durationNumber,
      @"playhead":playheadNumber,
      @"rate":rateNumber,
      @"title":title};

    [OOReactBridge sendDeviceEventWithName:@"playerState" body:eventBody];
  }
  else if ([notificationName isEqualToString:OOOoyalaPlayerCurrentItemChangedNotification]) {
    NSDictionary *userinfo = notification.userInfo;

    [OOReactBridge sendDeviceEventWithName:@"currentItemInfo" body:userinfo];

    [OOReactBridge sendDeviceEventWithName:@"startScreenConfig" body:[self getDictionaryFromJSONFile]];
  }
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
  [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];

  // Code here will execute before the rotation begins.
  // Equivalent to placing it in the deprecated method -[willRotateToInterfaceOrientation:duration:]

  [coordinator animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> context) {

    // Place code here to perform animations during the rotation.
    // You can pass nil or leave this block empty if not necessary.

  } completion:^(id<UIViewControllerTransitionCoordinatorContext> context) {

    // Code here will execute after the rotation has finished.
    // Equivalent to placing it in the deprecated method -[didRotateFromInterfaceOrientation:]

    [_reactView setFrame:_player.view.frame];

  }];
}


- (NSDictionary *)getDictionaryFromJSONFile {
  NSString * filePath =[[NSBundle mainBundle] pathForResource:@"StartScreen" ofType:@"json"];
  NSError * error;
  NSString* fileContents =[NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:&error];
  NSData *data = [fileContents dataUsingEncoding:NSUTF8StringEncoding];
  NSDictionary *results = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:&error];

  if([results isKindOfClass:[NSDictionary class]]) {
    NSLog(@"results = %@", results);
    return [results valueForKey:@"startScreen"];
  }

  if(error) {
    NSLog(@"Error reading file: %@",error.localizedDescription);
  }

  return nil;
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
