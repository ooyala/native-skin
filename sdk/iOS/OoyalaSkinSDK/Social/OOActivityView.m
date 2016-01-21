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

RCT_EXPORT_METHOD(show:(NSDictionary *)options)
{
  
  NSMutableArray *items = [NSMutableArray new];
  
  NSString *text = [RCTConvert NSString:options[@"text"]];
  if (text) {
    [items addObject:text];
  }
  
  NSURL *url = [self shareURL:options[@"link"]];
  if (url) {
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
  
  UIViewController *controller = [self topMostViewController:RCTKeyWindow().rootViewController];
  
  // If another ActivityView is being presented, do nothing.
  if ([controller isKindOfClass:[UIActivityViewController class]]) {
    return;
  }
  
  // if it is an iPad and iOS 8+ device
  activityVC.modalPresentationStyle = UIModalPresentationPopover;
  activityVC.popoverPresentationController.permittedArrowDirections = 0;
  activityVC.popoverPresentationController.sourceView = controller.view;
  activityVC.popoverPresentationController.sourceRect = (CGRect) {controller.view.center, {1, 1}};
  
  [controller presentViewController:activityVC animated:YES completion:nil];
}

- (UIViewController *)topMostViewController:(UIViewController *)root
{
  if ([root isKindOfClass:[UITabBarController class]]) {
    UITabBarController *tabBarController = (UITabBarController *) root;
    return [self topMostViewController:tabBarController.selectedViewController];
  } else if ([root isKindOfClass:[UINavigationController class]]) {
    UINavigationController *navigationController = (UINavigationController *) root;
    return [self topMostViewController:navigationController.visibleViewController];
  } else if (root.presentedViewController) {
    return [self topMostViewController:root.presentedViewController];
  } else {
    return root;
  }
}

- (NSURL *)shareURL:(id)link
{
  NSString *urlStr = [RCTConvert NSString:link];
  NSURL *url;
  if (urlStr.length > 0 &&
      (url = [RCTConvert NSURL:urlStr]) != nil &&
      url.host &&
      ([url.scheme isEqualToString:@"http"] || [url.scheme isEqualToString:@"https"])) {
    return url;
  }
  
  return nil;
}

@end
