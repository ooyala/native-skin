//
//  NSMutableDictionary+Utils.m
//  OoyalaSkinSDK
//
//  Created by Eric Vargas on 10/29/15.
//  Copyright © 2015 ooyala. All rights reserved.
//

#import "NSMutableDictionary+Utils.h"

@implementation NSMutableDictionary (Utils)

- (void)mergeWith:(NSDictionary *)dict {
  for (id key in dict.allKeys) {
    NSObject *value = self[key];
    if ([value isKindOfClass:[NSDictionary class]]) {
      NSMutableDictionary *subDict = [NSMutableDictionary dictionaryWithDictionary:(NSDictionary *)value];
      [subDict mergeWith:dict[key]];
      self[key] = subDict;
    } else {
      self[key] = dict[key];
    }
  }
}

@end
