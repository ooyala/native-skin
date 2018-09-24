//
//  OOQueuedEvent.m
//  OoyalaSkinSDK
//

#import "OOQueuedEvent.h"

@implementation OOQueuedEvent

- (instancetype)initWithWithName:(NSString *)eventName body:(id)body {
  if (self = [super init]) {
    _eventName = eventName;
    _body = body;
  }
  return self;
}

@end
