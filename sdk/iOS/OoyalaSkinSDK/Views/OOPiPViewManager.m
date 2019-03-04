//
//  OOPiPViewManager.m
//  OoyalaSkinSDK
//
//  Created by Oleksandr Sulyma on 3/4/19.
//  Copyright © 2019 ooyala. All rights reserved.
//

#import "OOPiPViewManager.h"

@implementation OOPiPViewManager

RCT_EXPORT_MODULE();

- (UIView *)view {
  UIButton *btn = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 40, 22)];
  return btn;
}

@end
