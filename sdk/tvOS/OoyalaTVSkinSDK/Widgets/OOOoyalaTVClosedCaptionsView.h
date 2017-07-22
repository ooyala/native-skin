//
//  OOOoyalaTVClosedCaptionsView.h
//  OoyalaTVSkinSDK
//
//  Created by Ileana Padilla on 7/20/17.
//  Copyright © 2017 ooyala. All rights reserved.
//

#import <UIKit/UIKit.h>

@class OOCaption;
@class OOClosedCaptionsStyle;

/**
 * A View which displasy caption text
 * \ingroup captions
 */
@interface OOOoyalaTVClosedCaptionsView : UIView {
    OOCaption *caption;
    OOClosedCaptionsStyle *style;
}
+ (void) setArbitararyScalingFactor:(CGFloat)scalingFactor;

@property (nonatomic, strong) OOCaption *caption;

@property (nonatomic, strong) OOClosedCaptionsStyle *style;
@end
