//
//  OOTVOptionsCollectionViewController.h
//  OoyalaTVSkinSDK
//
//  Created by Ileana Padilla on 7/19/17.
//  Copyright © 2017 ooyala. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "OOOoyalaTVPlayerViewController.h"
#import "OOOoyalaTVTopBar.h"
#import "OOTVOptionsCollectionView.h"

@interface OOTVOptionsCollectionViewController : UIViewController<UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>

@property (strong, nonatomic) OOTVOptionsCollectionView * optionsCollectionView;
@property (nonatomic, weak) OOOoyalaTVPlayerViewController *viewController;
@property (nonatomic, strong) OOOoyalaTVTopBar *barView;
@property (strong, nonatomic) NSMutableArray *optionList;
@property (nonatomic, retain) NSString *selectedLanguage;
@property (strong, nonatomic) UIFocusGuide *focusGuide;
@property (strong,nonatomic) NSIndexPath *focusedIndexPath;

- (id)initWithViewController:(OOOoyalaTVPlayerViewController *)c ;
- (UIView *)preferredFocusedView ;
- (BOOL)canBecomeFocused;
- (void)focusNextViewCell;

@end
