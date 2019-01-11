//
//  OOOoyalaTVLabel.h
//  OoyalaTVSkinSDK
//
//  Created on 7/20/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface OOOoyalaTVLabel : UILabel

@property (nonatomic) UIColor *OOTextColor;
@property (nonatomic) NSTextAlignment OOTextAlighment;
@property (nonatomic) CGFloat OOFontSize;
@property (nonatomic) NSDateFormatter *OODateformatter;

- (instancetype)initWithFrame:(CGRect)frame time:(CGFloat)time;

@end
