//
// Created by Daniel Kao on 8/6/15.
// Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOFacebookSharePlugin.h"
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
    }
    else{
      UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Social share not available"
                                                      message:@"You may need to sign in your account in settings"
                                                     delegate:ctrl
                                            cancelButtonTitle:@"OK"
                                            otherButtonTitles:nil];
      [alert show];
    }
  }
}

- (void) dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end