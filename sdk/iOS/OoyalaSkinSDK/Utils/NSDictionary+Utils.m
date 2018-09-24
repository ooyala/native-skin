//
//  NSDictionary+Utils.m
//  OoyalaSkinSDK
//
//  Created by Eric Vargas on 11/6/15.
//  Copyright © 2015 ooyala. All rights reserved.
//

#import "NSDictionary+Utils.h"

#import <OoyalaSDK/OODebugMode.h>
#import "OOLocaleHelper.h"
#import "NSMutableDictionary+Utils.h"


@implementation NSDictionary (Utils)

#pragma - Constants
static NSString *availableLanguageFileKey = @"availableLanguageFile";
static NSString *iosResourceKey           = @"iosResource";
static NSString *jsonKey                  = @"json";

#pragma mark -

+ (NSDictionary *)dictionaryFromSkinConfigFile:(NSString *)filename mergedWith:(NSDictionary *)otherDict {
  NSDictionary *d = [NSDictionary dictionaryFromJson:filename];
  ASSERT(d != nil, @"missing skin configuration json" );

  NSMutableDictionary *dict               = [NSMutableDictionary dictionaryWithDictionary:d];
  NSMutableDictionary *localizableStrings = [NSMutableDictionary dictionaryWithDictionary:d[kLocalizableStrings]];
  NSArray *languages                      = localizableStrings[availableLanguageFileKey];

  for (NSDictionary *localizationConfig in languages) {
    if ([localizationConfig[iosResourceKey] isKindOfClass:[NSString class]]) {
      d = [NSDictionary dictionaryFromJson:localizationConfig[iosResourceKey]];
      if (d) {
        localizableStrings[localizationConfig[iosResourceKey]] = d;
      }
    }
  }

  dict[kLocalizableStrings] = localizableStrings;
  NSString *localeId = [OOLocaleHelper preferredLanguageId];
  dict[kLocale]      = localeId;

  [dict mergeWith:otherDict];
  return dict;
}

+ (NSDictionary *)dictionaryFromJson:(NSString *)filename {
  NSString *filePath = [[NSBundle mainBundle] pathForResource:filename ofType:jsonKey];
  NSData *data       = [NSData dataWithContentsOfFile:filePath];
  if (data) {
    NSError* error = nil;
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
    if (!error) {
      return dict;
    }
  }

  return nil;
}

@end
