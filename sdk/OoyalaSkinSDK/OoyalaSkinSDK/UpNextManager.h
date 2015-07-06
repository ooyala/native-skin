//
// Created by Daniel Kao on 7/6/15.
// Copyright (c) 2015 ooyala. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface UpNextManager : NSObject

@property (nonatomic) BOOL isDismissed;

/**
* dismisses the upNext dialog when user clicks the dismiss button
*/
- (void)onDismissPressed;

@end