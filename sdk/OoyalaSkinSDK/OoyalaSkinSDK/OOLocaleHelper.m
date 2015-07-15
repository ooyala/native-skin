//
//  OOLocaleHelper.m
//  OoyalaSkinSDK
//
//  Created by Zhihui Chen on 7/9/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOLocaleHelper.h"

@implementation OOLocaleHelper

+ (NSString *)preferredLanguageId {
  NSString *preferredLanguageId = @"en";
  if ([NSLocale preferredLanguages].count > 0) {
    NSString *locale = [[NSLocale preferredLanguages] objectAtIndex:0];
    preferredLanguageId = [locale substringToIndex:2];
  }

  return preferredLanguageId;
}

@end
