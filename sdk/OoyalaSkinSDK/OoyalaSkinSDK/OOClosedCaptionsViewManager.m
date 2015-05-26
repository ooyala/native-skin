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
  OOClosedCaptionsStyle *s = [OOClosedCaptionsStyle new];
  v.style = s;
  OOCaption *c = [[OOCaption alloc] initWithBegin:0 end:MAXFLOAT text:@"TESTING"];
  v.caption = c;
  v.layer.borderWidth = 3;
  v.layer.borderColor = [UIColor greenColor].CGColor;
  return v;
}
@end
