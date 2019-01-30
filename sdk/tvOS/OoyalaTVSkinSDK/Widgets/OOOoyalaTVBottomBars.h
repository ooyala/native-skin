//
//  OOOoyalaBottomTVBars.h
//  OoyalaTVSkinSDK
//
//  Copyright © 2016 ooyala. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface OOOoyalaTVBottomBars : UIView

- (instancetype)initWithBackground:(UIView *)background
                     withTintColor:(UIColor *)tintColor;

- (void)updateBarBuffer:(CGFloat)bufferTime
               playhead:(CGFloat)playheadTime
               duration:(CGFloat)duration
            totalLength:(CGFloat)length;

- (void)updateProgressBarTime:(CGFloat)time
                   duration:(CGFloat)duration
                totalLength:(CGFloat)length;

@end
