//
//  OOGradientView.m
//  OoyalaSkinSDK
//
//  Created by Zhihui Chen on 7/24/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOGradientView.h"
#import <QuartzCore/QuartzCore.h>

@implementation OOGradientView

+ (Class)layerClass {
  return [CAGradientLayer class];
}

- (CAGradientLayer *)gradientLayer {
  return (CAGradientLayer *)self.layer;
}

@end
