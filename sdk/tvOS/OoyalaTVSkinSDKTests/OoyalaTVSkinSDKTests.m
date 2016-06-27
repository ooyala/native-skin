//
//  OoyalaTVSkinSDKTests.m
//  OoyalaTVSkinSDKTests
//
//  Created by Yi Gu on 6/16/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "OOOoyalaTVPlayerViewController.h"

@interface OoyalaTVSkinSDKTests : XCTestCase

@property (nonatomic) OOOoyalaTVPlayerViewController *tvPlayerViewController;

@end

@implementation OoyalaTVSkinSDKTests

- (void)setUp {
  [super setUp];
  self.tvPlayerViewController = [[OOOoyalaTVPlayerViewController alloc] init];
}

- (void)tearDown {
  [super tearDown];
}

- (void)testExist {
  XCTAssertNotNil(self.tvPlayerViewController, @"The ViewController is not nil");
}


@end
