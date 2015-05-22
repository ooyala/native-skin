//
//  OOSkinClosedCaptionsView.m
//  OoyalaSkinSDK
//

#import "OOSkinClosedCaptionsView.h"
#import <OoyalaSDK/OOClosedCaptionsView.h>
#import <OoyalaSDK/OOCaption.h>
#import <OoyalaSDK/OOClosedCaptionsStyle.h>

@interface OOSkinClosedCaptionsView()
@property (nonatomic) OOClosedCaptionsView *ccView;
@end

@implementation OOSkinClosedCaptionsView

-(instancetype) init {
  self = [super init];
  if( self ) {
    _ccView = [OOClosedCaptionsView new];
    _ccView.caption = [[OOCaption alloc] initWithBegin:0 end:MAXFLOAT text:@"TESTING 1, 2, 3!"];
  }
  return self;
}

@end
