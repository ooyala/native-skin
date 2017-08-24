#import <UIKit/UIKit.h>
#import <OOOoyalaTVBar.h>
#import <OOOoyalaTVConstants.h>

@interface OOTVOptionsCollectionView : UICollectionView

@property (nonatomic, strong) OOOoyalaTVBar *optionsBar;
@property (nonatomic, strong) UILabel *optionsTitle;

- (BOOL)canBecomeFocused;
- (instancetype)initWithFrame:(CGRect)frame;
@end
