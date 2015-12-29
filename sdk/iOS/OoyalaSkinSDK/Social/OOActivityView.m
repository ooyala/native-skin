//
//  OOActivityView.m
//  OoyalaSkinSDK
//
//  Created by Eric Vargas on 12/29/15.
//  Copyright © 2015 ooyala. All rights reserved.
//

#import "OOActivityView.h"

@implementation OOActivityView

RCT_EXPORT_MODULE();

-(dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(show) {
  NSString *text = @"Look at this";
  NSArray * items = @[text];
  UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:items applicationActivities:nil];
  activityVC.excludedActivityTypes = @[UIActivityTypeAddToReadingList,
                                       UIActivityTypeAirDrop,
                                       UIActivityTypeAssignToContact,
                                       UIActivityTypeCopyToPasteboard,
                                       UIActivityTypeMessage,
                                       UIActivityTypeOpenInIBooks,
                                       UIActivityTypePostToFlickr,
                                       UIActivityTypePostToTencentWeibo,
                                       UIActivityTypePostToVimeo,
                                       UIActivityTypePostToWeibo,
                                       UIActivityTypePrint,
                                       UIActivityTypeSaveToCameraRoll];
  
  UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
  
  [ctrl presentViewController:activityVC animated:YES completion:nil];
}

@end
