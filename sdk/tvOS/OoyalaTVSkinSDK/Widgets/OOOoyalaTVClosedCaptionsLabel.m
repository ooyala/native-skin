//
//  OOOoyalaTVClosedCaptionsLabel.m
//  OoyalaTVSkinSDK
//
//  Created by Ileana Padilla on 7/20/17.
//  Copyright © 2017 ooyala. All rights reserved.
//

#import "OOOoyalaTVClosedCaptionsLabel.h"

@interface OOOoyalaTVClosedCaptionsLabel()
@property (nonatomic) bool isUniformEdge;
@end

@implementation OOOoyalaTVClosedCaptionsLabel

- (id)initWithFrame:(CGRect)frame isUniformEdge:(BOOL)isUniformEdge
{
    self = [super initWithFrame:frame];
    if (self) {
        self.textAlignment = NSTextAlignmentCenter;
        self.isUniformEdge = isUniformEdge;
        // Initialization code
    }
    return self;
    
}

- (void) setText:(NSString *)text {
    [super setText:text];
    [self setNeedsDisplay];
}


- (void)drawTextInRect:(CGRect)rect {
    // Draw outline for roll-up presentation with uniform edge style
    if (self.isUniformEdge) {
        CGSize shadowOffset = self.shadowOffset;
        UIColor *textColor = self.textColor;
        
        CGContextRef c = UIGraphicsGetCurrentContext();
        CGContextSetLineWidth(c, 2);
        CGContextSetLineJoin(c, kCGLineJoinRound);
        
        CGContextSetTextDrawingMode(c, kCGTextStroke);
        self.textColor = [UIColor blackColor];
        [super drawTextInRect:rect];
        
        CGContextSetTextDrawingMode(c, kCGTextFill);
        self.textColor = textColor;
        self.shadowOffset = CGSizeMake(0, 0);
        [super drawTextInRect:rect];
        
        self.shadowOffset = shadowOffset;
    }
    else {
        [super drawTextInRect:rect];
    }
}

@end
