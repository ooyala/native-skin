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
#import <OoyalaSDK/OOModule.h>
#import <OoyalaSDK/OOEmbeddedSecureURLGenerator.h>
#import <OoyalaSDK/OODiscoveryManager.h>
#import <OoyalaSDK/OODebugMode.h>

#define DISCOVERY_RESULT_NOTIFICATION @"discoveryResultsReceived"
#define FULLSCREEN_ANIMATION_DURATION 0.5

@interface OOSkinViewController () {
  RCTRootView *_reactView;
  UIViewController *_parentViewController;
  UIView *_parentView;
}

@property (nonatomic, retain) OOOoyalaPlayer *player;

@end

@implementation OOSkinViewController

static NSString *kFrameChangeContext = @"frameChanged";
static NSString *kViewChangeKey = @"frame";

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
                        parent:(UIView *)parentView
              discoveryOptions:(OODiscoveryOptions *)discoveryOptions
                 launchOptions:(NSDictionary *)options{
  if (self = [super init]) {
    [self setPlayer:player];
    NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/ooyalaSkin.bundle"];
    _reactView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                             moduleName:@"OoyalaSkin"
                                          launchOptions:nil];
    _parentView = parentView;
    [self.view setFrame:_parentView.frame];
    [_player.view setFrame:_parentView.frame];
    [_reactView setFrame:_parentView.frame];
    [_reactView setOpaque:NO];
    [_reactView setBackgroundColor:[UIColor clearColor]];
    _reactView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    [self.view addSubview:_player.view];
    [self.view addSubview:_reactView];
    [self.view addObserver:self forKeyPath:kViewChangeKey options:NSKeyValueObservingOptionNew context:&kFrameChangeContext];

    [OOReactBridge getInstance].player = _player;
    [OOReactBridge getInstance].skinController = self;
    [_parentView addSubview:self.view];
    _isFullscreen = NO;
    _discoveryOptions = discoveryOptions;
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
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeStateChangedNotification:) name:OOOoyalaPlayerStateChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeCurrentItemChangedNotification:) name:OOOoyalaPlayerCurrentItemChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeTimeChangedNotification:) name:OOOoyalaPlayerTimeChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgePlayCompletedNotification:) name:OOOoyalaPlayerPlayCompletedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdStartNotification:) name:OOOoyalaPlayerAdStartedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdCompleteNotification:) name:OOOoyalaPlayerAdCompletedNotification object:self.player];
  }
}

