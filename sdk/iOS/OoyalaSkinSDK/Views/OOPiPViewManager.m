//
//  OOPiPViewManager.m
//  OoyalaSkinSDK
//
//  Copyright © 2019 ooyala. All rights reserved.
//

#import "OOPiPViewManager.h"

@implementation OOPiPViewManager

RCT_EXPORT_MODULE();

- (UIView *)view {
  UIView *viewLikeBtn = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 40, 22)];
  return viewLikeBtn;
}

@end


