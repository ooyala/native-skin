//
//  OOOoyalaTVButton.m
//  OoyalaTVSkinSDK
//
//  Created on 7/19/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOOoyalaTVButton.h"

@interface OOOoyalaTVButton ()

@property (nonatomic) NSString *fontString;

@end

@implementation OOOoyalaTVButton

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    self.titleLabel.textAlignment = NSTextAlignmentCenter;
    if (self.OOFontSize != 0.0) {
      [self.titleLabel setFont:[UIFont fontWithName:@"ooyala-slick-type"
                                               size:self.OOFontSize]];
    } else {
      [self.titleLabel setFont:[UIFont fontWithName:@"ooyala-slick-type"
                                               size:40.0]];
    }
  }
  
  return self;
}

- (void)changePlayingState:(BOOL)isVideoPlaying {
  self.fontString = isVideoPlaying ? @"g": @"v";
  [self setTitle:self.fontString forState:UIControlStateNormal];
}

@end
