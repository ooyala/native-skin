//
//  OOLocaleHelper.m
//  OoyalaSkinSDK
//
//  Created by Zhihui Chen on 7/9/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOLocaleHelper.h"

NSString * const kLocalizableStrings = @"localization";
NSString * const kLocale = @"locale";

@implementation OOLocaleHelper

+ (NSString *)preferredLanguageId {
  NSString *preferredLanguageId = @"en";
  if ([NSLocale preferredLanguages].count > 0) {
    NSString *locale = [[NSLocale preferredLanguages] objectAtIndex:0];
    preferredLanguageId = [locale substringToIndex:2];
  }

  return preferredLanguageId;
}

+ (NSString *)localizedStringFromDictionary:(NSDictionary *)config forKey:(NSString *)key
{
  if (key.length <= 0) {
    return key;
  }

  NSString *defaultLocale = [config[kLocalizableStrings] objectForKey:@"defaultLanguage"];
  if (!defaultLocale) {
    defaultLocale = @"";
  }

  NSArray *preferredOrder = [NSArray arrayWithObjects:config[kLocale], defaultLocale, @"en", nil];
  for (int i = 0; i < preferredOrder.count; ++i ) {
    NSDictionary *stringTable = [config[kLocalizableStrings] objectForKey:preferredOrder[i]];
    if (stringTable && [stringTable objectForKey:key]) {
      return [stringTable objectForKey:key];
    }
  }
  return key;
}


@end
