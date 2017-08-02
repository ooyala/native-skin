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
    return YES;
}

- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
    return YES;
}

-(UIView *)preferredFocusedView {
    //We need to manage cell focus because of player focus intervention
    if (self.subviews.count > 0){
        int currentIndexPath = self.focusedIndexPath.row;
        if (self.focusedIndexPath.row < self.subviews.count - 1){
            self.focusedIndexPath = [NSIndexPath indexPathForRow:self.focusedIndexPath.row + 1 inSection:0];
        } else{
            //We reset cell focus
            self.focusedIndexPath= [NSIndexPath indexPathForRow:0 inSection:0];
        }
        return self.subviews[currentIndexPath];
    }
    return self;
}

@end
