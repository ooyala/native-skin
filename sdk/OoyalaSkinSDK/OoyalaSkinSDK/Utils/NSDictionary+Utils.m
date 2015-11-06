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

static NSString * const kLocalizableStrings = @"localization";
static NSString * const kLocale = @"locale";

@implementation NSDictionary (Utils)

+ (NSDictionary *) dictionaryFromSkinConfigFile:(NSString *)filename mergedWith:(NSDictionary *)otherDict
{
  NSDictionary *d = [NSDictionary dictionaryFromJson:filename];
  ASSERT(d != nil, @"missing skin configuration json" );

  NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithDictionary:d];
  NSMutableDictionary *localizableStrings = [NSMutableDictionary dictionaryWithDictionary:d[kLocalizableStrings]];
  NSArray *languages = localizableStrings[@"availableLanguageFile"];

  for (NSDictionary *localizationConfig in languages) {
    if ([localizationConfig[@"language"] isKindOfClass:[NSString class]]) {
      d = [NSDictionary dictionaryFromJson:localizationConfig[@"language"]];
      if (d) {
        [localizableStrings setObject:d forKey:localizationConfig[@"language"]];
      }
    }
  }

  [dict setObject:localizableStrings forKey:kLocalizableStrings];
  NSString *localeId = [OOLocaleHelper preferredLanguageId];
  [dict setObject:localeId forKey:kLocale];

  [dict mergeWith:otherDict];
  return dict;
}

+ (NSDictionary *)dictionaryFromJson:(NSString *)filename
{
  NSString *filePath = [[NSBundle mainBundle] pathForResource:filename ofType:@"json"];
  NSData *data = [NSData dataWithContentsOfFile:filePath];
  if (data) {
    NSError* error = nil;
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
    if( error == nil ) {
      return dict;
    }
  }
  
  return nil;
}



@end
