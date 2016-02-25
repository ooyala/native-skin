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
#import "OOUpNextManager.h"
#import "OOLocaleHelper.h"
#import "OOSkinOptions.h"

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOVideo.h>
#import <OoyalaSDK/OOModule.h>
#import <OoyalaSDK/OOEmbeddedSecureURLGenerator.h>
#import <OoyalaSDK/OODiscoveryManager.h>
#import <OoyalaSDK/OODebugMode.h>
#import <OoyalaSDK/OOOptions.h>
#import "OOConstant.h"
#import "OOVolumeManager.h"
#import "OOSkinPlayerObserver.h"
#import "NSDictionary+Utils.h"

#define DISCOVERY_RESULT_NOTIFICATION @"discoveryResultsReceived"
#define FULLSCREEN_ANIMATION_DURATION 0.5
#define FULLSCREEN_ANIMATION_DELAY 0

@interface OOSkinViewController () {
  RCTRootView *_reactView;
  UIViewController *_parentViewController;
  UIView *_parentView;
  UIView *_movieFullScreenView;
}

@property (nonatomic) OOUpNextManager *upNextManager;
@property (nonatomic) NSDictionary *skinConfig;
@property (nonatomic) BOOL isFullscreen;
@property BOOL isReactReady;
@property OOSkinPlayerObserver *playerObserver;
@end

@implementation OOSkinViewController

static NSString *outputVolumeKey = @"outputVolume";
static NSString *kFrameChangeContext = @"frameChanged";
static NSString *kViewChangeKey = @"frame";
static NSDictionary *kSkinCofig;

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
                   skinOptions:(OOSkinOptions *)skinOptions
                        parent:(UIView *)parentView
                 launchOptions:(NSDictionary *)options {
  if (self = [super init]) {
    LOG(@"Ooyala SKin Version: %@", OO_SKIN_VERSION);

    self.playerObserver = [[OOSkinPlayerObserver alloc] initWithPlayer:player skinViewController:self];
    [self setPlayer:player];
    _skinOptions = skinOptions;
    _skinConfig = [NSDictionary dictionaryFromSkinConfigFile:_skinOptions.configFileName
                                                  mergedWith:_skinOptions.overrideConfigs];
    kSkinCofig = _skinConfig;


    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onReactReady:) name:RCTContentDidAppearNotification object:_reactView];
    _isReactReady = NO;

    _reactView = [[RCTRootView alloc] initWithBundleURL:skinOptions.jsCodeLocation
                                             moduleName:@"OoyalaSkin"
                                      initialProperties:_skinConfig
                                          launchOptions:nil];
    
    _parentView = parentView;
    CGRect rect = _parentView.bounds;
    [self.view setFrame:rect];
    [_player.view setFrame:rect];
    [_reactView setFrame:rect];
    [_reactView setOpaque:NO];
    [_reactView setBackgroundColor:[UIColor clearColor]];
    _reactView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    
    [self.view addSubview:_player.view];
    [self.view addSubview:_reactView];
    [self.view addObserver:self forKeyPath:kViewChangeKey options:NSKeyValueObservingOptionNew context:&kFrameChangeContext];
    
    [OOVolumeManager addVolumeObserver:self];
    [OOReactBridge registerController:self];
    
    [_parentView addSubview:self.view];
    _isFullscreen = NO;
    self.upNextManager = [[OOUpNextManager alloc] initWithPlayer:self.player config:[self.skinConfig objectForKey:@"upNextScreen"]];
    
    _movieFullScreenView = [[UIView alloc] init];
    _movieFullScreenView.alpha = 0.f;
    _movieFullScreenView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [_movieFullScreenView setBackgroundColor:[UIColor blackColor]];
    
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
    SEL selector = NSSelectorFromString(@"disableAdLearnMoreButton");
    if ([player.options respondsToSelector:selector]) {
      [player.options performSelector:selector];
    }
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeStateChangedNotification:) name:OOOoyalaPlayerStateChangedNotification object:_player];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeCurrentItemChangedNotification:) name:OOOoyalaPlayerCurrentItemChangedNotification object:_player];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeTimeChangedNotification:) name:OOOoyalaPlayerTimeChangedNotification object:_player];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgePlayCompletedNotification:) name:OOOoyalaPlayerPlayCompletedNotification object:self.player];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdStartNotification:) name:OOOoyalaPlayerAdStartedNotification object:self.player];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdPodCompleteNotification:) name:OOOoyalaPlayerAdPodCompletedNotification object:self.player];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgePlayStartedNotification:) name:OOOoyalaPlayerPlayStartedNotification object:self.player];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeErrorNotification:) name:OOOoyalaPlayerErrorNotification object:self.player];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdTappedNotification:) name:OOOoyalaPlayerAdTappedNotification object:self.player];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeEmbedCodeNotification:) name:OOOoyalaPlayerEmbedCodeSetNotification object:self.player];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onReactReady:) name:RCTContentDidAppearNotification object:_reactView];
  }
}

