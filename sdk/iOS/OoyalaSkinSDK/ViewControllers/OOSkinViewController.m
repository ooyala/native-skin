//
//  OOSkinViewController.m
//  OoyalaSkin
//
//  Created by Zhihui Chen on 4/16/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "OOSkinViewController.h"
#import "OOReactBridge.h"
#import "OOUpNextManager.h"
#import "OOLocaleHelper.h"
#import "OOSkinOptions.h"
#import "OOQueuedEvent.h"

#import <React/RCTRootView.h>

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
#import "FullscreenStateController.h"


#define DISCOVERY_RESULT_NOTIFICATION @"discoveryResultsReceived"
#define CC_STYLING_CHANGED_NOTIFICATION @"ccStylingChanged"


@interface OOSkinViewController ()

#pragma mark - Properties

@property (nonatomic) RCTRootView *reactView;
@property (nonatomic) OOReactBridge *ooBridge;
@property (nonatomic) UIViewController *fullscreenViewController;
@property (nonatomic) UIViewController *rootViewController;
@property (nonatomic) UIView *videoView;
@property (nonatomic) UIView *parentView;
@property (nonatomic) OOUpNextManager *upNextManager;
@property (nonatomic) NSDictionary *skinConfig;
@property (atomic) NSMutableArray *queuedEvents; //QueuedEvent *
@property (nonatomic, strong, readwrite) OOClosedCaptionsStyle *closedCaptionsDeviceStyle;
@property (nonatomic) UIPanGestureRecognizer *panGestureRecognizer;
@property (nonatomic) FullscreenStateController *fullscreenStateController;
@property BOOL isReactReady;
@property OOSkinPlayerObserver *playerObserver;

// VR properties

@property (nonatomic) BOOL isVRStereoMode;

// Interface orientation properties

@property (nonatomic) BOOL isManualOrientaionChange;
@property (nonatomic) BOOL isFullScreenPreviousState;
@property (nonatomic) UIInterfaceOrientation previousInterfaceOrientation;
@property (nonatomic) CGSize previousVideoSize;
@property (nonatomic) NSTimeInterval delayForDeviceOrientationAnimation;

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
    _previousVideoSize = CGSizeZero;
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
    
    // Video view configuration
    
    CGRect parentViewBounds = self.parentView.bounds;
    
    self.videoView = [UIView new];
    self.videoView.opaque = NO;
    self.videoView.backgroundColor = UIColor.clearColor;
    self.videoView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    
    self.videoView.frame = parentViewBounds;
    self.player.view.frame = parentViewBounds;
    self.reactView.frame = parentViewBounds;
    self.view.frame = parentViewBounds;

    [self.videoView addSubview:self.player.view];
    [self.videoView addSubview:self.reactView];
    [self.view addSubview:self.videoView];
    
    [self.parentView addSubview:self.view];
    
    // Add KVO for UI updates
    
    [self.videoView addObserver:self forKeyPath:kViewChangeKey options:NSKeyValueObservingOptionNew context:&kFrameChangeContext];
    
    // Initialize ReactView
    
    self.reactView.opaque = NO;
    self.reactView.backgroundColor = UIColor.clearColor;
    self.reactView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    
    [OOVolumeManager addVolumeObserver:self];
    [self.ooBridge registerController:self];
    
    self.upNextManager = [[OOUpNextManager alloc] initWithPlayer:self.player bridge:self.ooBridge config:[self.skinConfig objectForKey:@"upNext"]];
    
    // Pre-create the MovieFullscreenView to use when necessary
    _fullscreen = NO;
    
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
    
    // Audio settings
    
    [self setupAudioSettingsFromConfig:_skinConfig];
    
    // Interface orientation support
    _previousInterfaceOrientation = [UIApplication sharedApplication].statusBarOrientation;
    _isManualOrientaionChange = NO;
    _isFullScreenPreviousState = self.isFullscreen;
    
    // Configure fullscreen VC
    
    self.fullscreenViewController = [OOSkinFullScreenViewController new];
    
    // Configure fullscreen state controller
    
    self.fullscreenStateController = [[FullscreenStateController alloc] initWithParentView:self.parentView
                                                                             containerView:self.view
                                                                                 videoView:self.videoView
                                                               andFullscreenViewController:self.fullscreenViewController];
  }
  return self;
}

