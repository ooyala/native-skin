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
#import "OOSharePlugin.h"

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOVideo.h>
#import <OoyalaSDK/OOModule.h>
#import <OoyalaSDK/OOEmbeddedSecureURLGenerator.h>
#import <OoyalaSDK/OODiscoveryManager.h>
#import <OoyalaSDK/OODebugMode.h>
#import <OoyalaSDK/OOOptions.h>
#import "OOConstant.h"
#import "OOVolumeManager.h"

#import "NSString+Utils.h"
#import "NSMutableDictionary+Utils.h"

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

@end

@implementation OOSkinViewController

static NSString *outputVolumeKey = @"outputVolume";
static NSString *kFrameChangeContext = @"frameChanged";
static NSString *kViewChangeKey = @"frame";
static NSString *kLocalizableStrings = @"localizableStrings";
static NSString *kLocale = @"locale";
static NSDictionary *kSkinCofig;

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
                   skinOptions:(OOSkinOptions *)skinOptions
                        parent:(UIView *)parentView
                 launchOptions:(NSDictionary *)options {
  if (self = [super init]) {
    LOG(@"Ooyala SKin Version: %@", OO_SKIN_VERSION);
    [self setPlayer:player];
    _skinOptions = skinOptions;
    _skinConfig = [self getReactViewInitialProperties];
    kSkinCofig = _skinConfig;
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

- (NSDictionary *)dictionaryFromJson:(NSString *)filename {
  NSString *filePath = [[NSBundle mainBundle] pathForResource:filename ofType:@"json"];
  NSData *data = [NSData dataWithContentsOfFile:filePath];
  if (data) {
    NSError* error = nil;
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
    if( error == nil ) {
      return dict;
    }
  }
  
  return nil;
}

- (NSDictionary*) getReactViewInitialProperties {
  NSDictionary *d = [self dictionaryFromJson:self.skinOptions.configFileName];
  ASSERT(d != nil, @"missing skin configuration json" );
  
  NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithDictionary:d];
  NSMutableDictionary *localizableStrings = [NSMutableDictionary dictionaryWithDictionary:d[kLocalizableStrings]];
  NSArray *languages = localizableStrings[@"languages"];
  for (NSString *locale in languages) {
    d = [self dictionaryFromJson:locale];
    if (d) {
      [localizableStrings setObject:d forKey:locale];
    }
  }
  
  [dict setObject:localizableStrings forKey:kLocalizableStrings];
  NSString *localeId = [OOLocaleHelper preferredLanguageId];
  [dict setObject:localeId forKey:kLocale];
  
  [dict mergeWith:self.skinOptions.overrideConfigs];
  return dict;
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
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeStateChangedNotification:) name:OOOoyalaPlayerStateChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeCurrentItemChangedNotification:) name:OOOoyalaPlayerCurrentItemChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeTimeChangedNotification:) name:OOOoyalaPlayerTimeChangedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgePlayCompletedNotification:) name:OOOoyalaPlayerPlayCompletedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdStartNotification:) name:OOOoyalaPlayerAdStartedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdPodCompleteNotification:) name:OOOoyalaPlayerAdPodCompletedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgePlayStartedNotification:) name:OOOoyalaPlayerPlayStartedNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeErrorNotification:) name:OOOoyalaPlayerErrorNotification object:self.player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bridgeAdTappedNotification:) name:OOOoyalaPlayerAdTappedNotification object:self.player];
  }
}

