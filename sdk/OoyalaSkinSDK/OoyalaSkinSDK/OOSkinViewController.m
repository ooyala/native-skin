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

@interface OOSkinViewController () {
  RCTRootView *_reactView;
}

@property (nonatomic, retain) OOOoyalaPlayer *player;

@end

@implementation OOSkinViewController

static NSString *kFrameChangeContext = @"frameChanged";
static NSString *kViewChangeKey = @"frame";

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player rect:(CGRect)rect launchOptions:(NSDictionary *)options{
  if (self = [super init]) {
    [self setPlayer:player];
    NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/ooyalaSkin.bundle"];
    _reactView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                             moduleName:@"OoyalaSkin"
                                          launchOptions:nil];
    [self.view setFrame:rect];
    [_player.view setFrame:rect];
    [_reactView setFrame:rect];
    [_reactView setOpaque:NO];
    [_reactView setBackgroundColor:[UIColor clearColor]];
    _reactView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    [self.view addSubview:_player.view];
    [self.view addSubview:_reactView];
    [self.view addObserver:self forKeyPath:kViewChangeKey options:NSKeyValueObservingOptionNew context:&kFrameChangeContext];
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
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onEvent:) name:OOOoyalaPlayerPlayCompletedNotification object:_player];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onEvent:) name:OODiscoveryResultsReceivedNotification object:_player];
  }
}

- (void)onEvent:(NSNotification *)notification {
  NSString *notificationName = notification.name;
  if ([notificationName isEqualToString:OOOoyalaPlayerTimeChangedNotification]) {
    [self bridgeTimeChangedNotification:notification];
  } else if ([notificationName isEqualToString:OODiscoveryResultsReceivedNotification]) {
    [self bridgeDiscoveryChangeNotification:notification];
  } else if ([notificationName isEqualToString:OOOoyalaPlayerCurrentItemChangedNotification]) {
    [self bridgeCurrentItemChangedNotification:notification];
  } else if ([notificationName isEqualToString:OOOoyalaPlayerStateChangedNotification]) {
    [self bridgeStateChangedNotification:notification];
  } else if([notificationName isEqualToString:OOOoyalaPlayerPlayCompletedNotification]) {
    [self bridgePlayCompletedNotification:notification];
  }
}

- (void)bridgeDiscoveryChangeNotification:(NSNotification *)notification {
  NSArray *results = [notification.userInfo objectForKey:@"results"];
  NSMutableArray *discoveryArray = [NSMutableArray new];
  for (NSDictionary *dict in results) {
    NSString *name = [dict objectForKey:@"name" ];
    if (name == nil) {

    }
    NSString *embedCode = [dict objectForKey:@"embed_code"];
    NSString *imageUrl = [dict objectForKey:@"preview_image_url"];
    NSNumber *duration = [NSNumber numberWithDouble:[[dict objectForKey:@"duration"] doubleValue] / 1000];
    NSDictionary *discoveryItem = @{@"name":name, @"embedCode":embedCode, @"imageUrl":imageUrl, @"duration":duration};
    [discoveryArray addObject:discoveryItem];
  }
  NSDictionary *eventBody = @{@"results":discoveryArray};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
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
  NSDictionary *eventBody =
  @{@"title":title,
    @"description":itemDescription,
    @"promoUrl":promoUrl,
    @"duration":durationNumber,
    @"width":frameWidth};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

-(void) bridgeStateChangedNotification:(NSNotification *)notification {
  NSString *stateString = [OOOoyalaPlayer playerStateToString:_player.state];
  NSDictionary *eventBody = @{@"state":stateString};
  [OOReactBridge sendDeviceEventWithName:notification.name body:eventBody];
}

-(void) bridgePlayCompletedNotification:(NSNotification *)notification {
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

- (void)loadStartScreenConfigureFile {
  // TODO: implement this.
}

// KVO
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object
                        change:(NSDictionary *)change context:(void *)context
{
  if (context == &kFrameChangeContext) {
    NSNumber *width = [NSNumber numberWithFloat:self.view.frame.size.width];
    NSNumber *height = [NSNumber numberWithFloat:self.view.frame.size.height];

    NSDictionary *eventBody = @{@"width":width,@"height":height};
    [OOReactBridge sendDeviceEventWithName:(NSString *)kFrameChangeContext body:eventBody];
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

- (void)dealloc {
  [self.view removeObserver:self forKeyPath:kViewChangeKey];
}

@end
