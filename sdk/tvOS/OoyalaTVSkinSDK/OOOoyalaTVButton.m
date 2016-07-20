//
//  OOOoyalaTVButton.m
//  OoyalaTVSkinSDK
//
//  Created by Yi Gu on 7/19/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOOoyalaTVButton.h"

@implementation OOOoyalaTVButton

- (id)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  
  return self;
}

- (void)setupPlayPause: (BOOL)isPlay {
  NSString *fontString = isPlay ? @"g": @"v";
  UIFont *ooFont;
  
  if (self.OOFontSize) {
    ooFont = [UIFont fontWithName:@"ooyala-slick-type" size:self.OOFontSize];
  } else {
    ooFont = [UIFont fontWithName:@"ooyala-slick-type" size:40.0];
  }
  
  NSDictionary *attrsDictionary = @{NSForegroundColorAttributeName :[UIColor whiteColor]};
  NSMutableAttributedString *buttonString = [[NSMutableAttributedString alloc] initWithString:fontString attributes:attrsDictionary];
  if (ooFont) {
    [buttonString addAttribute:NSFontAttributeName value:ooFont range:NSMakeRange(0, 1)];
  }
  
  self.titleLabel.textAlignment = NSTextAlignmentCenter;
  [self setAttributedTitle:buttonString forState:UIControlStateNormal];
}

@end