- (void)bridgeTimeChangedNotification:(NSNotification *)notification {
  CMTimeRange seekableRange = _player.seekableTimeRange;
  Float64 duration;
  Float64 adjustedPlayhead;
  if (CMTIMERANGE_IS_INVALID(seekableRange)) {
    duration = _player.duration;
    adjustedPlayhead = _player.playheadTime;
  } else {
    duration = CMTimeGetSeconds(seekableRange.duration);
    adjustedPlayhead = _player.playheadTime - CMTimeGetSeconds(seekableRange.start);
  }
  
  NSNumber *playheadNumber = [NSNumber numberWithFloat:adjustedPlayhead];
  NSNumber *durationNumber = [NSNumber numberWithFloat:duration];
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
  NSString *hostedAtUrl = _player.currentItem.hostedAtURL ? _player.currentItem.hostedAtURL : @"";
  NSNumber *durationNumber = [NSNumber numberWithFloat:_player.currentItem.duration];
  NSNumber *frameWidth = [NSNumber numberWithFloat:self.view.frame.size.width];
  NSNumber *frameHeight = [NSNumber numberWithFloat:self.view.frame.size.height];
  NSNumber *live = [NSNumber numberWithBool:_player.currentItem.live];
  NSArray *closedCaptionsLanguages = _player.availableClosedCaptionsLanguages;
  
  NSDictionary *eventBody =
  @{@"title":title,
    @"description":itemDescription,
    @"promoUrl":promoUrl,
    @"hostedAtUrl": hostedAtUrl,
    @"duration":durationNumber,
    @"live":live,
    @"languages":closedCaptionsLanguages,
    @"width":frameWidth,
    @"height":frameHeight};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
  if (_player.currentItem.embedCode && self.skinOptions.discoveryOptions) {
    [self loadDiscovery:_player.currentItem.embedCode];
  }
}

