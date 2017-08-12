//
//  OOOoyalaTVTopBar.m
//  OoyalaTVSkinSDK
//
//  Created by Ileana Padilla on 7/18/17.
//  Copyright © 2017 ooyala. All rights reserved.
//

#import "OOOoyalaTVTopBar.h"
#import "OOOoyalaTVConstants.h"
#import "OOOoyalaTVBar.h"

@interface OOOoyalaTVTopBar ()

@property (nonatomic, strong) OOOoyalaTVBar *optionsBar;
@property (nonatomic, strong) UILabel *optionsTitle;

@end

@implementation OOOoyalaTVTopBar

- (id)initWithBackground:(UIView *)background {
    self = [super init];
    
    if (self) {
        self.optionsBar = [[OOOoyalaTVBar alloc] initWithFrame:CGRectMake(background.bounds.size.width - ccWidth - componentSpace * 4, componentSpace * 4, ccWidth , ccHeight)
                                                          color:[UIColor colorWithRed:153.0/255.0
                                                                                green:153.0/255.0
                                                                                 blue:153.0/255.0
                                                                                alpha:0.7]];
        self.optionsTitle = [[UILabel alloc] initWithFrame: CGRectMake(0, 0, ccWidth * 0.92, componentSpace * 4) ];
        self.optionsTitle.textColor = [UIColor whiteColor];
        self.optionsTitle.textAlignment = NSTextAlignmentRight;
        self.optionsTitle.font = [self.optionsTitle.font fontWithSize:40.0];
        self.optionsTitle.text = @"CC";
        
        self.layer.cornerRadius = cornerRadius;
        
        [self addSubview:self.optionsBar];
        [self.optionsBar addSubview:self.optionsTitle];
        self.optionsBar.backgroundColor = [UIColor colorWithRed:153.0/255.0
                                                                green:153.0/255.0
                                                                 blue:153.0/255.0
                                                                alpha:0.7];
    }
    
    return self;
}

- (id)initMiniView:(UIView *)background {
    self = [super init];
    
    if (self) {
        self.optionsBar = [[OOOoyalaTVBar alloc] initWithFrame:CGRectMake(background.bounds.size.width - ccWidth/4 - componentSpace * 4, componentSpace * 4, ccWidth/4 , componentSpace * 4)
                                                         color:[UIColor colorWithRed:153.0/255.0
                                                                               green:153.0/255.0
                                                                                blue:153.0/255.0
                                                                               alpha:0.7]];
        self.optionsTitle = [[UILabel alloc] initWithFrame: CGRectMake(0, 0, ccWidth * 0.25, componentSpace * 4) ];
        self.optionsTitle.textColor = [UIColor whiteColor];
        self.optionsTitle.textAlignment = NSTextAlignmentCenter;
        self.optionsTitle.font = [self.optionsTitle.font fontWithSize:40.0];
        self.optionsTitle.text = @"CC";
        
        self.layer.cornerRadius = cornerRadius;
        
        [self addSubview:self.optionsBar];
        [self.optionsBar addSubview:self.optionsTitle];
        self.optionsBar.backgroundColor = [UIColor clearColor];
        self.optionsBar.layer.borderWidth = 2;
        self.optionsBar.layer.borderColor = [UIColor colorWithRed:153.0/255.0
                                                                green:153.0/255.0
                                                                 blue:153.0/255.0
                                                                alpha:0.7].CGColor;
    }
    
    return self;
}

- (void)removeTopBar {
    [self.optionsBar removeFromSuperview];
}

- (void)addLenguages:(UIView *)view {
    [self.optionsBar addSubview:view];
}

- (BOOL)canBecomeFocused {
    return YES;
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
    
    if (self == context.nextFocusedView) {
        [coordinator addCoordinatedAnimations:^{
            // focusing animations
        } completion:^{
            // completion
        }];
    } else if (self == context.previouslyFocusedView) {
        [coordinator addCoordinatedAnimations:^{
            // unfocusing animations
        } completion:^{
            // completion
        }];
    }
}


@end
