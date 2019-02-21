/**
 * @file       OOReactSkinEventsEmitter.m
 * @class      OOReactSkinEventsEmitter OOReactSkinEventsEmitter.m "OOReactSkinEventsEmitter.m"
 * @brief      OOReactSkinEventsEmitter
 * @details    OOReactSkinEventsEmitter.m in OoyalaSDK
 * @date       8/13/18
 * @copyright Copyright (c) 2018 Ooyala, Inc. All rights reserved.
 */

#import "OOReactSkinEventsEmitter.h"
#import "OOConstant.h"
#import "OOQueuedEvent.h"

#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOClosedCaptions.h>
#import <OoyalaSDK/OODebugMode.h>

@interface OOReactSkinEventsEmitter ()

@property (atomic) NSMutableArray *queuedEvents; //QueuedEvent *

@end

@implementation OOReactSkinEventsEmitter

RCT_EXPORT_MODULE(OOReactSkinEventsEmitter);

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (instancetype)init {
  if (self = [super init]) {
    _isReactReady = NO;
    _queuedEvents = [NSMutableArray new];
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"timeChanged",
           @"seekStarted",
           @"seekCompleted",
           @"ccStylingChanged",
           @"currentItemChanged",
           @"frameChanged",
           @"fullscreenToggled",
           @"volumeChanged",
           @"playCompleted",
           @"stateChanged",
           @"desiredStateChanged",
           @"discoveryResultsReceived",
           @"onClosedCaptionUpdate",
           @"adStarted",
           @"adSwitched",
           @"adPodStarted",
           @"adPodCompleted",
           @"adOverlay",
           @"adError",
           @"setNextVideo",
           @"upNextDismissed",
           @"playStarted",
           @"error",
           @"embedCodeSet",
           @"controllerKeyPressEvent",
           @"vrContentEvent",
           @"multiAudioEnabled",
           @"audioTrackChanged",
           @"playbackSpeedEnabled",
           @"playbackSpeedRateChanged"];
}

- (void)sendDeviceEventWithName:(NSString *)eventName body:(id)body {
  if (self.isReactReady) {
    if (![eventName isEqualToString:OOOoyalaPlayerTimeChangedNotification] &&
        ![eventName isEqualToString:OO_CLOSED_CAPTIONS_UPDATE_EVENT]) {
      LOG(@"sendDeviceEventWithName: %@", eventName);
    }
    [self sendEventWithName:eventName body:body];
  } else {
    [self queueEventWithName:eventName body:body];
  }
}

- (void)setIsReactReady:(BOOL)isReactReady {
  if (_isReactReady) {
    LOG(@"received ReactReady notification after ready");
    return;
  }
  _isReactReady = isReactReady;
  // PurgeEvents must happen after isReactReady, however, I'm not positive this is truly thread-safe.
  // If a notification is queued during PurgeEvents, there could be an execption
  [self purgeEvents];
}

- (void)queueEventWithName:(NSString *)eventName body:(id)body {
  LOG(@"Queued Event: %@", eventName);
  OOQueuedEvent *event = [[OOQueuedEvent alloc] initWithWithName:eventName body:body];
  [self.queuedEvents addObject:event];
}

- (void)purgeEvents {
  LOG(@"Purging Events to skin");
  for (OOQueuedEvent *event in self.queuedEvents) {
    [self sendDeviceEventWithName:event.eventName body:event.body];
  }
  [self.queuedEvents removeAllObjects];
}

@end
