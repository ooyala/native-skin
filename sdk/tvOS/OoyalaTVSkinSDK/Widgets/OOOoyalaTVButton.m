//
//  OOOoyalaTVButton.m
//  OoyalaTVSkinSDK
//
//  Created by Yi Gu on 7/19/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOOoyalaTVButton.h"

@interface OOOoyalaTVButton ()

@property (nonatomic, strong) NSString *fontString;

@end

@implementation OOOoyalaTVButton

- (id)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  
  if (self) {
    self.titleLabel.textAlignment = NSTextAlignmentCenter;
    if (self.OOFontSize) {
      [self.titleLabel setFont:[UIFont fontWithName:@"ooyala-slick-type" size:self.OOFontSize]];
    } else {
      [self.titleLabel setFont:[UIFont fontWithName:@"ooyala-slick-type" size:40.0]];
    }
  }
  
  return self;
}

- (void)changePlayingState: (BOOL)isPlay {
  self.fontString = isPlay ? @"g": @"v";
  
  [self setTitle:self.fontString forState:UIControlStateNormal];
}

@end
