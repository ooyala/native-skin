#import <UIKit/UIKit.h>

@interface OOOoyalaTVTopBar : UIView

- (OOOoyalaTVTopBar *)initWithBackground:(UIView *)background;

- (OOOoyalaTVTopBar *)initMiniView:(UIView *)background;

- (void)addLanguages:(UIView *)view;

- (BOOL)canBecomeFocused;

@end
