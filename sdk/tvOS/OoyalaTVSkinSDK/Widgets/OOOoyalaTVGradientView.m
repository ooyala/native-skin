//
//  OOOoyalaTVGradientView.m
//  OoyalaTVSkinSDK
//
//  Created by Yi Gu on 7/19/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOOoyalaTVGradientView.h"

@implementation OOOoyalaTVGradientView

- (id)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  
  if (self) {
    [self setupGradient];
  }
  
  return self;
}

- (void)setupGradient {
  CAGradientLayer *gradient = [CAGradientLayer layer];
  
  if (self.OOGradientColors != nil) {
    gradient.colors = self.OOGradientColors;
  } else {
    gradient.colors = [NSArray arrayWithObjects:(id)[UIColor colorWithRed:0 green:0 blue:0 alpha:0.15], (id)[[UIColor clearColor] CGColor], nil];
  }

  if (!CGRectIsEmpty(self.OOGradientFrame)) {
    gradient.frame = self.OOGradientFrame;
  } else {
    gradient.frame = self.bounds;
  }
  
  [self.layer insertSublayer:gradient atIndex:0];
}

@end
