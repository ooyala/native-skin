#import <UIKit/UIKit.h>
#import <OOOoyalaTVPlayerViewController.h>
#import <OOOoyalaTVTopBar.h>
#import <OOTVOptionsCollectionView.h>

@interface OOTVOptionsCollectionViewController : UIViewController<UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>

@property (strong, nonatomic) OOTVOptionsCollectionView * optionsCollectionView;
@property (nonatomic, weak) OOOoyalaTVPlayerViewController *viewController;
@property (nonatomic, strong) OOOoyalaTVTopBar *barView;
@property (strong, nonatomic) NSArray *optionList;
@property (nonatomic, retain) NSString *selectedLanguage;

- (id)initWithViewController:(OOOoyalaTVPlayerViewController *)c ;

@end
