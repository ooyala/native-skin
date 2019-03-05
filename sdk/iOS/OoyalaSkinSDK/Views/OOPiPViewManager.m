//
//  OOPiPViewManager.m
//  OoyalaSkinSDK
//
//  Copyright © 2019 ooyala. All rights reserved.
//

#import "OOPiPViewManager.h"
#import <MediaPlayer/MPVolumeView.h>

@implementation OOPiPViewManager

RCT_EXPORT_MODULE();

- (UIView *)view {
  //RN Note: Do not attempt to set the frame or backgroundColor properties on the UIView instance that you expose through the -view method. React Native will overwrite the values set by your custom class in order to match your JavaScript component's layout props.
  UIView *viewLikeBtn = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 40, 22)];
  //viewLikeBtn.backgroundColor = UIColor.yellowColor;
  return viewLikeBtn;
}

@end


