#import <UIKit/UIKit.h>

@class OOCaption;
@class OOClosedCaptionsStyle;

@interface OOOoyalaTVClosedCaptionsView : UIView {
    OOCaption *caption;
    OOClosedCaptionsStyle *style;
}
+ (void) setArbitararyScalingFactor:(CGFloat)scalingFactor;

@property (nonatomic, strong) OOCaption *caption;

@property (nonatomic, strong) OOClosedCaptionsStyle *style;
@end