- (void)bridgeTimeChangedNotification:(NSNotification *)notification {
  NSNumber *playheadNumber = [NSNumber numberWithFloat:_player.playheadTime];
  NSNumber *durationNumber = [NSNumber numberWithFloat:_player.duration];
  NSNumber *rateNumber = [NSNumber numberWithFloat:_player.playbackRate];
  NSDictionary *eventBody =
  @{@"duration":durationNumber,
    @"playhead":playheadNumber,
    @"rate":rateNumber,
    @"availableClosedCaptionsLanguages":self.player.availableClosedCaptionsLanguages};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

- (void) bridgeCurrentItemChangedNotification:(NSNotification *)notification {
  NSString *title = _player.currentItem.title ? _player.currentItem.title : @"";
  NSString *itemDescription = _player.currentItem.itemDescription ? _player.currentItem.itemDescription : @"";
  NSString *promoUrl = _player.currentItem.promoImageURL ? _player.currentItem.promoImageURL : @"";
  NSNumber *durationNumber = [NSNumber numberWithFloat:_player.currentItem.duration];
  NSNumber *frameWidth = [NSNumber numberWithFloat:self.view.frame.size.width];
  NSNumber *frameHeight = [NSNumber numberWithFloat:self.view.frame.size.height];
  NSDictionary *eventBody =
  @{@"title":title,
    @"description":itemDescription,
    @"promoUrl":promoUrl,
    @"duration":durationNumber,
    @"width":frameWidth,
    @"height":frameHeight};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
  if (_player.currentItem.embedCode && _discoveryOptions) {
    [self loadDiscovery:_player.currentItem.embedCode];
  }
}

- (void) bridgeStateChangedNotification:(NSNotification *)notification {
  NSString *stateString = [OOOoyalaPlayer playerStateToString:_player.state];
  NSDictionary *eventBody = @{@"state":stateString};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

- (void) bridgePlayCompletedNotification:(NSNotification *)notification {
  NSString *title = _player.currentItem.title ? _player.currentItem.title : @"";
  NSString *itemDescription = _player.currentItem.itemDescription ? _player.currentItem.itemDescription : @"";
  NSString *promoUrl = _player.currentItem.promoImageURL ? _player.currentItem.promoImageURL : @"";
  NSNumber *durationNumber = [NSNumber numberWithFloat:_player.currentItem.duration];
  
  NSDictionary *eventBody =
  @{@"title":title,
    @"description":itemDescription,
    @"promoUrl":promoUrl,
    @"duration":durationNumber};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];

}

- (void) bridgeAdStartNotification:(NSNotification *)notification {
  NSDictionary *eventBody = notification.userInfo;
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

- (void) bridgeAdCompleteNotification:(NSNotification *)notification {
  [OOReactBridge sendDeviceEventWithName:notification.name body:nil];
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

#pragma mark Discovery UI

- (void)loadStartScreenConfigureFile {
  // TODO: implement this.
}

- (void)loadDiscovery:(NSString *)embedCode {
  [OODiscoveryManager getResults:_discoveryOptions embedCode:embedCode pcode:_player.pcode parameters:nil callback:^(NSArray *results, OOOoyalaError *error) {
    if (error) {
      LOG(@"discovery request failed, error is %@", error.description);
    } else {
      [self handleDiscoveryResults:results];
    }
  }];
}

- (void)handleDiscoveryResults:(NSArray *)results {
  NSMutableArray *discoveryArray = [NSMutableArray new];
  for (NSDictionary *dict in results) {
    NSString *name = [dict objectForKey:@"name" ];
    NSString *embedCode = [dict objectForKey:@"embed_code"];
    NSString *imageUrl = [dict objectForKey:@"preview_image_url"];
    NSNumber *duration = [NSNumber numberWithDouble:[[dict objectForKey:@"duration"] doubleValue] / 1000];
    NSString *bucketInfo = [dict objectForKey:@"bucket_info"];
    NSDictionary *discoveryItem = @{@"name":name, @"embedCode":embedCode, @"imageUrl":imageUrl, @"duration":duration, @"bucketInfo":bucketInfo};
    [discoveryArray addObject:discoveryItem];
  }
  NSDictionary *eventBody = @{@"results":discoveryArray};
  [OOReactBridge sendDeviceEventWithName:DISCOVERY_RESULT_NOTIFICATION body:eventBody];
}

// KVO
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object
                        change:(NSDictionary *)change context:(void *)context
{
  if (context == &kFrameChangeContext) {
    NSNumber *width = [NSNumber numberWithFloat:self.view.frame.size.width];
    NSNumber *height = [NSNumber numberWithFloat:self.view.frame.size.height];

    NSDictionary *eventBody = @{@"width":width,@"height":height,@"fullscreen":[NSNumber numberWithBool:_isFullscreen]};
    [OOReactBridge sendDeviceEventWithName:(NSString *)kFrameChangeContext body:eventBody];
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

- (void)toggleFullscreen {
  [_player pause];
  [UIView beginAnimations:@"animateAddContentView" context:nil];
  [UIView setAnimationDuration:FULLSCREEN_ANIMATION_DURATION];
  [self.view removeFromSuperview];
  _isFullscreen = !_isFullscreen;
  if (_isFullscreen) {
    if (self.parentViewController) {
      _parentViewController = self.parentViewController;
      [self removeFromParentViewController];
    }
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    [window addSubview:self.view];
    [self.view setFrame:window.frame];
  } else {
    [_parentView addSubview:self.view];
    [self.view setFrame:_parentView.frame];
    if (_parentViewController) {
      [_parentViewController addChildViewController:self];
      _parentViewController = nil;
    }
  }
  [UIView commitAnimations];
  [_player play];
}

- (void)dealloc {
  [self.view removeObserver:self forKeyPath:kViewChangeKey];
}

@end
