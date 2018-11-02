//
//  OOLocaleHelper.m
//  OoyalaSkinSDK
//
//  Created by Zhihui Chen on 7/9/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOLocaleHelper.h"

NSString *const kLocalizableStrings = @"localization";
NSString *const kLocale = @"locale";

@implementation OOLocaleHelper

#pragma mark - Constants
static NSString *defaultLanguage = @"defaultLanguage";
static NSString *englishLanguage = @"en";
static NSString *emptyLanguage   = @"";

#pragma mark - Methods

+ (NSString *)preferredLanguageId {
  NSString *preferredLanguageId = englishLanguage;
  if (NSLocale.preferredLanguages.count > 0) {
    NSString *locale = NSLocale.preferredLanguages[0];
    preferredLanguageId = [locale substringToIndex:2];
  }

  return preferredLanguageId;
}

+ (NSString *)localizedStringFromDictionary:(NSDictionary *)config forKey:(NSString *)key {
  if (key.length <= 0) {
    return key;
  }

  NSString *defaultLocale = config[kLocalizableStrings][defaultLanguage];
  if (!defaultLocale) {
    defaultLocale = emptyLanguage;
  }

  NSArray *preferredOrder = @[config[kLocale], defaultLocale, englishLanguage];
  for (int i = 0; i < preferredOrder.count; ++i) {
    NSDictionary *stringTable = config[kLocalizableStrings][preferredOrder[i]];
    if (stringTable && stringTable[key]) {
      return stringTable[key];
    }
  }
  return key;
}

@end
