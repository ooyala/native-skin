//
//  OOReactSocialShare.m
//  OoyalaSkinSDK
//
//  Created by Yi Gu on 6/1/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOReactSocialShare.h"
#import "RCTConvert.h"
#import <MessageUI/MessageUI.h>
#import <Social/Social.h>

@implementation OOReactSocialShare

RCT_EXPORT_MODULE();

NSString * const LINK = @"link";
NSString * const IMG_LINK = @"imagelink";
NSString * const TEXT = @"text";

NSString * const FACEBOOK = @"Facebook";
NSString * const TWITTER = @"Twitter";
NSString * const GOOGLEPLUS = @"GooglePlus";
NSString * const EMAIL = @"Email";

RCT_EXPORT_METHOD(onSocialButtonPress:(NSDictionary *)options
                  callback: (RCTResponseSenderBlock)callback)
{
  NSString *serviceType;
  NSString *link;
  NSString *imageLink;
  NSString *text;
  NSString *socialType = options[@"socialType"];
  
  if (options[LINK]){
    link = [RCTConvert NSString:options[LINK]];
  }
  
  if (options[IMG_LINK]){
    imageLink = [RCTConvert NSString:options[IMG_LINK]];
  }
  
  if (options[TEXT]){
    text = [RCTConvert NSString:options[TEXT]];

  }
  
  // current view
  UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
  
  if([socialType isEqualToString:EMAIL]){
    NSString *strRecipient = @"yigu@ooyala.com";
    NSString *strTitle = text;
    NSString *strBody = link;
    
    NSString *URLEmail = [NSString stringWithFormat:@"malito:%@?subject=%@&body=%@", strRecipient, strTitle, strBody];
    NSString *url = [URLEmail stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
    
  }else{
    if([socialType isEqualToString:TWITTER]){
      serviceType = SLServiceTypeTwitter;
    }else if([socialType isEqualToString:FACEBOOK]){
      serviceType = SLServiceTypeFacebook;
    }
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
      
      [composeCtl setCompletionHandler:^(SLComposeViewControllerResult result) {
        if (result == SLComposeViewControllerResultDone) {
          // Sent
          callback(@[@"success"]);
        }
        else if (result == SLComposeViewControllerResultCancelled){
          // Cancelled
          callback(@[@"cancelled"]);
        }
      }];
      
      
      [ctrl presentViewController:composeCtl animated:YES completion: nil];
    }
    else{
      callback(@[@"not_available"]);
    }
  }
}

#pragma mark- MFMailComposeViewControllerDelegate Method::

- (void)mailComposeController:(MFMailComposeViewController *)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError *)error
{
  UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];

  [ctrl dismissViewControllerAnimated:YES completion:nil];
}


@end
