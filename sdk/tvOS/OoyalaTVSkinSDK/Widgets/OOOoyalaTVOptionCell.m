#import <Foundation/Foundation.h>
#import <OOOoyalaTVOptionCell.h>
#import <OOOoyalaTVConstants.h>

@implementation OOOoyalaTVOptionCell

- (OOOoyalaTVOptionCell *)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    
    if (self) {
        
        self.optionLabel = [[UILabel alloc] initWithFrame:CGRectMake(labelWidth, 0, labelWidth * 3, labelHeight * 4)];
        self.checkedLabel = [[UILabel alloc] initWithFrame:CGRectMake(labelHeight, 0, labelHeight * 2, labelHeight * 4)];
        self.checkedLabel.text = @"✓";
        self.checkedLabel.textColor = [UIColor whiteColor];
        [self.checkedLabel setHidden:YES];
        self.optionLabel.textColor = [UIColor whiteColor];
        self.optionLabel.font = [UIFont fontWithName:@"Helvetica Neue" size:42];
    }
    self.layer.cornerRadius = cornerRadius;
    [self addSubview:self.checkedLabel];
    [self addSubview:self.optionLabel];
    
    [self setUserInteractionEnabled:YES];
    
    return self;
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
    
    if (self == context.nextFocusedView) {
        [coordinator addCoordinatedAnimations:^{
            context.nextFocusedView.transform = CGAffineTransformMakeScale(1.05, 1.05);
            context.nextFocusedView.backgroundColor = [[UIColor lightGrayColor] colorWithAlphaComponent:0.50];
        }completion:^{
            nil;
        }];
    } else if (self == context.previouslyFocusedView) {
        [coordinator addCoordinatedAnimations:^{
            context.previouslyFocusedView.transform = CGAffineTransformMakeScale(1.0, 1.0);
            context.previouslyFocusedView.backgroundColor = [UIColor clearColor];
        } completion:^{
            nil;
        }];
    }
}

- (void)pressesBegan:(NSSet<UIPress *> *)presses withEvent:(UIPressesEvent *)event {
    [super pressesBegan:presses withEvent:event];
    
    UIPress *press = [presses anyObject];
    
    if (press.type == UIPressTypeSelect) {
        self.transform = CGAffineTransformMakeScale(0.9, 0.9);
    }
    
}

- (void)pressesEnded:(NSSet<UIPress *> *)presses withEvent:(UIPressesEvent *)event {
    [super pressesEnded:presses withEvent:event];
    
    self.transform = CGAffineTransformMakeScale(1.0, 1.0);
}

- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
    return YES;
}

- (BOOL)canBecomeFocused {
    return YES;
}

@end
