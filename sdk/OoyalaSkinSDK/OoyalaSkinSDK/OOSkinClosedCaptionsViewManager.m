//
//  OOSkinClosedCaptionsView_Manager.m
//  OoyalaSkinSDK
//

#import "OOSkinClosedCaptionsViewManager.h"
#import "OOSkinClosedCaptionsView.h"
#import <UIKit/UIKit.h>

@implementation OOSkinClosedCaptionsViewManager
RCT_EXPORT_MODULE()

- (UIView *)view
{
  OOSkinClosedCaptionsView *v = [OOSkinClosedCaptionsView new];
  v.layer.borderWidth = 3;
  v.layer.borderColor = [UIColor greenColor].CGColor;
  return v;
}
@end
