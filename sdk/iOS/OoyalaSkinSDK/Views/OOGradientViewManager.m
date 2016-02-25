//
//  OOGradientViewManager.m
//  OoyalaSkinSDK
//
//  Created by Zhihui Chen on 7/24/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOGradientViewManager.h"
#import "OOGradientView.h"

@implementation OOGradientViewManager

RCT_EXPORT_MODULE();

- (UIView *)view {
  OOGradientView *gradientView = [OOGradientView new];
  [self setup:gradientView.gradientLayer];
  return gradientView;
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}


- (void)setup:(CAGradientLayer *)layer {
  UIColor *outerColor = [UIColor colorWithWhite:1.0 alpha:0.0];
  UIColor *innerColor = [UIColor colorWithWhite:1.0 alpha:0.5];

  NSNumber *l1 = [NSNumber numberWithFloat:0];
  NSNumber *l2 = [NSNumber numberWithFloat:0.1];
  NSNumber *l3 = [NSNumber numberWithFloat:0.9];
  NSNumber *l4 = [NSNumber numberWithFloat:1];

  layer.startPoint = CGPointMake(0, 0.5);
  layer.endPoint = CGPointMake(1, 0.5);
  layer.colors = [NSArray arrayWithObjects:(id)innerColor.CGColor, (id)outerColor.CGColor, (id)outerColor.CGColor, (id)innerColor.CGColor, nil];
  layer.locations = [NSArray arrayWithObjects:l1, l2, l3, l4, nil];
}

@end
