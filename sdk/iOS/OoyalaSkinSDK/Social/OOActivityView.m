//
//  OOActivityView.m
//  OoyalaSkinSDK
//
//  Created by Eric Vargas on 12/29/15.
//  Copyright © 2015 ooyala. All rights reserved.
//

#import "OOActivityView.h"
#import "RCTUtils.h"
#import "RCTConvert.h"

@implementation OOActivityView

RCT_EXPORT_MODULE();

-(dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(show:(NSDictionary *)options) {
  
  NSMutableArray *items = [NSMutableArray new];
  
  NSString *text = [RCTConvert NSString:options[@"text"]];
  if (text) {
    [items addObject:text];
  }
  
  NSString *urlStr = [RCTConvert NSString:options[@"link"]];
  NSURL *url;
  if (urlStr.length > 0 && (url = [RCTConvert NSURL:urlStr]) != nil) {
    [items addObject:url];
  }
  
  if (items.count == 0) {
    RCTLogError(@"No 'text' or 'link' to share");
    return;
  }
  
  UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:items applicationActivities:nil];

  NSMutableArray *excludedActivities = [[NSMutableArray alloc] initWithArray:@[UIActivityTypeAddToReadingList,
                                                                               UIActivityTypeAirDrop,
                                                                               UIActivityTypeAssignToContact,
                                                                               UIActivityTypeCopyToPasteboard,
                                                                               UIActivityTypeMessage,
                                                                               UIActivityTypePostToFlickr,
                                                                               UIActivityTypePostToTencentWeibo,
                                                                               UIActivityTypePostToVimeo,
                                                                               UIActivityTypePostToWeibo,
                                                                               UIActivityTypePrint,
                                                                               UIActivityTypeSaveToCameraRoll]];
  
  // ipad simulators with iOS 8 or lower versions crash with activity UIActivityTypeOpenInIBooks
  // We only exclude this activity for iOS 9.
  #if __IPHONE_OS_VERSION_MIN_REQUIRED >= __IPHONE_9_0
    [excludedActivities addObject:UIActivityTypeOpenInIBooks];
  #endif
  
  activityVC.excludedActivityTypes = excludedActivities;
  
  // for mail subject
  if (text) {
    [activityVC setValue:text forKey:@"subject"];
  }
  
  UIViewController *ctrl = RCTKeyWindow().rootViewController;
  
  // if it is an iPad and iOS 8+ device
  activityVC.modalPresentationStyle = UIModalPresentationPopover;
  activityVC.popoverPresentationController.permittedArrowDirections = 0;
  activityVC.popoverPresentationController.sourceView = ctrl.view;
  activityVC.popoverPresentationController.sourceRect = (CGRect) {ctrl.view.center, {1, 1}};
  
  [ctrl presentViewController:activityVC animated:YES completion:nil];
}

@end
