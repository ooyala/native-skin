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
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOVideo.h>
#import <OoyalaSDK/OOModule.h>
#import <OoyalaSDK/OOEmbeddedSecureURLGenerator.h>
#import <OoyalaSDK/OODiscoveryManager.h>
#import <OoyalaSDK/OODebugMode.h>
#import <OoyalaSDK/OOOptions.h>

#define DISCOVERY_RESULT_NOTIFICATION @"discoveryResultsReceived"
#define FULLSCREEN_ANIMATION_DURATION 0.5

@interface OOSkinViewController () {
  RCTRootView *_reactView;
  UIViewController *_parentViewController;
  UIView *_parentView;
  UIView *_movieFullScreenView;
}

@end

@implementation OOSkinViewController

static NSString *kFrameChangeContext = @"frameChanged";
static NSString *kViewChangeKey = @"frame";
static NSString *kLocalizableStrings = @"localizableStrings";
static NSString *kLocale = @"locale";

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
                        parent:(UIView *)parentView
              discoveryOptions:(OODiscoveryOptions *)discoveryOptions
                 launchOptions:(NSDictionary *)options
                jsCodeLocation:(NSURL *)jsCodeLocation {
  if (self = [super init]) {
    [self setPlayer:player];
    _reactView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                             moduleName:@"OoyalaSkin"
                                          launchOptions:nil];
    _skinConfig = [self getReactViewInitialProperties];
    _reactView.initialProperties = _skinConfig;
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
    
    [OOReactBridge registerController:self];
    [_parentView addSubview:self.view];
    _isFullscreen = NO;
    self.upNextManager = [[OOUpNextManager alloc] initWithPlayer:self.player config:[self.skinConfig objectForKey:@"upNextScreen"]];
    _discoveryOptions = discoveryOptions;
    
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

-(NSDictionary*) getReactViewInitialProperties {
  NSDictionary *d = [self dictionaryFromJson:@"skin"];
  ASSERT(d, @"missing skin configuration json" );

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
  NSNumber *live = [NSNumber numberWithBool:_player.currentItem.live];
  NSArray *closedCaptionsLanguages = _player.availableClosedCaptionsLanguages;
  
  NSDictionary *eventBody =
  @{@"title":title,
    @"description":itemDescription,
    @"promoUrl":promoUrl,
    @"duration":durationNumber,
    @"live":live,
    @"languages":closedCaptionsLanguages,
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
  
  CGSize titleSize = [self textSize:adTitle withFontFamily:adFontFamily size:adFontSize];
  CGSize titlePrefixSize = [self textSize:titlePrefix withFontFamily:adFontFamily size:adFontSize];
  CGSize countSize = [self textSize:countString withFontFamily:adFontFamily size:adFontSize];
  CGSize durationSize = [self textSize:durationString withFontFamily:adFontFamily size:adFontSize];
  CGSize learnMoreSize = [self textSize:learnMoreString withFontFamily:adFontFamily size:adFontSize];
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

- (void) bridgeAdPodCompleteNotification:(NSNotification *)notification {
  [OOReactBridge sendDeviceEventWithName:notification.name body:nil];
  _reactView.userInteractionEnabled = YES;
}

- (void) bridgePlayStartedNotification:(NSNotification *)notification {
  [OOReactBridge sendDeviceEventWithName:notification.name body:nil];
}

#pragma mark Discovery UI

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
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

- (void)toggleFullscreen {
  BOOL wasPlaying = self.player.isPlaying;
  if( wasPlaying ) {
    [_player pause];
  }

  [self.view removeFromSuperview];
  _isFullscreen = !_isFullscreen;
  if (_isFullscreen) {
    if (self.parentViewController) {
      _parentViewController = self.parentViewController;
      [self removeFromParentViewController];
    }
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    if (CGRectEqualToRect(_movieFullScreenView.frame, CGRectZero)) {
      [_movieFullScreenView setFrame:window.bounds];
    }
    [window addSubview:_movieFullScreenView];
    [UIView animateWithDuration:FULLSCREEN_ANIMATION_DURATION delay:0.0 options:UIViewAnimationOptionCurveLinear animations:^{
      _movieFullScreenView.alpha = 1.f;
    } completion:^(BOOL finished) {
      self.view.alpha = 1.f;
      [_movieFullScreenView addSubview:self.view];
      [self.view setFrame:window.bounds];
    }];
    
  } else {
    [_parentView addSubview:self.view];
    [self.view setFrame:_parentView.bounds];
    if (_parentViewController) {
      [_parentViewController addChildViewController:self];
      _parentViewController = nil;
    }
    
    [UIView animateWithDuration:FULLSCREEN_ANIMATION_DURATION delay:0.0 options:UIViewAnimationOptionCurveLinear animations:^{
      _movieFullScreenView.alpha = 0.f;
    } completion:^(BOOL finished) {
      self.view.alpha = 1.f;
      [_movieFullScreenView removeFromSuperview];
      [self.view setFrame:_parentView.bounds];
    }];
  }
  
  if( wasPlaying ) {
    [self.player play];
  }
}

- (void)dealloc {
  [self.view removeObserver:self forKeyPath:kViewChangeKey];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  [OOReactBridge deregisterController:self];
}

#pragma mark utils
- (CGSize)textSize:(NSString *)text withFontFamily:(NSString *)fontFamily size:(NSUInteger)fontSize {
  // given an array of strings and other settings, compute the width of the strings to assist correct layout.
  NSArray *fontArray = [UIFont fontNamesForFamilyName:fontFamily];
  NSString *fontName = fontArray.count > 0 ? fontArray[0] : fontFamily;
  UIFont *font = [UIFont fontWithName:fontName size:fontSize];
  CGSize textSize = [text sizeWithAttributes:@{NSFontAttributeName:font}];
  return textSize;
}

@end
