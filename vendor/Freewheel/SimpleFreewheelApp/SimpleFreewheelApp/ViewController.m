//
//  ViewController.m
//  SimpleFreewheelApp
//
//  Created by Zhihui Chen on 10/8/14.
//  Copyright (c) 2014 ooyala. All rights reserved.
//

#import "ViewController.h"
#import "AdManager/FWSDK.h"

@interface ViewController ()

//Freewheel ad request parameters
@property(nonatomic) int fwNetworkId;
@property(nonatomic) NSString *fwAdServer;
@property(nonatomic) NSString *fwProfile;
@property(nonatomic) NSString *fwSiteSectionId;
@property(nonatomic) NSString *fwVideoAssetId;
@property(nonatomic) NSString *fwFRMSegment;
@property(nonatomic) NSMutableDictionary *fwParameters; //the parameter settings for Freewheel ad request
@property(nonatomic) id<FWSlot> currentAd; //the current ad slot being played
@property(nonatomic) id<FWContext> fwContext; //the Freewheel context
@property(nonatomic) id<FWAdManager> adManager;
@property(nonatomic) NSMutableArray *adSlots;

@end

@implementation ViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  [self setupFreewheelManager];
  [self submitAdRequest];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

- (void)setupFreewheelManager {
  self.fwNetworkId = 380912;

  //Set other Freewheel parameters
  self.fwAdServer = @"http://g1.v.fwmrm.net/";
  self.fwProfile = @"90750:ooyala_ios";
  self.fwSiteSectionId = @"ooyala_test_site_section";
  self.fwVideoAssetId = @"Q5MXg2bzq0UAXXMjLIFWio_6U0Jcfk6v";

  self.adManager = newAdManager();
  [self.adManager setNetworkId:self.fwNetworkId];
  [self.adManager setServerUrl:self.fwAdServer];
}

- (void)submitAdRequest {

  //Set up profile, site section, and video asset info
  _fwContext = [_adManager newContext];
  [_fwContext setPlayerProfile:_fwProfile defaultTemporalSlotProfile:nil defaultVideoPlayerSlotProfile:nil defaultSiteSectionSlotProfile:nil];
  [_fwContext setSiteSectionId:_fwSiteSectionId idType:FW_ID_TYPE_CUSTOM pageViewRandom:0 networkId:0 fallbackId:0];
  [_fwContext setVideoAssetId:_fwVideoAssetId idType:FW_ID_TYPE_CUSTOM duration:30 durationType:FW_VIDEO_ASSET_DURATION_TYPE_EXACT location:nil autoPlayType:true videoPlayRandom:0 networkId:0 fallbackId:0];

  //Set parameters to use our own media controls and to open the browser for clickThrough action
  [_fwContext setParameter:FW_PARAMETER_CLICK_DETECTION withValue:@"false" forLevel:FW_PARAMETER_LEVEL_OVERRIDE];
  [_fwContext setParameter:FW_PARAMETER_USE_CONTROL_PANEL withValue:@"true" forLevel:FW_PARAMETER_LEVEL_OVERRIDE];
  [_fwContext setParameter:FW_PARAMETER_OPEN_IN_APP withValue:@"false" forLevel:FW_PARAMETER_LEVEL_OVERRIDE];

  //parse FRMSegment to put into the context
  if (_fwFRMSegment && ![_fwFRMSegment isEqual: @""])
  {
    NSArray *keyValues = [_fwFRMSegment componentsSeparatedByString:@";"];
    for (NSString *keyValue in keyValues)
    {
      NSArray *splitKeyValue = [keyValue componentsSeparatedByString:@"="];
      if ([splitKeyValue count] > 1)
      {
        [_fwContext addValue:splitKeyValue[1] forKey:splitKeyValue[0]];
      }
    }
  }

  [_fwContext setVideoDisplayBase:[self view]];
  //register callback handler for ad request complete and ad error events
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onAdRequestCompleted:) name:FW_NOTIFICATION_REQUEST_COMPLETE object:_fwContext];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onAdEventError:) name:FW_NOTIFICATION_AD_ERROR object:_fwContext];

  //Add event listeners
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onRendererEvent:) name:FW_NOTIFICATION_RENDERER_EVENT object:_fwContext];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onAdSlotStarted:) name:FW_NOTIFICATION_AD_IMPRESSION object:_fwContext];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onAdSlotEnded:) name:FW_NOTIFICATION_SLOT_ENDED object:_fwContext];


  //submit ad request to the Freewheel ad server
  [_fwContext submitRequestWithTimeout:5];
}

- (void)onAdRequestCompleted:(NSNotification *)notification {
  NSLog(@"onAdRequestCompleted %@", [[notification userInfo] description]);

  if ([[notification userInfo] objectForKey:FW_INFO_KEY_ERROR]) {
    return;
  }

  self.adSlots = [NSMutableArray array];
  [self.adSlots addObjectsFromArray:[_fwContext getSlotsByTimePositionClass:FW_TIME_POSITION_CLASS_PREROLL]];
  [self.adSlots addObjectsFromArray:[_fwContext getSlotsByTimePositionClass:FW_TIME_POSITION_CLASS_MIDROLL]];
  [self.adSlots addObjectsFromArray:[_fwContext getSlotsByTimePositionClass:FW_TIME_POSITION_CLASS_POSTROLL]];

  if (self.adSlots.count) {
    id<FWSlot> firstAd = [self.adSlots objectAtIndex:0];
    [firstAd play];
  }
}

- (void)onAdEventError:(NSNotification *)notification {
  NSLog(@"%@", @"FW Ad Manager: There was an error in the Freewheel Ad Manager!");
}

- (void)onRendererEvent:(NSNotification *)notification {

}

- (void)onAdSlotStarted:(NSNotification *)notification {

}

- (void)onAdSlotEnded:(NSNotification *)notification {
  
}

@end
