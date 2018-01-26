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
#import "OOSkinViewController+Internal.h"
#import "OOSkinFullScreenViewController.h"


#define DISCOVERY_RESULT_NOTIFICATION @"discoveryResultsReceived"
#define CC_STYLING_CHANGED_NOTIFICATION @"ccStylingChanged"
#define FULLSCREEN_ANIMATION_DURATION 0.5
#define FULLSCREEN_ANIMATION_DELAY 0


@interface OOSkinViewController ()

#pragma mark - Properties

@property(nonatomic) RCTRootView *reactView;
@property(nonatomic) OOReactBridge *ooBridge;

@property(nonatomic, weak) UIViewController *inlineViewController;
@property(nonatomic) UIViewController *fullscreenViewController;
@property(nonatomic) UIViewController *inlineRootViewController;
@property(nonatomic) UIView *parentView;
@property(nonatomic) UIView *movieFullScreenView;
@property(nonatomic) OOUpNextManager *upNextManager;
@property(nonatomic) NSDictionary *skinConfig;
@property(atomic) NSMutableArray *queuedEvents; //QueuedEvent *
@property BOOL isReactReady;
@property OOSkinPlayerObserver *playerObserver;
@property(nonatomic, strong, readwrite) OOClosedCaptionsStyle *closedCaptionsDeviceStyle;

@property(nonatomic) UIPanGestureRecognizer *panGestureRecognizer;

// VR properties
@property (nonatomic) BOOL isVRStereoMode;

// Interface orientation properties
@property (nonatomic) BOOL isManualOrientaionChange;
@property (nonatomic) BOOL isFullScreenPreviousState;

@property (nonatomic) UIInterfaceOrientation currentInterfaceOrientation;
@property (nonatomic) UIInterfaceOrientation previousInterfaceOrientation;

@end


@implementation OOSkinViewController

#pragma mark - Constants

static NSString *outputVolumeKey = @"outputVolume";
static NSString *kFrameChangeContext = @"frameChanged";
static NSString *kViewChangeKey = @"frame";

NSString *const OOSkinViewControllerFullscreenChangedNotification = @"fullScreenChanged";

#pragma mark - Initialization

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
    
    _isReactReady = NO;
    
    self.ooBridge = [OOReactBridge new];
    // Passing self.ooBridge itself in the anonymous function counts as a self strong reference.
    // I create a copy of the pointer to avoid that
    OOReactBridge *newBridge = self.ooBridge;
    
    RCTBridge *bridge = [[RCTBridge alloc] initWithBundleURL:skinOptions.jsCodeLocation
                                              moduleProvider:^NSArray * {
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
    
    // InitializeReactView and add to master view
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
    MACaptionAppearanceSetDisplayType(kMACaptionAppearanceDomainUser, kMACaptionAppearanceDisplayTypeForcedOnly);
    
    // Add notifications
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onReactReady:)
                                                 name:RCTContentDidAppearNotification
                                               object:_reactView];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onApplicationDidBecomeActive:)
                                                 name:UIApplicationDidBecomeActiveNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(vrPlayerDidConfiguredAction)
                                                 name:OOOoyalaVRPlayerDidConfigured
                                               object:nil];
    
    // VR properties
    _isVRStereoMode = NO;
    
    // Interface orientation support
    _previousInterfaceOrientation = [UIApplication sharedApplication].statusBarOrientation;
    _isManualOrientaionChange = NO;
    _isFullScreenPreviousState = self.isFullscreen;
  }
  
  return self;
}

- (void)dealloc {
  LOG(@"OOSkinViewController.dealloc")
  [self.view removeObserver:self forKeyPath:kViewChangeKey];
  [OOVolumeManager removeVolumeObserver:self];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  [self.ooBridge deregisterController:self];
  [self.player destroy];
}

#pragma mark - Override view controller functions

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
  if (_fullscreen) {
    return [_fullscreenViewController supportedInterfaceOrientations];
  } else {
    return UIInterfaceOrientationMaskAll;
  }
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
  if (_fullscreen) {
    return [_fullscreenViewController shouldAutorotateToInterfaceOrientation:interfaceOrientation];
  } else {
    return YES;
  }
}

- (BOOL)prefersStatusBarHidden {
  return _fullscreen;
}

#pragma mark - Private functions

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

- (void)setFullscreen:(BOOL)fullscreen completion:(nullable void (^)())completion {
  if (fullscreen == _fullscreen) {
    
    // Notify what fullscreen did changed
    if (completion) {
      completion();
    }
    
    return;
  }
  
  _fullscreen = fullscreen;
  
  BOOL wasPlaying = self.player.isPlaying;
  
  // Pause player if needed for change fullScreen mode action duration
  if (wasPlaying) {
    [_player pause];
  }
  
  // Perform changes for fullscreen/inline mode
  if (fullscreen) {
    [self openFullscreenMode:^{
      
      // Notify observers what screen state changed
      [self notifyFullScreenChange:_fullscreen];
      
      // Notify what fullscreen did changed
      if (completion) {
        completion();
      }
      // Resume player if needed after fullscreen mode action
      if (wasPlaying) {
        [self.player play];
      }
    }];
  } else {
    [self openInlineMode:^{
      
      // Notify observers what screen state changed
      [self notifyFullScreenChange:_fullscreen];
      
      // Notify what fullscreen did changed
      if (completion) {
        completion();
      }
      // Resume player if needed after fullscreen mode action
      if (wasPlaying) {
        [self.player play];
      }
    }];
  }
}

