//
//  OOTVClosedCaptionsTextView.h
//  OoyalaTVSkinSDK
//
//  Copyright © 2017 ooyala. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "OOTVClosedCaptionsTextBackgroundView.h"
#import <OoyalaSDK/OOClosedCaptionsStyle.h>


@interface OOTVClosedCaptionsTextView : UITextView

@property (nonatomic, strong) NSString* nextText;
@property (nonatomic) MACaptionAppearanceTextEdgeStyle edgeStyle;
@property (nonatomic) CGFloat textSize;
@property (nonatomic, strong) OOTVClosedCaptionsTextBackgroundView *backgroundView;
@property (nonatomic, strong) NSMutableArray *resultLines;
@property (nonatomic, strong) OOClosedCaptionsStyle *style;

- (id)initWithFrame:(CGRect)frame style:(OOClosedCaptionsStyle *)style backgroundView:(OOTVClosedCaptionsTextBackgroundView *)backgroundView;
- (NSArray *)getRectsForEachLine:(NSArray *)separatedLines;
- (void)setFont:(NSString *)fontName frame:(CGRect)frame baseFontSize:(CGFloat)fontSize;

@end
