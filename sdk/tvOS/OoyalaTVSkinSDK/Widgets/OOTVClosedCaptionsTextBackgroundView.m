//
//  OOTVClosedCaptionsTextBackgroundView.m
//  OoyalaTVSkinSDK
//
//  Copyright © 2017 ooyala. All rights reserved.
//

#import "OOTVClosedCaptionsTextBackgroundView.h"

@implementation OOTVClosedCaptionsTextBackgroundView

#pragma mark - Initializaiton

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _shadowOffset = CGSizeMake(0, 0);
    _shadowOpacity = 0;
    _highlightColor = UIColor.clearColor;
    _highlightOpacity = 0;
  }
  return self;
}

#pragma mark - Public functions

- (void)updateBackground {
  [self setNeedsDisplay];
}

@end
