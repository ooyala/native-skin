//
//  OOSkinAutoUpdatingClosedCaptionsStyle.m
//  OoyalaSkinSDK
//
//  Created by Jon Slenk on 6/4/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOSkinAutoUpdatingClosedCaptionsStyle.h"
#import <OoyalaSDK/OOClosedCaptionsView.h>

@interface OOSkinAutoUpdatingClosedCaptionsStyle ()

@property (nonatomic, weak) OOClosedCaptionsView *ccView; // so we can tell it to update its rendering.

@end


@implementation OOSkinAutoUpdatingClosedCaptionsStyle

- (instancetype)initWithClosedCaptionsView:(OOClosedCaptionsView*)ccView {
  if (self = [super init]) {
    _ccView = ccView;
    [NSNotificationCenter.defaultCenter addObserver:self
                                           selector:@selector(onApplicationDidBecomeActive:)
                                               name:UIApplicationDidBecomeActiveNotification
                                             object:nil];
  }
  return self;
}

- (void)onApplicationDidBecomeActive:(NSNotification *)notification {
  [self updateStyle];
  self.ccView.style = self; // without this, the ccView never changes its rendering.
}

@end
