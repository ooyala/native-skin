//
//  UIColor+Utils.m
//  OoyalaSkinSDK
//
//  Created by Maksim Kupetskii on 9/24/18.
//  Copyright © 2018 ooyala. All rights reserved.
//

#import "UIColor+Utils.h"

@implementation UIColor (Utils)

+ (NSString *)hexStringFromColor:(UIColor *)color {
  const CGFloat *components = CGColorGetComponents(color.CGColor);

  CGFloat r = components[0];
  CGFloat g = components[1];
  CGFloat b = components[2];

  return [NSString stringWithFormat:@"#%02lX%02lX%02lX",
          lroundf(r * 255),
          lroundf(g * 255),
          lroundf(b * 255)];
}

@end
