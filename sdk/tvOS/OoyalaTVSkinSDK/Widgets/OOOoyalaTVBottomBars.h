//
//  OOOoyalaBottomTVBars.h
//  OoyalaTVSkinSDK
//
//  Created by Yi Gu on 7/21/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface OOOoyalaTVBottomBars : UIView

- (id)initWithBackground:(UIView *)background;
- (void)updateBarBuffer:(CGFloat)bufferTime
               playhead:(CGFloat)playheadTime
               duration:(CGFloat)duration
            totalLength:(CGFloat)length;

@end
