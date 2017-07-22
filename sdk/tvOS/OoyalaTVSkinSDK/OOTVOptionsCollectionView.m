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
    
    //self.remembersLastFocusedIndexPath = YES;
    
    return self;
}

- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
    return YES;
}

- (NSIndexPath *)indexPathForPreferredFocusedViewInCollectionView:(UICollectionView *)collectionView {
    //Currently we will only have one section for CC
    return [NSIndexPath indexPathForRow:0 inSection:0];
}

//- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
//    return self.subviews;
//}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
    
    if (self == context.nextFocusedView) {
        [coordinator addCoordinatedAnimations:^{
            context.nextFocusedView.transform = CGAffineTransformMakeScale(1.1, 1.1);
            context.nextFocusedView.backgroundColor = [[UIColor lightGrayColor] colorWithAlphaComponent:0.50];
        } completion:^{
            // completion
        }];
    } else if (self == context.previouslyFocusedView) {
        [coordinator addCoordinatedAnimations:^{
            context.previouslyFocusedView.transform = CGAffineTransformMakeScale(1.0, 1.0);
            context.previouslyFocusedView.backgroundColor = [UIColor clearColor];
        } completion:^{
            // completion
        }];
    }
}


//- (UIView *)preferredFocusedView {
//    return self;
//}

- (BOOL)canBecomeFocused {
    return YES;
}

@end
