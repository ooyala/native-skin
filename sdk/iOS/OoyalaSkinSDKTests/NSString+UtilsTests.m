//
//  NSString+UtilsTests.m
//  OoyalaSkinSDK
//
//  Created by Eric Vargas on 11/4/15.
//  Copyright © 2015 ooyala. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "NSString+Utils.h"

@interface NSString_UtilsTests : XCTestCase {
@private
  NSString *testCase;
}

@end

@implementation NSString_UtilsTests

- (void)setUp {
  testCase = @"testCase";
}

- (void)testFontFamilyDoesNotExist {
  CGSize size = [testCase textSizeWithFontFamily:@"I don't exist" fontSize:16];
  XCTAssertTrue(CGSizeEqualToSize(size, CGSizeZero));
}

- (void)testSizeIsNegative {
  CGSize size = [testCase textSizeWithFontFamily:@"Arial" fontSize:-1];
  XCTAssertTrue(CGSizeEqualToSize(size, CGSizeZero));
}

- (void)testSizeIsTooBig {
  CGSize size = [testCase textSizeWithFontFamily:@"Arial" fontSize:100];
  XCTAssertTrue(CGSizeEqualToSize(size, CGSizeZero));
  
  size = [testCase textSizeWithFontFamily:@"Arial" fontSize:999999];
  XCTAssertTrue(CGSizeEqualToSize(size, CGSizeZero));
}

- (void)testSizeIsCorrect {
  CGSize size = [testCase textSizeWithFontFamily:@"Arial" fontSize:16];
  XCTAssertGreaterThan(size.height, 10);
  XCTAssertGreaterThan(size.width, 30);
}


@end