- (void)openFullscreenMode:(nullable void (^)())completion {
  UIWindow *window = [UIApplication sharedApplication].keyWindow;
  _inlineRootViewController = window.rootViewController;
  
  // Remove video view from container
  [self.view removeFromSuperview];
  self.view.frame = _parentView.frame;
  
  // Save parent view controller
  _inlineViewController = self.parentViewController;
  [self removeFromParentViewController];
  
  // Add fullscreen view controller on inline view controller
  [_inlineViewController addChildViewController:self.fullscreenViewController];
  [_inlineViewController.view addSubview:self.fullscreenViewController.view];
  
  self.fullscreenViewController.view.frame = window.bounds;
  [self.fullscreenViewController.view addSubview:self.view];
  
  // Perform animations
  [UIView animateWithDuration:FULLSCREEN_ANIMATION_DURATION animations:^{
    [self.view setFrame:window.bounds];
  } completion:^(BOOL finished) {
    [self.fullscreenViewController.view removeFromSuperview];
    [self.fullscreenViewController removeFromParentViewController];
    [self.fullscreenViewController addChildViewController:self];
    
    // Change window root view controller
    [window setRootViewController:self.fullscreenViewController];
    [window makeKeyAndVisible];
    
    // Completion
    if (completion) {
      completion();
    }
  }];
}

- (void)openInlineMode:(nullable void (^)())completion {
  UIWindow *window = [UIApplication sharedApplication].keyWindow;
  
  window.frame = [UIScreen mainScreen].bounds;
  window.rootViewController = _inlineRootViewController;
  
  [_inlineViewController.view addSubview:self.fullscreenViewController.view];
  [_inlineViewController addChildViewController:self.fullscreenViewController];
  
  self.fullscreenViewController.view.frame = _inlineViewController.view.frame;
  
  [UIView animateWithDuration:FULLSCREEN_ANIMATION_DURATION animations:^{
    self.view.frame = _parentView.frame;
  } completion:^(BOOL finished) {
    
    [self removeFromParentViewController];
    [self.fullscreenViewController.view removeFromSuperview];
    [self.fullscreenViewController removeFromParentViewController];
    
    [_parentView addSubview:self.view];
    [_inlineViewController addChildViewController:self];
    
    self.view.frame = _parentView.bounds;
    
    // Notify observers what screen sate changed
    [self notifyFullScreenChange:_fullscreen];
    
    // Completion
    if (completion) {
      completion();
    }
  }];
}

- (UIViewController *)fullscreenViewController {
  if (!_fullscreenViewController) {
    _fullscreenViewController = [OOSkinFullScreenViewController new];
  }
  return _fullscreenViewController;
}

- (void)notifyFullScreenChange:(BOOL)isFullscreen {
  [[NSNotificationCenter defaultCenter] postNotificationName:OOSkinViewControllerFullscreenChangedNotification
                                                      object:self
                                                    userInfo:@{@"fullScreen": @(isFullscreen)}];
}

#pragma mark - Discovery UI

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

#pragma mark - Public functions

- (void)setFullscreen:(BOOL)fullscreen {
  [self setFullscreen:fullscreen completion:nil];
}

- (void)ccStyleChanged:(NSNotification *)notification {
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

- (void)sendBridgeEventWithName:(NSString *)eventName body:(id)body {
  [self.ooBridge sendDeviceEventWithName:eventName body:body];
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
    NSString *name = [dict objectForKey:@"name"];
    NSString *imageUrl = [dict objectForKey:@"preview_image_url"];
    NSNumber *duration = [NSNumber numberWithDouble:[[dict objectForKey:@"duration"] doubleValue] / 1000];
    NSString *bucketInfo = [dict objectForKey:@"bucket_info"];
    // we assume we always get a string description, even if it is empty ("")
    NSString *description = [dict objectForKey:@"description"];
    NSDictionary *discoveryItem = @{@"name": name,
                                    @"embedCode": embedCode,
                                    @"imageUrl": imageUrl,
                                    @"duration": duration,
                                    @"bucketInfo": bucketInfo,
                                    @"description": description};
    [discoveryArray addObject:discoveryItem];
  }
  if ([discoveryArray count] > 0 && (discoveryArray[0] != nil)) {
    [self.upNextManager setNextVideo:discoveryArray[0]];
  }
  NSDictionary *eventBody = @{@"results": discoveryArray};
  [self sendBridgeEventWithName:DISCOVERY_RESULT_NOTIFICATION body:eventBody];
}

