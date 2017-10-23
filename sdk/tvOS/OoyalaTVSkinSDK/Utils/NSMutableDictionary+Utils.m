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
    for (id key in [dict allKeys]) {
        NSObject *value = [self objectForKey:key];
        if ([value isKindOfClass:[NSDictionary class]]) {
            NSMutableDictionary *subDict = [NSMutableDictionary dictionaryWithDictionary:(NSDictionary *)value];
            [subDict mergeWith:[dict objectForKey:key]];
            [self setObject:subDict forKey:key];
        } else {
            [self setObject:[dict objectForKey:key] forKey:key];
        }
    }
}

@end
