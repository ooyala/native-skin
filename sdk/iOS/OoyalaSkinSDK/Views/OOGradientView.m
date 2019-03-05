//
//  OOGradientView.m
//  OoyalaSkinSDK
//
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
