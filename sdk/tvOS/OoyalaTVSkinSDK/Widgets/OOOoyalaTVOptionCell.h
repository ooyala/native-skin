//
//  OOOoyalaTVOptionCell.h
//  OoyalaTVSkinSDK
//
//  Created by Ileana Padilla on 7/19/17.
//  Copyright © 2017 ooyala. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface OOOoyalaTVOptionCell : UICollectionViewCell

@property (strong, nonatomic) UILabel * optionLabel;
@property (strong, nonatomic) UILabel * checkedLabel;
@property (assign, nonatomic) BOOL * isFocused;

- (id)initWithFrame:(CGRect)frame;
- (BOOL)canBecomeFocused;

@end
 