- (void)dealloc {
  LOG(@"OOSkinViewController.dealloc")
  [self.videoView removeObserver:self forKeyPath:kViewChangeKey];
  [OOVolumeManager removeVolumeObserver:self];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  [self.ooBridge deregisterController:self];
  [self.player destroy];
}

#pragma mark - Override view controller functions

- (BOOL)prefersHomeIndicatorAutoHidden {
  return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
  if (_fullscreen) {
    return [_fullscreenViewController supportedInterfaceOrientations];
  } else {
    return UIInterfaceOrientationMaskAll;
  }
}

- (BOOL)prefersStatusBarHidden {
  return _fullscreen;
}

- (UIStatusBarAnimation)preferredStatusBarUpdateAnimation {
  return UIStatusBarAnimationFade;
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
  
  __weak __typeof__(self) weakSelf = self;
  
  // Hide react view for start animation
  
  [self.reactView setHidden:YES];

  // Perfrom animation
  
  [self.fullscreenStateController setFullscreen:fullscreen completion:^{
    dispatch_async(dispatch_get_main_queue(), ^{
      
      // Notify observers what screen state changed
      
      [weakSelf notifyFullScreenChange:fullscreen];
      
      // Notify what fullscreen did changed
      
      if (completion) {
        completion();
      }
      
      // Resume player if needed after fullscreen mode action
      
      if (wasPlaying) {
        [weakSelf.player play];
      }
      
      // Show react view for start animation
      
      [weakSelf.reactView setHidden:NO];
    });
  }];
}

- (void)notifyFullScreenChange:(BOOL)isFullscreen {
  [[NSNotificationCenter defaultCenter] postNotificationName:OOSkinViewControllerFullscreenChangedNotification
                                                      object:self
                                                    userInfo:@{@"fullScreen": @(isFullscreen)}];
}

- (void)setupAudioSettingsFromConfig:(NSDictionary *)config {
  NSDictionary *audioSettingsJSON = [config objectForKey:@"audio"];
  NSString *defaultAudioLanguageCode = [audioSettingsJSON objectForKey:@"audioLanguage"];

  if (defaultAudioLanguageCode) {
    [self.player setDefaultConfigAudioTrackLanguageCode:defaultAudioLanguageCode];
  }
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
  if (self.fullscreen == fullscreen) { return; }
  
  if (self.isVRStereoMode && !fullscreen) {
    [self toggleStereoMode];
  } else {
    [self setFullscreen:fullscreen completion:NULL];
  }
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
    NSNumber *width = [NSNumber numberWithFloat:self.videoView.frame.size.width];
    NSNumber *height = [NSNumber numberWithFloat:self.videoView.frame.size.height];
    CGSize nowSize = CGSizeMake(self.videoView.frame.size.width, self.videoView.frame.size.height);

    NSDictionary *eventBody = @{@"width": width, @"height": height, @"fullscreen": [NSNumber numberWithBool:self.isFullscreen]};

    if (!CGSizeEqualToSize(nowSize, self.previousVideoSize)) {
      _previousVideoSize = nowSize;
      [self sendBridgeEventWithName:(NSString *) kFrameChangeContext body:eventBody];
    }
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

    // Change device orienation to lanscape right
    if ([[UIDevice currentDevice] orientation] == UIInterfaceOrientationLandscapeRight) {
      weakSelf.delayForDeviceOrientationAnimation = 0;
    } else {
      weakSelf.delayForDeviceOrientationAnimation = UIApplication.sharedApplication.statusBarOrientationAnimationDuration;
    }
    
    [[UIDevice currentDevice] setValue:[NSNumber numberWithInt:UIInterfaceOrientationLandscapeRight] forKey:@"orientation"];
    [UIViewController attemptRotationToDeviceOrientation];

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(weakSelf.delayForDeviceOrientationAnimation * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      
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
    [UIViewController attemptRotationToDeviceOrientation];

    weakSelf.delayForDeviceOrientationAnimation = weakSelf.isFullScreenPreviousState ? 0 : UIApplication.sharedApplication.statusBarOrientationAnimationDuration;
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(weakSelf.delayForDeviceOrientationAnimation * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
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

- (CGRect)videoViewFrame {
  return self.videoView.frame;
}

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
  if (self.isVRStereoMode) {
    [self toggleStereoMode];
  } else {
    [self setFullscreen:!self.fullscreen completion:NULL];
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

