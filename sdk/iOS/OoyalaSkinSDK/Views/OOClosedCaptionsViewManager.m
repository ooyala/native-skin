//
//  OOClosedCaptionsViewManager.m
//  OoyalaSkinSDK
//
//  Created by Jon Slenk on 5/26/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOClosedCaptionsViewManager.h"
#import "OOSkinAutoUpdatingClosedCaptionsStyle.h"
#import <OoyalaSDK/OOClosedCaptionsView.h>
#import <OoyalaSDK/OOClosedCaptionsStyle.h>
#import <OoyalaSDK/OOCaption.h>

@implementation OOClosedCaptionsViewManager

static NSString *textKey  = @"text";
static NSString *beginKey = @"begin";
static NSString *endKey   = @"end";

RCT_EXPORT_MODULE();

- (UIView *)view {
  OOClosedCaptionsView *v  = [OOClosedCaptionsView new];
  OOClosedCaptionsStyle *s = [[OOSkinAutoUpdatingClosedCaptionsStyle alloc] initWithClosedCaptionsView:v];
  v.style = s;
  return v;
}

RCT_CUSTOM_VIEW_PROPERTY(captionJSON, NSString, OOClosedCaptionsView) {
  if (json) { // apparently, empirically, an NSCFDictionary.
    NSString *text = json[textKey];
    // assumes that Float64 really == double, and that the json will use "." not e.g. "," for decimals.
    Float64 begin  = [json[beginKey] doubleValue];
    Float64 end    = [json[endKey] doubleValue];
    OOCaption *c   = [[OOCaption alloc] initWithBegin:begin end:end text:text];
    view.caption   = c;
  }
}

@end
