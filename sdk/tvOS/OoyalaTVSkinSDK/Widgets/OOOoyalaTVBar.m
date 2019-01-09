//
//  OOOoyalaTVBar.m
//  OoyalaTVSkinSDK
//
//  Created on 7/20/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOOoyalaTVBar.h"
#import "OOOoyalaTVConstants.h"

@implementation OOOoyalaTVBar

- (instancetype)initWithFrame:(CGRect)frame color:(UIColor *)color{
  if (self = [super initWithFrame:frame]) {
    self.backgroundColor = color;
    self.layer.cornerRadius = barCornerRadius;
  }
  return self;
}

@end
