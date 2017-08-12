//
//  OOTVOptionsCollectionView.h
//  OoyalaTVSkinSDK
//
//  Created by Ileana Padilla on 7/21/17.
//  Copyright © 2017 ooyala. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "OOOoyalaTVBar.h"
#import "OOOoyalaTVConstants.h"

@interface OOTVOptionsCollectionView : UICollectionView

@property (nonatomic, strong) OOOoyalaTVBar *optionsBar;
@property (nonatomic, strong) UILabel *optionsTitle;

- (BOOL)canBecomeFocused;
- (instancetype)initWithFrame:(CGRect)frame;
@end
