//
// Created by Daniel Kao on 8/6/15.
// Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOFacebookSharePlugin.h"
#import "OOSkinViewController.h"
#import "OOReactBridge.h"
#import <Social/Social.h>

@implementation OOFacebookSharePlugin

- (instancetype) init {
  if (self = [super init]) {

    // Add an observer that listens to when the share button is pressed
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(share:) name:@"socialButtonPressed" object:nil];
  }
  return self;
}

- (void) share:(NSNotification *)notification  {

  // If the notification user info is a facebook share.
  if([[notification.userInfo objectForKey:@"socialType"] isEqualToString:@"Facebook"]) {
    NSString *serviceType = SLServiceTypeFacebook;
    NSString *link = [notification.userInfo objectForKey:@"link"];
    NSString *imageLink = [notification.userInfo objectForKey:@"imageLink"];
    NSString *text = [notification.userInfo objectForKey:@"text"];
    
    NSDictionary *dictSocial = [OOSkinViewController getTextForSocialType:@"Facebook"];
    NSString *facebook_unavailable = [dictSocial objectForKey:@"Facebook Unavailable"];
    NSString *facebook_success = [dictSocial objectForKey:@"Facebook Success"];
    NSString *post_title =  [dictSocial objectForKey:@"Post Title"];
    NSString *account_configure =  [dictSocial objectForKey:@"Account Configure"];
    
    UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];

    if([SLComposeViewController isAvailableForServiceType:serviceType]) {
      SLComposeViewController *composeCtl = [SLComposeViewController composeViewControllerForServiceType:serviceType];

      if (link){
        [composeCtl addURL:[NSURL URLWithString:link]];
      }

      if (imageLink){
        UIImage *image = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:imageLink]]];
        [composeCtl addImage:image];
      }

      if (text){
        [composeCtl setInitialText:text];
      }

      [ctrl presentViewController:composeCtl animated:YES completion: nil];
      composeCtl.completionHandler = ^(SLComposeViewControllerResult result) {
        switch(result) {
          //  This means the user cancelled without sending the Tweet
          case SLComposeViewControllerResultCancelled:
          break;
          case SLComposeViewControllerResultDone:
          [OOReactBridge sendDeviceEventWithName:@"postShareAlert" body:@{@"title": post_title, @"message": facebook_success}];
          break;
        }
      };
    }
    else{
      [OOReactBridge sendDeviceEventWithName:@"postShareAlert" body:@{@"title": facebook_unavailable, @"message": account_configure}];
      // body {event："facebook_unavilable"
    }
  }
}

- (void) dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end