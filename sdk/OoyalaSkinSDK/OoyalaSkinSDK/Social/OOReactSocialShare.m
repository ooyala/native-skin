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

+ (NSString *)getSocialStringFromJson: (NSString *)key {
  NSString *filePath = [[NSBundle mainBundle] pathForResource:@"en" ofType:@"json"];
  NSString *myJSON = [[NSString alloc] initWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
  NSError *error;
  NSArray *jsonDataArray = [NSJSONSerialization JSONObjectWithData:[myJSON dataUsingEncoding:NSUTF8StringEncoding] options:kNilOptions error:&error];
  
  NSString *value = [[jsonDataArray objectAtIndex:0] objectForKey:key];
  
  return value;
}

@end
