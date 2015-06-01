//
//  OOClosedCaptionsViewManager.m
//  OoyalaSkinSDK
//
//  Created by Jon Slenk on 5/26/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOClosedCaptionsViewManager.h"
#import <OoyalaSDK/OOClosedCaptionsView.h>
#import <OoyalaSDK/OOClosedCaptionsStyle.h>
#import <OoyalaSDK/OOCaption.h>

@implementation OOClosedCaptionsViewManager
RCT_EXPORT_MODULE()
- (UIView *)view
{
  OOClosedCaptionsView *v = [OOClosedCaptionsView new];
  v.style = [OOClosedCaptionsStyle new];
  return v;
}

RCT_CUSTOM_VIEW_PROPERTY(captionJSON, NSString, OOClosedCaptionsView) {
  if( json ) { // apparently, empirically, an NSCFDictionary.
    NSString *text = [json objectForKey:@"text"];
    // assumes that Float64 really == double, and that the json will use "." not e.g. "," for decimals.
    Float64 begin = [[json objectForKey:@"begin"] doubleValue];
    Float64 end = [[json objectForKey:@"end"] doubleValue];
    OOCaption *c = [[OOCaption alloc] initWithBegin:begin end:end text:text];
    view.caption = c;
  }
}

@end
