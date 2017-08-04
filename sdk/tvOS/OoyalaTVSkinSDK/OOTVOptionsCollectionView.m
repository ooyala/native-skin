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
    //We need to manage cell focus because each frame player gets the focus and we loose previous focused cell, retrieving the first every time.
    if (self.subviews.count > 0){
        NSIndexPath *currentIndexPath = [NSIndexPath indexPathForRow:self.focusedIndexPath.row inSection:0];
        if (self.focusedIndexPath.row < [self numberOfItemsInSection:0] - 1){
            //We set cell index path to retrieve next focused view
            self.focusedIndexPath = [NSIndexPath indexPathForRow:self.focusedIndexPath.row + 1 inSection:0];
        } else{
            //We reset cell focus to first cell
            self.focusedIndexPath= [NSIndexPath indexPathForRow:0 inSection:0];
            currentIndexPath = self.focusedIndexPath;
        }
        [self scrollToItemAtIndexPath:currentIndexPath atScrollPosition:0 animated:YES];
        return [self cellForItemAtIndexPath:currentIndexPath];
    }
    return self;
}

@end
