//
//  NSMutableDictionary+Utils.m
//  OoyalaTVSkinSDK
//
//  Copyright © 2017 ooyala. All rights reserved.
//

#import "NSMutableDictionary+Utils.h"


@implementation NSMutableDictionary (Utils)

#pragma mark - Public functions

- (void)mergeWith:(NSDictionary *)dict {
  for (id key in dict.allKeys) {
    NSObject *value = self[key];
    if ([value isKindOfClass:NSDictionary.class]) {
      NSMutableDictionary *subDict = [NSMutableDictionary dictionaryWithDictionary:(NSDictionary *)value];
      [subDict mergeWith:dict[key]];
      self[key] = subDict;
    } else {
      self[key] = dict[key];
    }
  }
}

@end
