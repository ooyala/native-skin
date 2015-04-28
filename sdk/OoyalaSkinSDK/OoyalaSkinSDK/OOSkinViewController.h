//
//  OOSkinViewController.h
//  OoyalaSkin
//
//  Created by Zhihui Chen on 4/16/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@class OOOoyalaPlayer;

@interface OOSkinViewController : UIViewController

@property (nonatomic, retain) OOOoyalaPlayer *player;

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player rect:(CGRect)rect launchOptions:(NSDictionary *)options;

- (void)loadStartScreenConfigureFile;

@end
