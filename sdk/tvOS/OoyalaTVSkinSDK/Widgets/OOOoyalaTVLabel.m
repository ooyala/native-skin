//
//  OOOoyalaTVLabel.m
//  OoyalaTVSkinSDK
//
//  Created by Yi Gu on 7/20/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOOoyalaTVLabel.h"

@implementation OOOoyalaTVLabel

- (id)initWithFrame:(CGRect)frame time:(CGFloat)time {
  self = [super initWithFrame:frame];
  
  if (self.OOTextColor) {
    self.textColor = self.OOTextColor;
  } else {
    self.textColor = [UIColor whiteColor];
  }
  
  if (self.OOTextAlighment) {
    self.textAlignment = self.OOTextAlighment;
  } else {
    self.textAlignment = NSTextAlignmentCenter;
  }
  
  if (self.OOFontSize) {
    self.font = [self.font fontWithSize:self.OOFontSize];
  } else {
    self.font = [self.font fontWithSize:20.0];
  }
  
  if (!self.OODateformatter) {
    self.OODateformatter = [[NSDateFormatter alloc] init];
    [self.OODateformatter setDateFormat:time < 3600 ? @"mm:ss" : @"HH:mm:ss"];
  }
  
  self.text = [NSString stringWithFormat:@"%@",
                [self.OODateformatter stringFromDate:[NSDate dateWithTimeIntervalSince1970:time]]];

  
  return self;
}

@end
