//
//  OOReactSocialShare.m
//  OoyalaSkinSDK
//
//  Created by Yi Gu on 6/1/15.
//  Copyright (c) 2015 ooyala. All rights reserved.
//

#import "OOReactSocialShare.h"
#import "RCTConvert.h"
#import <Social/Social.h>

@implementation OOReactSocialShare

RCT_EXPORT_MODULE();

static const NSString *LINK = @"link";
static const NSString *IMG_LINK = @"imagelink";
static const NSString *TEXT = @"text";

RCT_EXPORT_METHOD(onSocialButtonPress:(NSDictionary *)options
                  callback: (RCTResponseSenderBlock)callback)
{
    NSString *serviceType = @"";
    if([options[@"socialType"] isEqualToString:@"Twitter"]){
        serviceType = SLServiceTypeTwitter;
    }else{
        serviceType = SLServiceTypeFacebook;
    }
    
    if([SLComposeViewController isAvailableForServiceType:serviceType]) {
        SLComposeViewController *composeCtl = [SLComposeViewController composeViewControllerForServiceType:serviceType];
        
        if (options[LINK]){
            NSString *link = [RCTConvert NSString:options[LINK]];
            [composeCtl addURL:[NSURL URLWithString:link]];
        }
        
        if (options[IMG_LINK]){
            NSString *imagelink = [RCTConvert NSString:options[IMG_LINK]];
            UIImage *image = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:imagelink]]];
            [composeCtl addImage:image];
        }
        
        if (options[TEXT]){
            NSString *text = [RCTConvert NSString:options[TEXT]];
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
        
        UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
        [ctrl presentViewController:composeCtl animated:YES completion: nil];
    }
    else{
        callback(@[@"not_available"]);
    }
}


@end
