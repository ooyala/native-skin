//
//  NSString+Utils.m
//  OoyalaSkinSDK
//
//  Created by Eric Vargas on 10/29/15.
//  Copyright © 2015 ooyala. All rights reserved.
//

#import "NSString+Utils.h"

const int MAX_FONT_SIZE = 100;

@implementation NSString (Utils)

- (CGSize)textSizeWithFontFamily:(NSString *)fontFamily fontSize:(NSUInteger)fontSize;
{
  if (fontSize >= MAX_FONT_SIZE) return CGSizeZero;
  
  // given an array of strings and other settings, compute the width of the strings to assist correct layout.
  NSArray *fontArray = [UIFont fontNamesForFamilyName:fontFamily];
  NSString *fontName = fontArray.count > 0 ? fontArray[0] : fontFamily;
  UIFont *font = [UIFont fontWithName:fontName size:fontSize];
  
  if (!font) return CGSizeZero;
  
  return [self sizeWithAttributes:@{NSFontAttributeName:font}];
}

@end
