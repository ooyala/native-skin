//
//  CountdownViewManager.m
//  ReactNativeCountdownTimer
//
//  Created by Eric Vargas on 11/30/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "CountdownViewManager.h"

#import <UIKit/UIKit.h>

#import "CountdownView.h"
#import "UIView+React.h"

@implementation CountdownViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[CountdownView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(time, float)
RCT_EXPORT_VIEW_PROPERTY(radius, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(fillColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(fillAlpha, float)
RCT_EXPORT_VIEW_PROPERTY(strokeColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(canceled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onTimerUpdate, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onTimerCompleted, RCTBubblingEventBlock)

@end
