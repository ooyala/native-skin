/**
 * @file       OOReactBridge.m
 * @class      OOReactBridge OOReactBridge.m "OOReactBridge.m"
 * @brief      OOReactBridge
 * @details    OOReactBridge.h in OoyalaSDK
 * @date       4/2/15
 * @copyright Copyright (c) 2015 Ooyala, Inc. All rights reserved.
 */

#import "OOReactBridge.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTConvert.h"


#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOVideo.h>
#import <Social/Social.h>

@implementation OOReactBridge

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

static OOReactBridge *sharedInstance = nil;

/**
// !!!Warning: this object MUST be created by the react view
// otherwise it won't be properly initialized.
// ooyala code should ALWAYS call getInstance to access
// the singleton instant
//
*/
+ (id)allocWithZone:(NSZone *)zone
{
  if (sharedInstance != nil) {
    return nil;
  }

  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

+ (instancetype)getInstance {
  return sharedInstance;
}

RCT_EXPORT_METHOD(twitterShare:(NSDictionary *)options
                  callback: (RCTResponseSenderBlock)callback){
  if([SLComposeViewController isAvailableForServiceType:SLServiceTypeTwitter]) {
    NSString *serviceType = SLServiceTypeTwitter;
    SLComposeViewController *composeCtl = [SLComposeViewController composeViewControllerForServiceType:serviceType];
    
    if (options[@"link"]){
      NSString *link = [RCTConvert NSString:options[@"link"]];
      [composeCtl addURL:[NSURL URLWithString:link]];
    }
    
    if (options[@"imagelink"]){
      NSString *imagelink = [RCTConvert NSString:options[@"imagelink"]];
      UIImage *image = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:imagelink]]];
      [composeCtl addImage:image];
    }
    
    if (options[@"text"]){
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
    callback(@[@"Twitter not available"]);
  }
}



RCT_EXPORT_METHOD(onPress:(NSDictionary *)parameters) {
  NSString *buttonName = [parameters objectForKey:@"name"];
  if([buttonName isEqualToString:@"TwitterShare"]) {
    SLComposeViewController *tweetSheet = [SLComposeViewController composeViewControllerForServiceType:SLServiceTypeTwitter];
    [tweetSheet setInitialText:@"Tweeting from ReactNative :)"];
    UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [ctrl presentViewController:tweetSheet animated:YES completion:nil];
  }
  
  dispatch_async(dispatch_get_main_queue(), ^{
    if ([buttonName isEqualToString:@"PlayPause"]) {
      if (_player.state == OOOoyalaPlayerStatePlaying) {
        [_player pause];
      } else {
        [_player play];
      }
    }
  
  });
}

RCT_EXPORT_METHOD(onScrub:(NSDictionary *)parameters) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSNumber *position = [parameters objectForKey:@"percentage"];
    [_player seek:_player.duration * [position doubleValue]];
  });
}

+ (void)sendDeviceEventWithName:(NSString *)eventName body:(id)body {
  [[OOReactBridge getInstance].bridge.eventDispatcher sendDeviceEventWithName:eventName body:body];
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}


@end