#pragma mark - KVO

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object
                        change:(NSDictionary *)change context:(void *)context {
  if (context == &kFrameChangeContext) {
    NSNumber *width = [NSNumber numberWithFloat:self.view.frame.size.width];
    NSNumber *height = [NSNumber numberWithFloat:self.view.frame.size.height];
    
    NSDictionary *eventBody = @{@"width": width, @"height": height, @"fullscreen": [NSNumber numberWithBool:self.isFullscreen]};
    [self sendBridgeEventWithName:(NSString *) kFrameChangeContext body:eventBody];
  } else if ([keyPath isEqualToString:outputVolumeKey]) {
    [self sendBridgeEventWithName:VolumeChangeKey body:@{@"volume": @([change[NSKeyValueChangeNewKey] floatValue])}];
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

#pragma mark - Stereo Mode Handle

- (void)enterStereoMode {
  
  // Save previous full screen state
  _isFullScreenPreviousState = _fullscreen;
  
  // Save previous interface orientation
  _previousInterfaceOrientation = [UIApplication sharedApplication].statusBarOrientation;
  
  // Create weak self object
  __weak OOSkinViewController *weakSelf = self;
  
  // Change screen mode if needed
  [self setFullscreen:YES completion:^{
    // Reset full screen view controller
    OOSkinFullScreenViewController *fullScreenController = nil;
    
    if (weakSelf.fullscreenViewController) {
      fullScreenController = (OOSkinFullScreenViewController *)weakSelf.fullscreenViewController;
      fullScreenController.enableVRStereoMode = YES;
    }
    
    // Manualy change device orientation on landscape right
    _isManualOrientaionChange = YES;
    
    NSTimeInterval delayFotDeviceOrientationAnimation = 0;
    
    // Change device orienation to lanscape right
    if ([[UIDevice currentDevice] orientation] == UIInterfaceOrientationLandscapeRight) {
      delayFotDeviceOrientationAnimation = 0;
    } else {
      delayFotDeviceOrientationAnimation = UIApplication.sharedApplication.statusBarOrientationAnimationDuration;
    }
    
    [[UIDevice currentDevice] setValue:[NSNumber numberWithInt:UIInterfaceOrientationLandscapeRight] forKey:@"orientation"];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayFotDeviceOrientationAnimation * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      
      // Notify observers what stereo mode did changed
      [[NSNotificationCenter defaultCenter] postNotificationName:OOOoyalaPlayerSwitchSceneNotification object:nil];
      
      _isManualOrientaionChange = NO;
    });
  }];
}

- (void)exitStereoMode {
  
  // Notify observers what stereo mode did changed
  [[NSNotificationCenter defaultCenter] postNotificationName:OOOoyalaPlayerSwitchSceneNotification object:nil];
  
  ((OOSkinFullScreenViewController *)_fullscreenViewController).enableVRStereoMode = NO;
  
  // Reset fullscreen view controller
  OOSkinFullScreenViewController *fullScreenController = nil;
  
  if (self.fullscreenViewController) {
    fullScreenController = (OOSkinFullScreenViewController *)_fullscreenViewController;
    fullScreenController.enableVRStereoMode = NO;
  }
  
  // Create weak self object
  __weak OOSkinViewController *weakSelf = self;
  
  // Change screen mode if needed
  [self setFullscreen:_isFullScreenPreviousState completion:^{
    
    // Manualy change device orientation for previous value
    _isManualOrientaionChange = YES;
    
    [[UIDevice currentDevice] setValue:[NSNumber numberWithInt:weakSelf.previousInterfaceOrientation] forKey:@"orientation"];
    
    NSTimeInterval delayFotDeviceOrientationAnimation = weakSelf.isFullScreenPreviousState ? 0 : UIApplication.sharedApplication.statusBarOrientationAnimationDuration;
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayFotDeviceOrientationAnimation * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      _isManualOrientaionChange = NO;
    });
  }];
}

#pragma mark - Notifications

- (void)vrPlayerDidConfiguredAction {
  if (_isVRStereoMode) {
    
    // Notify observers what stereo mode did changed
    [[NSNotificationCenter defaultCenter] postNotificationName:OOOoyalaPlayerSwitchSceneNotification object:nil];
  }
}

@end

#pragma mark - (Internal implementation)

@implementation OOSkinViewController (Internal)

- (void)toggleStereoMode {
  dispatch_async(dispatch_get_main_queue(), ^{
    _isVRStereoMode = !_isVRStereoMode;
    
    if (_isVRStereoMode) {
      [self enterStereoMode];
    } else {
      [self exitStereoMode];
    }
  });
}

- (void)toggleFullscreen {
  
  // Save previous full screen state
  _isFullScreenPreviousState = _fullscreen;
  
  if (_fullscreen && _isVRStereoMode) {
    [self toggleStereoMode];
  } else {
    [self setFullscreen:!_fullscreen completion:NULL];
  }
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

@end

