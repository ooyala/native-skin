//
//  OOOoyalaBottomTVBars.m
//  OoyalaTVSkinSDK
//
//  Created by Yi Gu on 7/21/16.
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOOoyalaTVBottomBars.h"
#import "OOOoyalaTVConstants.h"
#import "OOOoyalaTVBar.h"

@interface OOOoyalaTVBottomBars ()

@property (nonatomic, strong) OOOoyalaTVBar *durationBar;
@property (nonatomic, strong) OOOoyalaTVBar *progressBar;
@property (nonatomic, strong) OOOoyalaTVBar *bufferBar;

@end

@implementation OOOoyalaTVBottomBars

- (id)initWithBackground:(UIView *)background {
  self = [super init];
  
  if (self) {
    self.durationBar = [[OOOoyalaTVBar alloc] initWithFrame:CGRectMake(barX, background.bounds.size.height - bottomDistance - barHeight, background.bounds.size.width - barX - headDistance - labelWidth - componentSpace, barHeight)
                                                      color:[UIColor colorWithRed:153.0/255.0
                                                                            green:153.0/255.0
                                                                             blue:153.0/255.0
                                                                            alpha:0.3]];
    self.progressBar = [[OOOoyalaTVBar alloc] initWithFrame:CGRectMake(barX, background.bounds.size.height - bottomDistance - barHeight, 0, barHeight)
                                                      color:[UIColor colorWithRed:68.0/255.0
                                                                            green:138.0/255.0
                                                                             blue:225.0/255.0
                                                                            alpha:1.0]];
    self.bufferBar = [[OOOoyalaTVBar alloc] initWithFrame:CGRectMake(barX, background.bounds.size.height - bottomDistance - barHeight, 0, barHeight)
                                                    color:[UIColor colorWithRed:179.0/255.0
                                                                          green:179.0/255.0
                                                                           blue:179.0/255.0
                                                                          alpha:0.8]];
    
    [self addSubview:self.durationBar];
    [self addSubview:self.bufferBar];
    [self addSubview:self.progressBar];
  }
  
  return self;
}

- (void)updateBarBuffer:(CGFloat)bufferTime
               playhead:(CGFloat)playheadTime
               duration:(CGFloat)duration
            totalLength:(CGFloat)length {
  [self updateBar:self.bufferBar barTime:bufferTime duration:duration totalLength:length];
  [self updateBar:self.progressBar barTime:playheadTime duration:duration totalLength:length];
}

- (void)updateBar:(OOOoyalaTVBar *)bar
          barTime:(CGFloat)time
         duration:(CGFloat)duration
      totalLength:(CGFloat)length {
  if (bar && duration != 0) {
    CGRect frame = bar.frame;
    frame.size.width = (time / duration) * length;
    bar.frame = frame;
  }
}

@end
