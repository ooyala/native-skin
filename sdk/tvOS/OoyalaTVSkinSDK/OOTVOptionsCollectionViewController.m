#import <Foundation/Foundation.h>
#import <OOTVOptionsCollectionViewController.h>
#import <OOOoyalaTVConstants.h>
#import <OOOoyalaTVOptionCell.h>
#import <OOOoyalaTVPlayerViewController.h>
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import "Pair.h"


@implementation OOTVOptionsCollectionViewController

- (id)initWithViewController:(OOOoyalaTVPlayerViewController *)c  {
    if (self = [super init]) {
        _viewController = c;
    }
    
    self.barView = [[OOOoyalaTVTopBar alloc] initWithBackground:self.view];
    
    UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
    self.optionsCollectionView = [[OOTVOptionsCollectionView alloc] initWithFrame:CGRectMake(self.view.bounds.size.width - ccWidth - componentSpace * 4, componentSpace * 8, ccWidth , ccHeight - componentSpace * 8)collectionViewLayout:flowLayout];
    [self.optionsCollectionView setDataSource:self];
    [self.optionsCollectionView setDelegate:self];
    
    self.optionsCollectionView.userInteractionEnabled = YES;
    
    [self.optionsCollectionView registerClass:[OOOoyalaTVOptionCell class] forCellWithReuseIdentifier:@"cellIdentifier"];
    
    //Setting default selected language to Off
    self.selectedLanguage = @"Off0";
    
    [self.view addSubview:self.barView];
    [self.view addSubview:self.optionsCollectionView];
    [self.view bringSubviewToFront:self.optionsCollectionView];
    
    return self;
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    self.optionList = [[NSArray alloc] initWithArray:[self.viewController availableOptions]];
    Pair *sectionPair = [[Pair alloc] init];
    sectionPair = [self.optionList objectAtIndex:(NSUInteger)section];
    
    return (NSInteger)sectionPair.value.count;
}

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    //We are only supporting one section for CC menu
    return 1;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    OOOoyalaTVOptionCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"cellIdentifier" forIndexPath:indexPath];
    
    //We retrieve array with CC lenguages available to display corresponding cells
    self.optionList = [[NSMutableArray alloc] initWithArray:[self.viewController availableOptions]];
    
    // Set the data for this cell:
    Pair *sectionPair = [[Pair alloc] init];
    sectionPair = [self.optionList objectAtIndex:(NSUInteger)indexPath.section];
    cell.optionLabel.text = [sectionPair.value objectAtIndex:(NSUInteger)indexPath.row];
    
    //We display check if cell was already selected
    if (self.selectedLanguage != nil && [self.selectedLanguage isEqualToString:[cell.optionLabel.text stringByAppendingFormat:@"%ld",(long)indexPath.row]]){
        [cell.checkedLabel setHidden:NO];
    }else {
        [cell.checkedLabel setHidden:YES];
    }
    
    return cell;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    return CGSizeMake(labelHeight * 26, labelHeight * 4);
}

- (BOOL)collectionView:(UICollectionView *)collectionView canFocusItemAtIndexPath:(NSIndexPath *)indexPath {
    return YES;
}

#pragma mark - UICollectionViewDelegate
- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    OOOoyalaTVOptionCell *cell = (OOOoyalaTVOptionCell *)[collectionView cellForItemAtIndexPath:indexPath];
    //Adding row to selected lenguage to avoid duplicate with "español"
    self.selectedLanguage = [cell.optionLabel.text stringByAppendingFormat:@"%ld",(long)indexPath.row];
    
    //We set selected CC lenguage in player
    [self.viewController.player setClosedCaptionsLanguage: cell.optionLabel.text];
    [self.viewController addClosedCaptionsView];
    
    [self.optionsCollectionView reloadData];
    //Once lenguage selected, we close CC menu
    [self.view removeFromSuperview];
    
}

- (void)collectionView:(UICollectionView *)collectionView didDeselectItemAtIndexPath:(NSIndexPath *)indexPath {
    OOOoyalaTVOptionCell *cell = (OOOoyalaTVOptionCell *)[collectionView cellForItemAtIndexPath:indexPath];
    cell.backgroundColor = [UIColor clearColor];
}

- (BOOL)collectionView:(UICollectionView *)collectionView shouldHighlightItemAtIndexPath:(NSIndexPath *)indexPath {
    return YES;
}

- (BOOL)collectionView:(UICollectionView *)collectionView shouldSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    return YES;
}

@end
