#import <UIKit/UIKit.h>

@interface OOOoyalaTVOptionCell : UICollectionViewCell

@property UILabel *optionLabel;
@property UILabel *checkedLabel;
@property BOOL isFocused;

- (id)initWithFrame:(CGRect)frame;
- (BOOL)canBecomeFocused;

@end
 
