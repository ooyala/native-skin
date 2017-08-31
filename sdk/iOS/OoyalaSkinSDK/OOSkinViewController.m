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
#import "OOQueuedEvent.h"

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
#define CC_STYLING_CHANGED_NOTIFICATION @"ccStylingChanged"
#define FULLSCREEN_ANIMATION_DURATION 0.5
#define FULLSCREEN_ANIMATION_DELAY 0

@interface OOSkinViewController ()

@property (nonatomic) RCTRootView *reactView;
@property (nonatomic) OOReactBridge *ooBridge;

@property (nonatomic, weak) UIViewController *inlineViewController;
@property (nonatomic) UIViewController *fullscreenViewController;
@property (nonatomic) UIViewController *inlineRootViewController;
@property (nonatomic) UIView * parentView;
@property (nonatomic) UIView * movieFullScreenView;
@property (nonatomic) OOUpNextManager *upNextManager;
@property (nonatomic) NSDictionary *skinConfig;
@property (atomic) NSMutableArray *queuedEvents; //QueuedEvent *
@property BOOL isReactReady;
@property OOSkinPlayerObserver *playerObserver;
@property (nonatomic, strong, readwrite) OOClosedCaptionsStyle *closedCaptionsDeviceStyle;
@end

@implementation OOSkinViewController

static NSString *outputVolumeKey = @"outputVolume";
static NSString *kFrameChangeContext = @"frameChanged";
static NSString *kViewChangeKey = @"frame";

NSString *const OOSkinViewControllerFullscreenChangedNotification = @"fullScreenChanged";

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
                   skinOptions:(OOSkinOptions *)skinOptions
                        parent:(UIView *)parentView
                 launchOptions:(NSDictionary *)options {
  if (self = [super init]) {
    LOG(@"Ooyala SKin Version: %@", OO_SKIN_VERSION);

    self.playerObserver = [[OOSkinPlayerObserver alloc] initWithPlayer:player skinViewController:self];
    [self disableBuiltInAdLearnMoreButton:player];
    _skinOptions = skinOptions;
    _skinConfig = [NSDictionary dictionaryFromSkinConfigFile:_skinOptions.configFileName
                                                  mergedWith:_skinOptions.overrideConfigs];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onReactReady:) name:RCTContentDidAppearNotification object:_reactView];
    _isReactReady = NO;

    self.ooBridge = [OOReactBridge new];
    //Passing self.ooBridge itself in the anonymous function counts as a self strong reference.
    //I create a copy of the pointer to avoid that
    OOReactBridge *newBridge = self.ooBridge;

    RCTBridge *bridge = [[RCTBridge alloc] initWithBundleURL:skinOptions.jsCodeLocation
                                              moduleProvider:^ NSArray *{
                                                  return @[newBridge];
                                              } launchOptions:nil];

    _reactView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"OoyalaSkin" initialProperties:_skinConfig];

    _queuedEvents = [NSMutableArray new];
    _parentView = parentView;
    CGRect rect = _parentView.bounds;

    [self.view setFrame:rect];
    [_player.view setFrame:rect];
    [self.view addObserver:self forKeyPath:kViewChangeKey options:NSKeyValueObservingOptionNew context:&kFrameChangeContext];

    [self.view addSubview:_player.view];

    //InitializeReactView and add to master view
    [_reactView setFrame:rect];
    [_reactView setOpaque:NO];
    [_reactView setBackgroundColor:[UIColor clearColor]];
    _reactView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    [self.view addSubview:_reactView];

    [OOVolumeManager addVolumeObserver:self];
    [self.ooBridge registerController:self];
    
    [_parentView addSubview:self.view];
    self.upNextManager = [[OOUpNextManager alloc] initWithPlayer:self.player bridge:self.ooBridge config:[self.skinConfig objectForKey:@"upNext"]];

    // Pre-create the MovieFullscreenView to use when necessary
    _fullscreen = NO;

    _movieFullScreenView = [[UIView alloc] init];
    _movieFullScreenView.alpha = 0.f;
    _movieFullScreenView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [_movieFullScreenView setBackgroundColor:[UIColor blackColor]];
    MACaptionAppearanceSetDisplayType(kMACaptionAppearanceDomainUser, kMACaptionAppearanceDisplayTypeForcedOnly);
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onApplicationDidBecomeActive:) name:UIApplicationDidBecomeActiveNotification object:nil];
  }
  return self;
}

- (UIViewController *)fullscreenViewController {
  if (!_fullscreenViewController) {
    _fullscreenViewController = [[UIViewController alloc] init];
  }
  return _fullscreenViewController;
}

