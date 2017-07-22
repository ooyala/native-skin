//
//  OOTVOptionsCollectionView.h
//  OoyalaTVSkinSDK
//
//  Created by Ileana Padilla on 7/21/17.
//  Copyright © 2017 ooyala. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface OOTVOptionsCollectionView : UICollectionView

- (BOOL)canBecomeFocused;
//- (UIView *)preferredFocusedView;
- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context;
@end
