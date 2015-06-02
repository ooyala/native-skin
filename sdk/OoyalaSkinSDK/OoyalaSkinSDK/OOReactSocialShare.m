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

static const NSString *Link = @"link";
static const NSString *ImgLink = @"imagelink";
static const NSString *Text = @"text";

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
        
        if (options[Link]){
            NSString *link = [RCTConvert NSString:options[@"link"]];
            [composeCtl addURL:[NSURL URLWithString:link]];
        }
        
        if (options[ImgLink]){
            NSString *imagelink = [RCTConvert NSString:options[@"imagelink"]];
            UIImage *image = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:imagelink]]];
            [composeCtl addImage:image];
        }
        
        if (options[Text]){
            NSString *text = [RCTConvert NSString:options[@"text"]];
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
