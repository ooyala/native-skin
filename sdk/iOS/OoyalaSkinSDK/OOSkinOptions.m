//
//  OOSkinOptions.m
//  OoyalaSkinSDK
//
//  Created by Zhihui Chen on 8/12/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOSkinOptions.h"
#import <OoyalaSDK/OODiscoveryManager.h>

@implementation OOSkinOptions

- (instancetype)initWithDiscoveryOptions:(OODiscoveryOptions *)discoveryOptions
                          jsCodeLocation:(NSURL *)jsCodeLocation
                          configFileName:(NSString *)configFileName
                         overrideConfigs:(NSDictionary *)overrideConfigs {
  if (self = [super init]) {
    _discoveryOptions = discoveryOptions;
    _jsCodeLocation = jsCodeLocation;
    _configFileName = configFileName;
    _overrideConfigs = overrideConfigs;
  }
  return self;
}

@end
