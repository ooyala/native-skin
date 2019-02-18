//
//  OOSkinViewController.m
//  OoyalaSkin
//
//  Created by Zhihui Chen on 4/16/15.
//  Copyright (c) 2015 Ooyala. All rights reserved.
//

#import "OOSkinViewController.h"
#import "OOSkinOptions.h"

#import <MediaAccessibility/MediaAccessibility.h>
#import "OOReactSkinModel.h"
#import <React/RCTRootView.h>

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OODebugMode.h>
#import <OoyalaSDK/OOOptions.h>
#import <OoyalaSDK/OOAudioSession.h>

#import "OOConstant.h"
#import "OOSkinViewControllerDelegate.h"
#import "OOSkinFullScreenViewController.h"
#import "FullscreenStateController.h"


@interface OOSkinViewController () <OOSkinViewControllerDelegate>

#pragma mark - Properties

@property (nonatomic) OOReactSkinModel *skinModel;
@property (nonatomic) RCTRootView *reactView;
@property (nonatomic) UIViewController *fullscreenViewController;
@property (nonatomic) UIViewController *rootViewController;
@property (nonatomic) UIView *videoView;
@property (nonatomic) UIView *parentView;
@property (nonatomic) UIPanGestureRecognizer *panGestureRecognizer;
@property (nonatomic) FullscreenStateController *fullscreenStateController;

// VR properties
@property (nonatomic) BOOL isVRStereoMode;

// Interface orientation properties
@property (nonatomic) BOOL isManualOrientaionChange;
@property (nonatomic) BOOL isFullScreenPreviousState;
@property (nonatomic) UIInterfaceOrientation previousInterfaceOrientation;
@property (nonatomic) NSTimeInterval delayForDeviceOrientationAnimation;

@end


@implementation OOSkinViewController

#pragma mark - Constants

static NSString *kFrameChangeContext = @"frameChanged";
static NSString *kViewChangeKey =      @"frame";
static NSString *fullscreenKey =       @"fullscreen";
static NSString *widthKey =            @"width";
static NSString *heightKey =           @"height";

NSString *const OOSkinViewControllerFullscreenChangedNotification = @"fullScreenChanged";

@synthesize reactViewInteractionEnabled;

#pragma mark - Initialization

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
                   skinOptions:(OOSkinOptions *)skinOptions
                        parent:(UIView *)parentView
                 launchOptions:(NSDictionary *)options {
  if (self = [super init]) {
    LOG(@"Ooyala SKin Version: %@", OO_SKIN_VERSION);

    _player = player;
    _skinOptions = skinOptions;

    _skinModel = [[OOReactSkinModel alloc] initWithWithPlayer:player
                                                  skinOptions:_skinOptions
                                       skinControllerDelegate:self];
    _reactView = [_skinModel viewForModuleWithName:@"OoyalaSkin"];

    // Video view configuration
    _parentView = parentView;
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
    [self.videoView addObserver:self
                     forKeyPath:kViewChangeKey
                        options:NSKeyValueObservingOptionNew
                        context:&kFrameChangeContext];
    
    // Initialize ReactView
    self.reactView.opaque = NO;
    self.reactView.backgroundColor = UIColor.clearColor;
    self.reactView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        
    // Pre-create the MovieFullscreenView to use when necessary
    _fullscreen = NO;
    
    // Add notifications
    
    [NSNotificationCenter.defaultCenter addObserver:self
                                            selector:@selector(onReactReady:)
                                                name:RCTContentDidAppearNotification
                                              object:_reactView];
    
    [NSNotificationCenter.defaultCenter addObserver:self
                                            selector:@selector(onApplicationDidBecomeActive:)
                                                name:UIApplicationDidBecomeActiveNotification
                                              object:nil];
    
    [NSNotificationCenter.defaultCenter addObserver:self
                                            selector:@selector(vrPlayerDidConfiguredAction)
                                                name:OOOoyalaVRPlayerDidConfigured
                                              object:nil];
    
    [NSNotificationCenter.defaultCenter addObserver:self
                                            selector:@selector(orientationChanged:)
                                                name:UIDeviceOrientationDidChangeNotification
                                              object:UIDevice.currentDevice];
    
    // Auto rotation support
    [UIDevice.currentDevice beginGeneratingDeviceOrientationNotifications];
    
    _autoFullscreenWithRotatedEnabled = NO;
    
    // VR properties
    _isVRStereoMode = NO;
    
    // Interface orientation support
    _previousInterfaceOrientation = UIApplication.sharedApplication.statusBarOrientation;
    _isManualOrientaionChange = NO;
    _isFullScreenPreviousState = self.isFullscreen;
    
    // Configure fullscreen VC
    _fullscreenViewController = [OOSkinFullScreenViewController new];
    
    // Configure fullscreen state controller
    _fullscreenStateController = [[FullscreenStateController alloc] initWithParentView:self.parentView
                                                                         containerView:self.view
                                                                             videoView:self.videoView
                                                           andFullscreenViewController:self.fullscreenViewController];
  }
  return self;
}

