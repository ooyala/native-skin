//
//  OOOoyalaTVLabel.m
//  OoyalaTVSkinSDK
//
//  Created on 7/20/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOOoyalaTVLabel.h"

@implementation OOOoyalaTVLabel

- (instancetype)initWithFrame:(CGRect)frame time:(CGFloat)time {
  if (self = [super initWithFrame:frame]) {
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

    self.font = [self.font fontWithSize:self.OOFontSize != 0.0 ? self.OOFontSize : 20.0];

    if (!self.OODateformatter) {
      _OODateformatter = [NSDateFormatter new];
      _OODateformatter.dateFormat = time < 3600 ? @"mm:ss" : @"HH:mm:ss";
    }

    self.text = [NSString stringWithFormat:@"%@",
                 [self.OODateformatter stringFromDate:[NSDate dateWithTimeIntervalSince1970:time]]];
  }
  return self;
}

@end
