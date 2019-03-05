//
//  OOPiPViewManager.m
//  OoyalaSkinSDK
//
//  Created by Oleksandr Sulyma on 3/4/19.
//  Copyright © 2019 ooyala. All rights reserved.
//



#import "OOPiPViewManager.h"
#import <MediaPlayer/MPVolumeView.h>

@implementation OOPiPViewManager

RCT_EXPORT_MODULE();

- (UIView *)view {

  UIView *viewLikeBtn = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 40, 22)];
  //viewLikeBtn.backgroundColor = UIColor.yellowColor;
  return viewLikeBtn;
}

@end


