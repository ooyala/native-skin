//
//  OOActivityView.m
//  OoyalaSkinSDK
//
//  Created by Eric Vargas on 12/29/15.
//  Copyright © 2015 ooyala. All rights reserved.
//

#import "OOActivityView.h"

#import <React/RCTUtils.h>
#import <React/RCTConvert.h>

@implementation OOActivityView

#pragma mark - Constants
static NSString *textKey    = @"text";
static NSString *linkKey    = @"link";
static NSString *subjectKey = @"subject";
static NSString *httpKey    = @"http";
static NSString *httpsKey   = @"https";

#pragma mark - Methods

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(show:(NSDictionary *)options) {
  NSMutableArray *items = [NSMutableArray new];
  
  NSString *text = [RCTConvert NSString:options[textKey]];
  if (text) {
    [items addObject:text];
  }
  
  NSURL *url = [self shareURL:options[linkKey]];
  if (url) {
    [items addObject:url];
  }
  
  if (items.count == 0) {
    RCTLogError(@"No 'text' or 'link' to share");
    return;
  }
  
  UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:items
                                                                           applicationActivities:nil];

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
                                                                               UIActivityTypeSaveToCameraRoll,
                                                                               UIActivityTypeOpenInIBooks]];
  activityVC.excludedActivityTypes = excludedActivities;
  
  // for mail subject
  if (text) {
    [activityVC setValue:text forKey:subjectKey];
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

- (UIViewController *)topMostViewController:(UIViewController *)root {
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

- (NSURL *)shareURL:(id)link {
  NSString *urlStr = [RCTConvert NSString:link];
  if (!urlStr) { return nil; }

  NSURL *url = [RCTConvert NSURL:urlStr];
  if (url && url.host && ([url.scheme isEqualToString:httpKey] || [url.scheme isEqualToString:httpsKey])) {
    return url;
  }
  
  return nil;
}

@end
