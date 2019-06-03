#import <UIKit/UIKit.h>

@class OOCaption;
@class OOClosedCaptionsStyle;

@interface OOOoyalaTVClosedCaptionsView : UIView

@property OOCaption *caption;
@property OOClosedCaptionsStyle *style;

+ (void)setArbitararyScalingFactor:(CGFloat)scalingFactor;
- (void)setCaptionStyle:(OOClosedCaptionsStyle *)style;
- (void)setClosedCaption:(OOCaption *)caption;

@end
