//
//  OOTVClosedCaptionsTextBackgroundView.h
//  OoyalaTVSkinSDK
//
//  Copyright © 2017 ooyala. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface OOTVClosedCaptionsTextBackgroundView : UIView

@property (nonatomic) NSArray *textRects;
@property (nonatomic) UIColor *highlightColor;
@property (nonatomic) CGFloat highlightOpacity;
@property (nonatomic) CGSize shadowOffset;
@property (nonatomic) CGFloat shadowOpacity;

- (void)updateBackground;

@end
