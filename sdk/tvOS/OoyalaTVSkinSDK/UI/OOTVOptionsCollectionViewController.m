#import "OOTVOptionsCollectionViewController.h"
#import "OOOoyalaTVConstants.h"
#import "OOOoyalaTVOptionCell.h"
#import "OOOoyalaTVPlayerViewController.h"
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import "Pair.h"


@implementation OOTVOptionsCollectionViewController

- (instancetype)initWithViewController:(OOOoyalaTVPlayerViewController *)controller  {
  if (self = [super init]) {
    _viewController = controller;
  }

  self.barView = [[OOOoyalaTVTopBar alloc] initWithBackground:self.view];

  UICollectionViewFlowLayout *flowLayout = [UICollectionViewFlowLayout new];
  self.optionsCollectionView = [[OOTVOptionsCollectionView alloc] initWithFrame:CGRectMake(self.view.bounds.size.width - ccWidth - componentSpace * 4,
                                                                                           componentSpace * 8,
                                                                                           ccWidth,
                                                                                           ccHeight - componentSpace * 8)
                                                           collectionViewLayout:flowLayout];
  self.optionsCollectionView.dataSource = self;
  self.optionsCollectionView.delegate = self;
  self.optionsCollectionView.userInteractionEnabled = YES;
  [self.optionsCollectionView registerClass:OOOoyalaTVOptionCell.class
                 forCellWithReuseIdentifier:@"cellIdentifier"];

  // Setting default selected language to Off
  self.selectedIndex = [NSIndexPath indexPathForRow:0 inSection:0];

  [self.view addSubview:self.barView];
  [self.view addSubview:self.optionsCollectionView];
  [self.view bringSubviewToFront:self.optionsCollectionView];

  return self;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView
     numberOfItemsInSection:(NSInteger)section {
  Pair *sectionPair = self.viewController.availableOptions[(NSUInteger)section];
  return (NSInteger)sectionPair.value.count;
}

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
  //We are only supporting one section for CC menu
  return 1;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView
                  cellForItemAtIndexPath:(NSIndexPath *)indexPath {
  OOOoyalaTVOptionCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"cellIdentifier"
                                                                         forIndexPath:indexPath];
  // Set the data for this cell:
  Pair *sectionPair = self.viewController.availableOptions[(NSUInteger)indexPath.section];
  cell.optionLabel.text = sectionPair.value[(NSUInteger)indexPath.row];

  //We display check if cell was already selected
  if (self.selectedIndex == indexPath) {
    cell.checkedLabel.hidden = NO;
  } else {
    cell.checkedLabel.hidden = YES;
  }

  return cell;
}

- (CGSize)collectionView:(UICollectionView *)collectionView
                  layout:(UICollectionViewLayout *)collectionViewLayout
  sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
  return CGSizeMake(labelHeight * 26, labelHeight * 4);
}

- (BOOL)collectionView:(UICollectionView *)collectionView canFocusItemAtIndexPath:(NSIndexPath *)indexPath {
  return YES;
}

#pragma mark - UICollectionViewDelegate

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
  Pair *sectionPair = self.viewController.availableOptions[(NSUInteger)indexPath.section];
  // We set selected CC language in player
  [self.viewController.player setClosedCaptionsLanguage:sectionPair.value[(NSUInteger)indexPath.row]];
  [self.viewController addClosedCaptionsView];

  NSIndexPath *prev = self.selectedIndex;
  self.selectedIndex = indexPath;
  [self.optionsCollectionView reloadItemsAtIndexPaths:@[prev]];
  [self.optionsCollectionView reloadItemsAtIndexPaths:@[indexPath]];
  // Once language selected, we close CC menu
  [self.view removeFromSuperview];
}

- (void)collectionView:(UICollectionView *)collectionView didDeselectItemAtIndexPath:(NSIndexPath *)indexPath {
  OOOoyalaTVOptionCell *cell = (OOOoyalaTVOptionCell *)[collectionView cellForItemAtIndexPath:indexPath];
  cell.backgroundColor = UIColor.clearColor;
}

- (BOOL)collectionView:(UICollectionView *)collectionView shouldHighlightItemAtIndexPath:(NSIndexPath *)indexPath {
  return YES;
}

- (BOOL)collectionView:(UICollectionView *)collectionView shouldSelectItemAtIndexPath:(NSIndexPath *)indexPath {
  return YES;
}

@end
