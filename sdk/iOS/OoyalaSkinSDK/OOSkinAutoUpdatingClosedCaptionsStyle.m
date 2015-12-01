//
//  OOSkinAutoUpdatingClosedCaptionsStyle.m
//  OoyalaSkinSDK
//
//  Created by Jon Slenk on 6/4/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOSkinAutoUpdatingClosedCaptionsStyle.h"
#import <OoyalaSDK/OOClosedCaptionsView.h>

@interface OOSkinAutoUpdatingClosedCaptionsStyle()
@property (nonatomic, weak) OOClosedCaptionsView *ccView; // so we can tell it to update its rendering.
@end

@implementation OOSkinAutoUpdatingClosedCaptionsStyle

-(id) initWithClosedCaptionsView:(OOClosedCaptionsView*)ccView {
  self = [super init];
  if( self ) {
    _ccView = ccView;
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onApplicationDidBecomeActive:)
                                                 name:UIApplicationDidBecomeActiveNotification
                                               object:nil];
  }
  return self;
}

-(void) dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

-(void) onApplicationDidBecomeActive:(NSNotification *)notification {
  [self updateStyle];
  [self.ccView setStyle:self]; // without this, the ccView never changes its rendering.
}

@end