- (void)disableBuiltInAdLearnMoreButton:(OOOoyalaPlayer *)player {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  _player = player;
  if (_player != nil) {
    SEL selector = NSSelectorFromString(@"disableAdLearnMoreButton");
    if ([player.options respondsToSelector:selector]) {
      [player.options performSelector:selector];
    }
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

- (void)ccStyleChanged:(NSNotification *) notification {
  self.closedCaptionsDeviceStyle = [OOClosedCaptionsStyle new];
  NSMutableDictionary *params = [NSMutableDictionary new];
  NSNumber *textSize = [[NSNumber alloc] initWithInteger:self.closedCaptionsDeviceStyle.textSize];
  UIColor *textColor = self.closedCaptionsDeviceStyle.textColor;
  UIColor *backgroundColor = self.closedCaptionsDeviceStyle.windowColor;
  UIColor *textBackgroundColor = self.closedCaptionsDeviceStyle.backgroundColor;
  NSString *fontName = self.closedCaptionsDeviceStyle.textFontName;
  NSNumber *textOpacity = [[NSNumber alloc] initWithFloat:self.closedCaptionsDeviceStyle.textOpacity];
  NSNumber *backgroundOpacity = [[NSNumber alloc] initWithFloat:self.closedCaptionsDeviceStyle.backgroundOpacity];
  //  MACaptionAppearanceTextEdgeStyle edgeStyle = self.closedCaptionsDeviceStyle.edgeStyle;
  NSString *backgroundColorHexValue = [self hexStringFromColor:backgroundColor];
  NSString *textBackgroundColorHexValue = [self hexStringFromColor:textBackgroundColor];
  NSString *textColorHexValue = [self hexStringFromColor:textColor];
  [params setObject:textSize forKey:@"textSize"];
  [params setObject:textColorHexValue forKey:@"textColor"];
  [params setObject:backgroundColorHexValue forKey:@"backgroundColor"];
  [params setObject:textBackgroundColorHexValue forKey:@"textBackgroundColor"];
  [params setObject:backgroundOpacity forKey:@"backgroundOpacity"];
  [params setObject:textOpacity forKey:@"textOpacity"];
  [params setObject:fontName forKey:@"fontName"];
  [self sendBridgeEventWithName:CC_STYLING_CHANGED_NOTIFICATION body:params];
}

- (NSString *)hexStringFromColor:(UIColor *)color {
  const CGFloat *components = CGColorGetComponents(color.CGColor);
  
  CGFloat r = components[0];
  CGFloat g = components[1];
  CGFloat b = components[2];
  
  return [NSString stringWithFormat:@"#%02lX%02lX%02lX",
          lroundf(r * 255),
          lroundf(g * 255),
          lroundf(b * 255)];
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
    // we assume we always get a string description, even if it is empty ("")
    NSString *description = [dict objectForKey:@"description"];
    NSDictionary *discoveryItem = @{@"name":name,
                                    @"embedCode":embedCode,
                                    @"imageUrl":imageUrl,
                                    @"duration":duration,
                                    @"bucketInfo":bucketInfo,
                                    @"description": description};
    [discoveryArray addObject:discoveryItem];
  }
  if([discoveryArray count] > 0 && (discoveryArray[0] != nil)) {
    [self.upNextManager setNextVideo:discoveryArray[0]];
  }
  NSDictionary *eventBody = @{@"results":discoveryArray};
  [self sendBridgeEventWithName:DISCOVERY_RESULT_NOTIFICATION body:eventBody];
}

// KVO
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object
                        change:(NSDictionary *)change context:(void *)context
{
  if (context == &kFrameChangeContext) {
    NSNumber *width = [NSNumber numberWithFloat:self.view.frame.size.width];
    NSNumber *height = [NSNumber numberWithFloat:self.view.frame.size.height];
    
    NSDictionary *eventBody = @{@"width":width,@"height":height,@"fullscreen":[NSNumber numberWithBool:self.isFullscreen]};
    [self sendBridgeEventWithName:(NSString *)kFrameChangeContext body:eventBody];
  } else if ([keyPath isEqualToString:outputVolumeKey]) {
    [self sendBridgeEventWithName:VolumeChangeKey body:@{@"volume": @([change[NSKeyValueChangeNewKey] floatValue])}];
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

- (void)dealloc {
  LOG(@"OOSkinViewController.dealloc")
  [self.view removeObserver:self forKeyPath:kViewChangeKey];
  [OOVolumeManager removeVolumeObserver:self];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  [self.ooBridge deregisterController:self];
  [self.player destroy];
}

- (void)setFullscreen:(BOOL)fullscreen {
  if (fullscreen == _fullscreen) return;
  
  BOOL wasPlaying = self.player.isPlaying;
  if( wasPlaying ) {
    [_player pause];
  }
  
  _fullscreen = fullscreen;
  [self notifyFullScreenChange:_fullscreen];
  if (_fullscreen) {
    [self.view removeFromSuperview];
    
    if(self.parentViewController){
      self.inlineViewController = self.parentViewController;
      [self.inlineViewController presentViewController:self.fullscreenViewController animated:NO completion:nil];
      [self removeFromParentViewController];
    }
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    self.inlineRootViewController = window.rootViewController;
    
    [self.movieFullScreenView setFrame:window.bounds];
    self.fullscreenViewController.view = self.movieFullScreenView;
    
    window.rootViewController = self.fullscreenViewController;
    [self.fullscreenViewController.view addSubview:self.view];
    
    [self.view setFrame:window.bounds];
    self.view.alpha = 0.0f;
    
    [UIView animateWithDuration:FULLSCREEN_ANIMATION_DURATION delay:0.0 options:UIViewAnimationOptionCurveLinear animations:^{
      self.movieFullScreenView.alpha = 1.f;
      self.view.alpha = 1.f;
    } completion:nil];
  } else {
    [self.parentView addSubview:self.view];
    [self.view setFrame:self.parentView.bounds];
    
    // removes the presented fullscreenViewController
    [self.inlineViewController dismissViewControllerAnimated:NO completion:nil];
    
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    window.rootViewController = self.inlineRootViewController;
    self.inlineRootViewController = nil;
    
    [self.inlineViewController addChildViewController:self];
    self.inlineViewController = nil;
    
    self.view.alpha = 0.0f;
    
    [UIView animateWithDuration:FULLSCREEN_ANIMATION_DURATION delay:0.0 options:UIViewAnimationOptionCurveLinear animations:^{
      self.movieFullScreenView.alpha = 0.f;
      self.view.alpha = 1.f;
    } completion:^(BOOL finished) {
      [self.movieFullScreenView removeFromSuperview];
    }];
  }
  if( wasPlaying ) {
    [self.player play];
  }

}

- (void)notifyFullScreenChange:(BOOL) isFullscreen {
  [[NSNotificationCenter defaultCenter] postNotificationName:OOSkinViewControllerFullscreenChangedNotification object:self
                                                    userInfo:@{@"fullScreen": @(isFullscreen)}];
}

@end

@implementation OOSkinViewController(Internal)

- (void)toggleFullscreen {
  [self setFullscreen:!self.isFullscreen];
}

- (OOUpNextManager *)upNextManager {
  return _upNextManager;
}

- (NSString *)version {
  return OO_SKIN_VERSION;
}

- (void)onReactReady:(NSNotification *)notification {
  if (_isReactReady) {
    LOG(@"received ReactReady notification after ready");
    return;
  }
  _isReactReady = YES;

  // PurgeEvents must happen after isReactReady, however, I'm not positive this is truly thread-safe.
  // If a notification is queued during PurgeEvents, there could be an execption
  [self purgeEvents];

  [self sendBridgeEventWithName:VolumeChangeKey body:@{@"volume": @([OOVolumeManager getCurrentVolume])}];

  [self ccStyleChanged:nil];
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

- (void)onApplicationDidBecomeActive:(NSNotification *)notification {
  MACaptionAppearanceSetDisplayType(kMACaptionAppearanceDomainUser, kMACaptionAppearanceDisplayTypeForcedOnly);
}

- (void)queueEventWithName:(NSString *)eventName body:(id)body {
  LOG(@"Queued Event: %@", eventName);
  OOQueuedEvent *event = [[OOQueuedEvent alloc] initWithWithName:eventName body:body];
  [self.queuedEvents addObject:event];
}

- (void)purgeEvents {
  LOG(@"Purging Events to skin");
  // PurgeEvents must happen after isReactReady, however, I'm not positive this is truly thread-safe.
  // If a notification is queued during PurgeEvents, there could be an execption
  for (OOQueuedEvent *event in self.queuedEvents) {
    [self sendBridgeEventWithName:event.eventName body:event.body];
  }
  [self.queuedEvents removeAllObjects];
}

- (void)sendBridgeEventWithName:(NSString *)eventName body:(id)body {
  [self.ooBridge sendDeviceEventWithName:eventName body:body];
}
@end
