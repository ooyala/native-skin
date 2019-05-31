//
//  OOTVClosedCaptionsTextView.h
//  OoyalaTVSkinSDK
//
//  Copyright © 2017 ooyala. All rights reserved.
//

#import "OOTVClosedCaptionsTextBackgroundView.h"
#import <OoyalaSDK/OOClosedCaptionsStyle.h>

@interface OOTVClosedCaptionsTextView : UITextView

@property (nonatomic) NSString *nextText;
@property (nonatomic) MACaptionAppearanceTextEdgeStyle edgeStyle;
@property (nonatomic) CGFloat textSize;
@property (nonatomic) OOTVClosedCaptionsTextBackgroundView *backgroundView;
@property (nonatomic) NSMutableArray *resultLines;
@property (nonatomic) OOClosedCaptionsStyle *style;

- (instancetype)initWithFrame:(CGRect)frame
                        style:(OOClosedCaptionsStyle *)style
               backgroundView:(OOTVClosedCaptionsTextBackgroundView *)backgroundView;
- (NSArray *)getRectsForEachLine:(NSArray *)separatedLines;
- (void)setFont:(NSString *)fontName frame:(CGRect)frame baseFontSize:(CGFloat)fontSize;

@end
