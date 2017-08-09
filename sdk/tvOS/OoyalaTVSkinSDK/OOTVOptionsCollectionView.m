//
//  OOTVOptionsCollectionView.m
//  OoyalaTVSkinSDK
//
//  Created by Ileana Padilla on 7/21/17.
//  Copyright © 2017 ooyala. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OOTVOptionsCollectionView.h"

@implementation OOTVOptionsCollectionView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    return self;
}

- (BOOL)canBecomeFocused {
    return NO;
}

- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
    return YES;
}

- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
    if (self.subviews != nil){
        return self.subviews;
    }
    return self;
}

@end
