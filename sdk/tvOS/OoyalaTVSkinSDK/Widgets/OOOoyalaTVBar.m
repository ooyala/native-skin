//
//  OOOoyalaTVBar.m
//  OoyalaTVSkinSDK
//
//  Created by Yi Gu on 7/20/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOOoyalaTVBar.h"
#import "OOOoyalaTVConstants.h"

@implementation OOOoyalaTVBar

- (id)initWithFrame:(CGRect)frame color:(UIColor *)color{
  self = [super initWithFrame:frame];
  
  if (self) {
    self.backgroundColor = color;
    self.layer.cornerRadius = barCornerRadius;
  }
  
  return self;
}

@end
