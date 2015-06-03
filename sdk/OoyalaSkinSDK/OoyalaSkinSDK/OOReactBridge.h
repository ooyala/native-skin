/**
 * @file       OOReactBridge.h
 * @class      OOReactBridge OOReactBridge.h "OOReactBridge.h"
 * @brief      OOReactBridge
 * @details    OOReactBridge.h in OoyalaSDK
 * @date       4/2/15
 * @copyright Copyright (c) 2015 Ooyala, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@class OOOoyalaPlayer;
@class OODiscoveryOptions;

@interface OOReactBridge : NSObject<RCTBridgeModule>

@property (nonatomic, weak) OOOoyalaPlayer *player;
@property (nonatomic) OODiscoveryOptions *discoveryOptions;

+ (instancetype)getInstance;

+ (void)sendDeviceEventWithName:(NSString *)eventName body:(id)body;

@end
