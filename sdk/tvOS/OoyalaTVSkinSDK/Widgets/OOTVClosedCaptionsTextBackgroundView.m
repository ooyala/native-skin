//
//  OOTVClosedCaptionsTextBackgroundView.m
//  OoyalaTVSkinSDK
//
//  Copyright © 2017 ooyala. All rights reserved.
//

#import "OOTVClosedCaptionsTextBackgroundView.h"


@implementation OOTVClosedCaptionsTextBackgroundView

#pragma mark - Initializaiton

- (id)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    self.shadowOffset = CGSizeMake(0, 0);
    self.shadowOpacity = 0;
    self.highlightColor = [UIColor clearColor];
    self.highlightOpacity = 0;
  }
  return self;
}

#pragma mark - Public functions

- (void)updateBackground {
  [self setNeedsDisplay];
}

@end
