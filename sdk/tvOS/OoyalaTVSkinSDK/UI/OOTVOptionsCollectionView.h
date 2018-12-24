#import <OOOoyalaTVBar.h>
#import <OOOoyalaTVConstants.h>

@interface OOTVOptionsCollectionView : UICollectionView

@property (nonatomic) OOOoyalaTVBar *optionsBar;
@property (nonatomic) UILabel *optionsTitle;

- (instancetype)initWithFrame:(CGRect)frame;

@end
