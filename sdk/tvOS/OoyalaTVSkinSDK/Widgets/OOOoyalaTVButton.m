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
    self.titleLabel.font = [UIFont fontWithName:@"ooyala-slick-type"
                                           size:self.OOFontSize != 0.0 ? self.OOFontSize : 40.0];
  }
  return self;
}

- (void)changePlayingState:(BOOL)isVideoPlaying {
  self.fontString = isVideoPlaying ? @"g": @"v";
  [self setTitle:self.fontString forState:UIControlStateNormal];
}

@end
