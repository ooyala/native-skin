//
//  OOReactSkinBridge.m
//  OoyalaSkinSDK
//
//  Created by Maksim Kupetskii on 8/14/18.
//  Copyright © 2018 ooyala. All rights reserved.
//

#import "OOReactSkinBridge.h"
#import "OOReactSkinBridgeModule.h"
#import <React/RCTBridge+Private.h>

@interface OOReactSkinBridge ()

@property (nonatomic, weak, readonly) id<OOReactSkinBridgeDelegate> delegate;

@end


@implementation OOReactSkinBridge

@dynamic delegate;

- (instancetype)initWithDelegate:(id<OOReactSkinBridgeDelegate>)delegate
                   launchOptions:(NSDictionary *)launchOptions {
  return [super initWithDelegate:delegate launchOptions:launchOptions];
}

- (void)invalidate {
  [super invalidate];
  [NSNotificationCenter.defaultCenter removeObserver:self];
}

- (void)setUp {
  [super setUp];
  [NSNotificationCenter.defaultCenter addObserver:self
                                         selector:@selector(didInitializeModuleNotification:)
                                             name:RCTDidInitializeModuleNotification
                                           object:self.batchedBridge];
}

- (void)didInitializeModuleNotification:(NSNotification *)notification {
  id module = notification.userInfo[@"module"];

  if ([self.delegate respondsToSelector:@selector(bridge:didLoadModule:)]) {
    if (module && [module conformsToProtocol:@protocol(OOReactSkinBridgeModule)]) {
      [self.delegate bridge:self didLoadModule:module];
    }
  }
}

@end


@implementation RCTBridge (OOReactSkinEventsEmitterable)

- (OOReactSkinEventsEmitter *)skinEventsEmitter {
  return [self moduleForName:[OOReactSkinEventsEmitter moduleName]];
}

@end
