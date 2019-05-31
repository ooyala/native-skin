//
//  OoyalaTVSkinSDKTests.m
//  OoyalaTVSkinSDKTests
//
//  Created on 6/16/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "OOOoyalaTVPlayerViewController.h"
#import "OOOoyalaTVButton.h"

@interface OoyalaTVSkinSDKTests : XCTestCase

@property (nonatomic) OOOoyalaTVPlayerViewController *tvPlayerViewController;

@end

@implementation OoyalaTVSkinSDKTests

- (void)setUp {
  [super setUp];
  self.tvPlayerViewController = [[OOOoyalaTVPlayerViewController alloc] init];
}

- (void)tearDown {
  self.tvPlayerViewController = nil;
  [super tearDown];
}

- (void)testExist {
  XCTAssertNotNil(self.tvPlayerViewController, @"The ViewController is not nil");
}


- (void)testButtonIconChanged {
  
  // 1. given
  OOOoyalaTVButton *button = [[OOOoyalaTVButton alloc] initWithFrame:CGRectZero];
  
  // 2. when
  [button showReplayIcon];
  
  // 3. then
  NSString *title = [button titleForState:UIControlStateNormal];
  BOOL flag = [title isEqualToString:@"("];
  
  XCTAssertTrue(flag, @"❌  The OOOoyalaTVButton has title that not corresponding for replay icon in ooyala-slick-type.ttf");
}

@end
