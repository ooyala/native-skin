//
//  OOReactSocialShare.m
//  OoyalaSkinSDK
//
//  Created by Yi Gu on 6/1/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOReactSocialShare.h"
#import "RCTConvert.h"
#import "OOFacebookSharePlugin.h"
#import <MessageUI/MessageUI.h>
#import <Social/Social.h>

@implementation OOReactSocialShare

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(onSocialButtonPress:(NSDictionary *)options
                  callback: (RCTResponseSenderBlock)callback)
{
  // Fires a notification to all observers
  [[NSNotificationCenter defaultCenter] postNotificationName:@"socialButtonPressed" object:nil userInfo:options];

}

@end
