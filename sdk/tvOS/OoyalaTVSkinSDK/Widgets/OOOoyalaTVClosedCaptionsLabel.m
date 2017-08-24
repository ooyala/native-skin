#import <OOOoyalaTVClosedCaptionsLabel.h>

@interface OOOoyalaTVClosedCaptionsLabel()
//Indicates if there is an outline along the edge of the text
@property (nonatomic) bool isUniformEdge;
@end

@implementation OOOoyalaTVClosedCaptionsLabel

- (OOOoyalaTVClosedCaptionsLabel *)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.textAlignment = NSTextAlignmentCenter;
    }
    return self;
    
}

- (void) setText:(NSString *)text {
    [super setText:text];
    [self setNeedsDisplay];
}

@end