#pragma mark Discovery UI

- (void)maybeLoadDiscovery:(NSString *)embedCode {

  if (_player.currentItem.embedCode && self.skinOptions.discoveryOptions) {
    [OODiscoveryManager getResults:self.skinOptions.discoveryOptions embedCode:embedCode pcode:_player.pcode parameters:nil callback:^(NSArray *results, OOOoyalaError *error) {
      if (error) {
        LOG(@"discovery request failed, error is %@", error.description);
      } else {
        [self handleDiscoveryResults:results embedCode:embedCode];
      }
    }];
  }
}

- (void)handleDiscoveryResults:(NSArray *)results embedCode:(NSString *)currentEmbedCode {
  NSMutableArray *discoveryArray = [NSMutableArray new];
  for (NSDictionary *dict in results) {
    NSString *embedCode = [dict objectForKey:@"embed_code"];
    if ([embedCode isEqualToString:currentEmbedCode]) {
      continue;
    }
    NSString *name = [dict objectForKey:@"name" ];
    NSString *imageUrl = [dict objectForKey:@"preview_image_url"];
    NSNumber *duration = [NSNumber numberWithDouble:[[dict objectForKey:@"duration"] doubleValue] / 1000];
    NSString *bucketInfo = [dict objectForKey:@"bucket_info"];
    NSDictionary *discoveryItem = @{@"name":name, @"embedCode":embedCode, @"imageUrl":imageUrl, @"duration":duration, @"bucketInfo":bucketInfo};
    [discoveryArray addObject:discoveryItem];
  }
  if([discoveryArray count] > 0 && (discoveryArray[0] != nil)) {
    [self.upNextManager setNextVideo:discoveryArray[0]];
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
  } else if ([keyPath isEqualToString:outputVolumeKey]) {
    [OOVolumeManager sendVolumeChangeEvent:[change[NSKeyValueChangeNewKey] floatValue]];
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

- (void)dealloc {
  LOG(@"OOSkinViewController.dealloc")
  [self.view removeObserver:self forKeyPath:kViewChangeKey];
  [OOVolumeManager removeVolumeObserver:self];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  [OOReactBridge deregisterController:self];
}

@end

@implementation OOSkinViewController(Internal)

- (void)toggleFullscreen {
  BOOL wasPlaying = self.player.isPlaying;
  if( wasPlaying ) {
    [_player pause];
  }
  _isFullscreen = !_isFullscreen;
  if (_isFullscreen) {
    [self.view removeFromSuperview];
    
    if(self.parentViewController){
      _parentViewController = self.parentViewController;
      [_parentViewController presentViewController:[[UIViewController alloc] init] animated:NO completion:nil];
      [self removeFromParentViewController];
    }
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    
    [_movieFullScreenView setFrame:window.bounds];

    [window addSubview:_movieFullScreenView];
    [_movieFullScreenView addSubview:self.view];
    [self.view setFrame:window.bounds];
    self.view.alpha = 0.0f;
    
    [UIView animateWithDuration:FULLSCREEN_ANIMATION_DURATION delay:0.0 options:UIViewAnimationOptionCurveLinear animations:^{
      _movieFullScreenView.alpha = 1.f;
      self.view.alpha = 1.f;
    } completion:^(BOOL finished) {
      
    }];
  } else {
    [_parentView addSubview:self.view];
    [self.view setFrame:_parentView.bounds];
    
    [_parentViewController dismissViewControllerAnimated:NO completion:nil];
    [_parentViewController addChildViewController:self];
    _parentViewController = nil;
    
    self.view.alpha = 0.0f;
    
    [UIView animateWithDuration:FULLSCREEN_ANIMATION_DURATION delay:0.0 options:UIViewAnimationOptionCurveLinear animations:^{
      _movieFullScreenView.alpha = 0.f;
      self.view.alpha = 1.f;
    } completion:^(BOOL finished) {
      [_movieFullScreenView removeFromSuperview];
    }];
  }
  if( wasPlaying ) {
    [self.player play];
  }
}

- (OOUpNextManager *)upNextManager {
  return _upNextManager;
}

- (NSString *) version {
  return OO_SKIN_VERSION;
}

- (void)onReactReady:(NSNotification *)notification {
  if (_isReactReady) {
    LOG(@"received ReactReady notification after ready");
    return;
  }
  _isReactReady = YES;

  if (_player.currentItem) {
    // embedcode already set, send current item information
    NSNotification *notification = [NSNotification notificationWithName:OOOoyalaPlayerCurrentItemChangedNotification object:nil];
    [self.playerObserver bridgeCurrentItemChangedNotification:notification];
  }

  if (_player.state == OOOoyalaPlayerStateError) {
    NSNotification *notification = [NSNotification notificationWithName:OOOoyalaPlayerErrorNotification object:nil];
    [self.playerObserver bridgeErrorNotification:notification];
  } else if (_player.state == OOOoyalaPlayerStatePlaying || _player.state == OOOoyalaPlayerStatePaused) {
    NSNotification *notification = [NSNotification notificationWithName:OOOoyalaPlayerStateChangedNotification object:nil];
    [self.playerObserver bridgeStateChangedNotification:notification];
    
    // send current volume level the at load
    [OOVolumeManager sendVolumeChangeEvent:[OOVolumeManager getCurrentVolume]];
  }
}

+ (NSDictionary *)getTextForSocialType: (NSString *)socialType {
  NSDictionary *dictSocial;
  
  NSString *social_unavailable;
  NSString *social_success;
  NSString *post_title = [OOLocaleHelper localizedStringFromDictionary:kSkinCofig forKey:@"Post Title"];
  NSString *account_configure =[OOLocaleHelper localizedStringFromDictionary:kSkinCofig forKey:@"Account Configure"];
  
  if ([socialType isEqual:@"Facebook"]) {
    social_unavailable = [OOLocaleHelper localizedStringFromDictionary:kSkinCofig forKey:@"Facebook Unavailable"];
    social_success = [OOLocaleHelper localizedStringFromDictionary:kSkinCofig forKey:@"Facebook Success"];
    
    dictSocial = @{@"Facebook Unavailable": social_unavailable,
                   @"Facebook Success": social_success,
                   @"Post Title": post_title,
                   @"Account Configure": account_configure};
    
  } else if ([socialType isEqual: @"Twitter"]) {
    social_unavailable = [OOLocaleHelper localizedStringFromDictionary:kSkinCofig forKey:@"Twitter Unavailable"];
    social_success = [OOLocaleHelper localizedStringFromDictionary:kSkinCofig forKey:@"Twitter Success"];
    
    dictSocial = @{@"Twitter Unavailable": social_unavailable,
                   @"Twitter Success": social_success,
                   @"Post Title": post_title,
                   @"Account Configure": account_configure};
  }
  
  return dictSocial;
}

- (void)disableReactViewInteraction {
  _reactView.userInteractionEnabled = NO;

}
- (void)enableReactViewInteraction {
  _reactView.userInteractionEnabled = YES;
}

- (BOOL)isReactViewInteractionEnabled {
  return _reactView.userInteractionEnabled;
}

- (void)playPauseFromAdTappedNotification {
  if (![self isReactViewInteractionEnabled]) {
    if (_player.state == OOOoyalaPlayerStatePlaying) {
      [_player pause];
    } else {
      [_player play];
    }
  }
}

@end
