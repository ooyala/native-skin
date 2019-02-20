#import <OOOoyalaTVPlayerViewController.h>
#import "OOOoyalaTVTopBar.h"
#import "OOTVOptionsCollectionView.h"

@interface OOTVOptionsCollectionViewController : UIViewController<UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>

@property (nonatomic) OOTVOptionsCollectionView *optionsCollectionView;
@property (nonatomic, weak) OOOoyalaTVPlayerViewController *viewController;
@property (nonatomic) OOOoyalaTVTopBar *barView;
@property (nonatomic) NSIndexPath *selectedIndex;

- (instancetype)initWithViewController:(OOOoyalaTVPlayerViewController *)controller;

@end
