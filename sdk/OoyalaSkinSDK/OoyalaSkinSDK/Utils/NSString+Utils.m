//
//  NSString+Utils.m
//  OoyalaSkinSDK
//
//  Created by Eric Vargas on 10/29/15.
//  Copyright © 2015 ooyala. All rights reserved.
//

#import "NSString+Utils.h"

@implementation NSString (Utils)

- (CGSize)textSizeWithFontFamily:(NSString *)fontFamily fontSize:(NSUInteger)fontSize;
{
  // given an array of strings and other settings, compute the width of the strings to assist correct layout.
  NSArray *fontArray = [UIFont fontNamesForFamilyName:fontFamily];
  NSString *fontName = fontArray.count > 0 ? fontArray[0] : fontFamily;
  UIFont *font = [UIFont fontWithName:fontName size:fontSize];
  CGSize textSize = [self sizeWithAttributes:@{NSFontAttributeName:font}];
  return textSize;
}

@end