- (void) bridgeStateChangedNotification:(NSNotification *)notification {
  NSString *stateString = [OOOoyalaPlayer playerStateToString:_player.state];
  NSDictionary *eventBody = @{@"state":stateString};

  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

- (void) bridgeErrorNotification:(NSNotification *)notification {
  OOOoyalaError *error = _player.error;
  int errorCode = error ? error.code : -1;
  NSNumber *code = [NSNumber numberWithInt:errorCode];
  NSString *detail = _player.error.description ? _player.error.description : @"";
  NSDictionary *eventBody = @{@"code":code,@"description":detail};
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
  //TODO: read cutomized font and font size
  static NSString *adFontFamily = @"AvenirNext-DemiBold";
  static NSUInteger adFontSize = 16;
  
  NSDictionary *adInfo = notification.userInfo;
  
  NSInteger count = [adInfo[@"count"] integerValue];
  NSInteger unplayed = [adInfo[@"unplayed"] integerValue];
  NSString *countString = [NSString stringWithFormat:@"(%ld/%ld)", (count - unplayed), (long)count];
  NSString *title = adInfo[@"title"];
  NSString *adTitle = [NSString stringWithFormat:@"%@ ", title];
  NSString *titlePrefix = [OOLocaleHelper localizedString:self.skinConfig[kLocalizableStrings] locale:self.skinConfig[kLocale] forKey:@"Ad Playing"];
  if (title.length > 0) {
    titlePrefix = [titlePrefix stringByAppendingString:@":"];
  }
  NSString *durationString = @"00:00";
  NSString *learnMoreString = [OOLocaleHelper localizedString:self.skinConfig[kLocalizableStrings] locale:self.skinConfig[kLocale] forKey:@"Learn More"];
  
  CGSize titleSize = [adTitle textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize titlePrefixSize = [titlePrefix textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize countSize = [countString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize durationSize = [durationString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  CGSize learnMoreSize = [learnMoreString textSizeWithFontFamily:adFontFamily fontSize:adFontSize];
  NSDictionary *measures = @{@"learnmore":[NSNumber numberWithFloat:learnMoreSize.width],
                             @"duration":[NSNumber numberWithFloat:durationSize.width],
                             @"count":[NSNumber numberWithFloat:countSize.width],
                             @"title":[NSNumber numberWithFloat:titleSize.width],
                             @"prefix":[NSNumber numberWithFloat:titlePrefixSize.width]};
  
  NSMutableDictionary *eventBody = [NSMutableDictionary dictionaryWithDictionary:adInfo];
  [eventBody setObject:measures forKey:@"measures"];
  [eventBody setObject:adTitle forKey:@"title"];
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
  if (![adInfo[@"requireAdBar"] boolValue]) {
    _reactView.userInteractionEnabled = NO;
  }
}

- (void) bridgeAdTappedNotification:(NSNotification *)notification {
  // Note: This is for IMA ad playback only.
  // When IMA ad plays, IMA consumes clicks for learn more, skip, etc and notify ooyala if the click is not consumed.
  // toggle play/pause as if the alice ui is clicked.
  if (!_reactView.userInteractionEnabled) {
    if (_player.state == OOOoyalaPlayerStatePlaying) {
      [_player pause];
    } else {
      [_player play];
    }
  };
}

- (void) bridgeAdPodCompleteNotification:(NSNotification *)notification {
  [OOReactBridge sendDeviceEventWithName:notification.name body:nil];
  _reactView.userInteractionEnabled = YES;
}

- (void) bridgePlayStartedNotification:(NSNotification *)notification {
  [OOReactBridge sendDeviceEventWithName:notification.name body:nil];
}

#pragma mark Discovery UI

- (void)loadDiscovery:(NSString *)embedCode {
  [OODiscoveryManager getResults:self.skinOptions.discoveryOptions embedCode:embedCode pcode:_player.pcode parameters:nil callback:^(NSArray *results, OOOoyalaError *error) {
    if (error) {
      LOG(@"discovery request failed, error is %@", error.description);
    } else {
      [self handleDiscoveryResults:results embedCode:embedCode];
    }
  }];
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
  
  [self.view removeFromSuperview];
  _isFullscreen = !_isFullscreen;
  if (_isFullscreen) {
    if(self.parentViewController){
      _parentViewController = self.parentViewController;
      [self removeFromParentViewController];
    }
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    
    if (CGRectEqualToRect(_movieFullScreenView.frame, CGRectZero)) {
      [_movieFullScreenView setFrame:window.bounds];
    }
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
    
    [_parentViewController addChildViewController:self];
    _parentViewController = nil;
    
    [self.view setFrame:_parentView.bounds];
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

- (void)queryState {
  if (_player.state == OOOoyalaPlayerStateError) {
    NSNotification *notification = [NSNotification notificationWithName:OOOoyalaPlayerErrorNotification object:nil];
    [self bridgeErrorNotification:notification];
  } else {
    NSNotification *notification = [NSNotification notificationWithName:OOOoyalaPlayerStateChangedNotification object:nil];
    [self bridgeStateChangedNotification:notification];
    
    // send current volume level the at load
    [OOVolumeManager sendVolumeChangeEvent:[OOVolumeManager getCurrentVolume]];
  }
}

+ (NSDictionary *)getTextForSocialType: (NSString *)socialType {
  NSDictionary *dictSocial;
  
  NSString *social_unavailable;
  NSString *social_success;
  NSString *post_title = [OOLocaleHelper localizedString:kSkinCofig[kLocalizableStrings] locale:kSkinCofig[kLocale] forKey:@"Post Title"];
  NSString *account_configure =[OOLocaleHelper localizedString:kSkinCofig[kLocalizableStrings] locale:kSkinCofig[kLocale] forKey:@"Account Configure"];
  
  if ([socialType isEqual:@"Facebook"]) {
    social_unavailable = [OOLocaleHelper localizedString:kSkinCofig[kLocalizableStrings] locale:kSkinCofig[kLocale] forKey:@"Facebook Unavailable"];
    social_success = [OOLocaleHelper localizedString:kSkinCofig[kLocalizableStrings] locale:kSkinCofig[kLocale] forKey:@"Facebook Success"];
    
    dictSocial = @{@"Facebook Unavailable": social_unavailable,
                   @"Facebook Success": social_success,
                   @"Post Title": post_title,
                   @"Account Configure": account_configure};
    
  } else if ([socialType isEqual: @"Twitter"]) {
    social_unavailable = [OOLocaleHelper localizedString:kSkinCofig[kLocalizableStrings] locale:kSkinCofig[kLocale] forKey:@"Twitter Unavailable"];
    social_success = [OOLocaleHelper localizedString:kSkinCofig[kLocalizableStrings] locale:kSkinCofig[kLocale] forKey:@"Twitter Success"];
    
    dictSocial = @{@"Twitter Unavailable": social_unavailable,
                   @"Twitter Success": social_success,
                   @"Post Title": post_title,
                   @"Account Configure": account_configure};
  }
  
  return dictSocial;
}

@end
