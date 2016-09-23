//
//  OOOoyalaTVLabel.h
//  OoyalaTVSkinSDK
//
//  Created by Yi Gu on 7/20/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface OOOoyalaTVLabel : UILabel

@property (nonatomic, strong) UIColor * OOTextColor;
@property (nonatomic) NSTextAlignment OOTextAlighment;
@property (nonatomic) CGFloat OOFontSize;
@property (nonatomic, strong) NSDateFormatter *OODateformatter;

- (id)initWithFrame:(CGRect)frame time:(CGFloat)time;

@end
