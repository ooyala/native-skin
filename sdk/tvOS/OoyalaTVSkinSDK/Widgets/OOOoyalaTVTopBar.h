#import <UIKit/UIKit.h>

@interface OOOoyalaTVTopBar : UIView

- (instancetype)initWithBackground:(UIView *)background;
- (instancetype)initMiniView:(UIView *)background;
- (void)addLanguages:(UIView *)view;
- (BOOL)canBecomeFocused;

@end