- (void)dealloc {
  LOG(@"OOSkinViewController.dealloc")
  [self.videoView removeObserver:self forKeyPath:kViewChangeKey];
  [self.player destroy];
}

#pragma mark - Override view controller functions

- (BOOL)prefersHomeIndicatorAutoHidden {
  return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
  if (_fullscreen) {
    return _fullscreenViewController.supportedInterfaceOrientations;
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

- (void)viewWillTransitionToSize:(CGSize)size
       withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator {
  [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];

  [self.fullscreenStateController viewWillTransition:self.autoFullscreenWithRotatedEnabled];
}

#pragma mark - Private functions

- (void)setFullscreen:(BOOL)fullscreen
 isOrientationChanges:(BOOL)isOrientationChanges
           completion:(nullable void (^)(void))completion {
  if (fullscreen == _fullscreen) {
    // Notify what fullscreen did changed
    if (completion) {
      completion();
    }
    return;
  }
  
  _fullscreen = fullscreen;
  
  // Perform changes for fullscreen/inline mode
  __weak __typeof__(self) weakSelf = self;
  
  // Hide react view for start animation
  [self.reactView setHidden:YES];

  // Perfrom animation
  [self.fullscreenStateController setFullscreen:fullscreen
                          withOrientaionChanges:isOrientationChanges
                                     completion:^{
    dispatch_async(dispatch_get_main_queue(), ^{
      
      // Notify observers what screen state changed
      [weakSelf notifyFullScreenChange:fullscreen];
      
      // Notify what fullscreen did changed
      if (completion) {
        completion();
      }

      // Show react view for start animation
      [weakSelf.reactView setHidden:NO];
    });
  }];
}

- (void)notifyFullScreenChange:(BOOL)isFullscreen {
  [NSNotificationCenter.defaultCenter postNotificationName:OOSkinViewControllerFullscreenChangedNotification
                                                    object:self
                                                  userInfo:@{fullscreenKey: @(isFullscreen)}];
}

- (void)onReactReady:(NSNotification *)notification {
  [self.skinModel setIsReactReady:YES];
  [self ccStyleChanged:nil];
}

- (void)onApplicationDidBecomeActive:(NSNotification *)notification {
  MACaptionAppearanceSetDisplayType(kMACaptionAppearanceDomainUser, kMACaptionAppearanceDisplayTypeForcedOnly);
}

#pragma mark - Public functions

- (void)setFullscreen:(BOOL)fullscreen isOrientationChanges:(BOOL)isOrientationChanges {
  if (self.fullscreen == fullscreen) { return; }
  
  if (self.isVRStereoMode && !fullscreen) {
    [self toggleStereoMode];
  } else {
    [self setFullscreen:fullscreen isOrientationChanges:isOrientationChanges completion:nil];
  }
}

- (void)ccStyleChanged:(NSNotification *)notification {
  [self.skinModel ccStyleChanged:notification];
}

- (OOClosedCaptionsStyle *)closedCaptionsDeviceStyle {
  return self.skinModel.closedCaptionsDeviceStyle;
}

- (NSString *)version {
  return OO_SKIN_VERSION;
}

#pragma mark - KVO

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object
                        change:(NSDictionary *)change context:(void *)context {
  if (context == &kFrameChangeContext) {
    NSNumber *width  = @(CGRectGetWidth(self.videoView.frame));
    NSNumber *height = @(CGRectGetHeight(self.videoView.frame));
    NSDictionary *eventBody = @{widthKey:      width,
                                heightKey:     height,
                                fullscreenKey: @(self.isFullscreen)};
    [self.skinModel sendEventWithName:(NSString *)kFrameChangeContext body:eventBody];
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

#pragma mark - Stereo Mode Handle

- (void)enterStereoMode {
  // Save previous full screen state
  _isFullScreenPreviousState = _fullscreen;
  
  // Save previous interface orientation
  _previousInterfaceOrientation = UIApplication.sharedApplication.statusBarOrientation;
  
  // Create weak self object
  __weak OOSkinViewController *weakSelf = self;
  
  // Change screen mode if needed
  [self setFullscreen:YES isOrientationChanges:NO completion:^{
    // Reset full screen view controller
    OOSkinFullScreenViewController *fullScreenController = nil;
    
    if (weakSelf.fullscreenViewController) {
      fullScreenController = (OOSkinFullScreenViewController *)weakSelf.fullscreenViewController;
      fullScreenController.enableVRStereoMode = YES;
    }
    
    // Manualy change device orientation on landscape right
    _isManualOrientaionChange = YES;

    // Change device orienation to lanscape right
    if (UIDevice.currentDevice.orientation == UIInterfaceOrientationLandscapeRight) {
      weakSelf.delayForDeviceOrientationAnimation = 0;
    } else {
      weakSelf.delayForDeviceOrientationAnimation = UIApplication.sharedApplication.statusBarOrientationAnimationDuration;
    }
    
    [UIDevice.currentDevice setValue:@(UIInterfaceOrientationLandscapeRight) forKey:@"orientation"];
    [UIViewController attemptRotationToDeviceOrientation];

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(weakSelf.delayForDeviceOrientationAnimation * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      
      // Notify observers what stereo mode did changed
      [NSNotificationCenter.defaultCenter postNotificationName:OOOoyalaPlayerSwitchSceneNotification object:nil];
      
      _isManualOrientaionChange = NO;
    });
  }];
}

- (void)exitStereoMode {
  // Notify observers what stereo mode did changed
  [NSNotificationCenter.defaultCenter postNotificationName:OOOoyalaPlayerSwitchSceneNotification object:nil];
  
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
  [self setFullscreen:_isFullScreenPreviousState isOrientationChanges:NO completion:^{
    
    // Manualy change device orientation for previous value
    _isManualOrientaionChange = YES;
    
    [UIDevice.currentDevice setValue:@(weakSelf.previousInterfaceOrientation) forKey:@"orientation"];
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
    [NSNotificationCenter.defaultCenter postNotificationName:OOOoyalaPlayerSwitchSceneNotification object:nil];
  }
}

- (void)orientationChanged:(NSNotification *)notification {
  UIDeviceOrientation orientation = UIDevice.currentDevice.orientation;
  
  // Ignore FaceUp and FaceDown orienations
  if (orientation == UIDeviceOrientationFaceUp || orientation == UIDeviceOrientationFaceDown) {
    return;
  }
  
  // Change fullscreen
  BOOL isLandscapeOrientation = UIDeviceOrientationIsLandscape(orientation);
  
  if (self.isAutoFullscreenWithRotatedEnabled && !self.isVRStereoMode) {
    [self setFullscreen:isLandscapeOrientation isOrientationChanges:YES];
  }
}


#pragma mark - OOSkinViewControllerDelegate

- (CGRect)videoViewFrame {
  return self.videoView.frame;
}

- (void)toggleStereoMode {
  dispatch_async(dispatch_get_main_queue(), ^{
    _isVRStereoMode = !_isVRStereoMode;
    if (self.isVRStereoMode) {
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
    BOOL fullscreen = !self.fullscreen;
    if (fullscreen) {
      [OOAudioSession.sharedInstance prioritize];
    }
    [self setFullscreen:fullscreen isOrientationChanges:NO completion:NULL];
  }
}

- (BOOL)reactViewInteractionEnabled {
  return self.reactView.userInteractionEnabled;
}

- (void)setReactViewInteractionEnabled:(BOOL)reactViewInteractionEnabled {
  dispatch_async(dispatch_get_main_queue(), ^{
    self.reactView.userInteractionEnabled = reactViewInteractionEnabled;
  });
}

@end

