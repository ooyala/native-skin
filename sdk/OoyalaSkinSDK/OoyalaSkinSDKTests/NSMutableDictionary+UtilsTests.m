//
//  NSMutableDictionary+UtilsTests.m
//  OoyalaSkinSDK
//
//  Created by Eric Vargas on 11/4/15.
//  Copyright © 2015 ooyala. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "NSMutableDictionary+Utils.h"

@interface NSMutableDictionary_UtilsTests : XCTestCase {
@private
  NSMutableDictionary *sampleConfig;
}

@end

@implementation NSMutableDictionary_UtilsTests

- (void)setUp {
  sampleConfig = [@{@"general": @{
                       @"watermark": @{
                           @"imageResource": @{
                               @"url": @"assets/images/ooyala-watermark.png",
                            }
                        }
                  },
                   @"localization": @{
                      @"defaultLanguage": @"en",
                      @"availableLanguageFile": @[
                          @{@"language": @"en", @"languageFile": @"config/en.json"},
                          @{@"language": @"es", @"languageFile": @"config/es.json"},
                          @{@"language": @"zh", @"languageFile": @"config/zh.json"},
                      ]
                  },
                   @"moreOptionsScreen": @{
                       @"brightOpacity": @(1.0),
                       @"darkOpacity": @(0.4),
                       @"iconSize": @(30),
                       @"color": @"white",
                       @"iconStyle": @{
                           @"active": @{
                               @"color": @"#FFFFFF",
                               @"opacity": @(1),
                            },
                           @"active": @{
                               @"color": @"#FFFFFF",
                               @"opacity": @(0.6),
                            },
                        },
                  }} mutableCopy];
}

- (void)tearDown {
}

// Tests here
- (void)testMe {
  // I'm a test case
}

@end
