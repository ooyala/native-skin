//
//  OOQueuedEvent.m
//  OoyalaSkinSDK
//

#import "OOQueuedEvent.h"

@implementation OOQueuedEvent

- (instancetype)initWithWithName:(NSString *)eventName body:(id)body
{
  self = [super init];
  if (self) {
    _eventName = eventName;
    _body = body;
  }
  return self;
}

@end
