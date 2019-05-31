#import "OOOoyalaTVClosedCaptionsLabel.h"

@interface OOOoyalaTVClosedCaptionsLabel ()

//Indicates if there is an outline along the edge of the text
@property (nonatomic) bool isUniformEdge;

@end

@implementation OOOoyalaTVClosedCaptionsLabel

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    self.textAlignment = NSTextAlignmentCenter;
  }
  return self;
}

- (void)setText:(NSString *)text {
  [super setText:text];
  [self setNeedsDisplay];
}

@end
