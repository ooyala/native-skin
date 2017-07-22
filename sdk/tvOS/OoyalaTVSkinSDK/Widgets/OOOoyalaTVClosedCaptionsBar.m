//
//  OOOoyalaTVClosedCaptionsBar.m
//  OoyalaTVSkinSDK
//
//  Created by Ileana Padilla on 7/18/17.
//  Copyright © 2017 ooyala. All rights reserved.
//

#import "OOOoyalaTVClosedCaptionsBar.h"
#import "OOOoyalaTVConstants.h"
#import "OOOoyalaTVBar.h"

@interface OOOoyalaTVClosedCaptionsBar ()

@property (nonatomic, strong) OOOoyalaTVBar *ccBar;
@property (nonatomic, strong) UILabel *ccLabel;

@end

@implementation OOOoyalaTVClosedCaptionsBar

- (id)initWithBackground:(UIView *)background {
    self = [super init];
    
    if (self) {
        self.ccBar = [[OOOoyalaTVBar alloc] initWithFrame:CGRectMake(0, background.bounds.size.height - barHeight*8, background.bounds.size.width , barHeight * 3)
                                                         color:[UIColor colorWithRed:153.0/255.0
                                                                               green:153.0/255.0
                                                                                blue:153.0/255.0
                                                                               alpha:0.0]];
        
        self.ccLabel = [[UILabel alloc] initWithFrame: CGRectMake(0, 0, background.bounds.size.width, barHeight * 3) ];
        self.ccLabel.textColor = [UIColor whiteColor];
        self.ccLabel.textAlignment = NSTextAlignmentCenter;
        self.ccLabel.font = [self.ccLabel.font fontWithSize:50.0];
        self.ccLabel.text = @"Lalalalalalalal";
        
        [self addSubview:self.ccBar];
        [self.ccBar addSubview:self.ccLabel];
    }
    
    return self;
}

- (void)removeClosedCaptionsBar {
    [self.ccBar removeFromSuperview];
}


@end
