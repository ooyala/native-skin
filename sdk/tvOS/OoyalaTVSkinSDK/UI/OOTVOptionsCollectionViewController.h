#import <UIKit/UIKit.h>
#import <OOOoyalaTVPlayerViewController.h>
#import <OOOoyalaTVTopBar.h>
#import <OOTVOptionsCollectionView.h>

@interface OOTVOptionsCollectionViewController : UIViewController<UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>

@property (nonatomic) OOTVOptionsCollectionView *optionsCollectionView;
@property (nonatomic, weak) OOOoyalaTVPlayerViewController *viewController;
@property (nonatomic) OOOoyalaTVTopBar *barView;
@property (nonatomic) NSArray *optionList;
@property (nonatomic, retain) NSString *selectedLanguage;

- (instancetype)initWithViewController:(OOOoyalaTVPlayerViewController *)controller;

@end
