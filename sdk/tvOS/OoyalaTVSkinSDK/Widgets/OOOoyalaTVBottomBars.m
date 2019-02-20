//
//  OOOoyalaBottomTVBars.m
//  OoyalaTVSkinSDK
//
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOOoyalaTVBottomBars.h"
#import "OOOoyalaTVConstants.h"
#import "OOOoyalaTVBar.h"

@interface OOOoyalaTVBottomBars ()

@property (nonatomic) OOOoyalaTVBar *durationBar;
@property (nonatomic) OOOoyalaTVBar *progressBar;
@property (nonatomic) OOOoyalaTVBar *bufferBar;
@property (nonatomic) UILabel *closedCaptions;

@end

@implementation OOOoyalaTVBottomBars

#pragma mark - Initialization

- (instancetype)initWithBackground:(UIView *)background
                     withTintColor:(UIColor *)tintColor {
  if (self = [super init]) {
    // Duration bar
    CGFloat durationBarX = barX;
    CGFloat durationBarY = background.bounds.size.height - bottomDistance - barHeight;
    CGFloat durationBarWidth = background.bounds.size.width - barX - headDistance - labelWidth - componentSpace;
    CGFloat durationBarHeight = barHeight;
    CGRect durationBarFrame = CGRectMake(durationBarX, durationBarY, durationBarWidth, durationBarHeight);
    UIColor *durationBarBackgroundColor = [UIColor colorWithRed:153.0 / 255.0
                                                          green:153.0 / 255.0
                                                           blue:153.0 / 255.0
                                                          alpha:0.3];
    
    _durationBar = [[OOOoyalaTVBar alloc] initWithFrame:durationBarFrame
                                                  color:durationBarBackgroundColor];

    // Progress bar
    CGFloat progressBarX = barX;
    CGFloat progressBarY = background.bounds.size.height - bottomDistance - barHeight;
    CGFloat progressBarWidth = 0;
    CGFloat progressBarHeight = barHeight;
    CGRect progressBarFrame = CGRectMake(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
    UIColor *progressBarBackgroundColor = [UIColor colorWithRed:68.0 / 255.0
                                                          green:138.0 / 255.0
                                                           blue:225.0 / 255.0
                                                          alpha:1.0];
    
    _progressBar = [[OOOoyalaTVBar alloc] initWithFrame:progressBarFrame
                                                  color:tintColor ? tintColor : progressBarBackgroundColor];
    
    // Buffer bar
    CGFloat bufferBarX = barX;
    CGFloat bufferBarY = background.bounds.size.height - bottomDistance - barHeight;
    CGFloat bufferBarWidth = 0;
    CGFloat bufferBarHeight = barHeight;
    CGRect bufferBarFrame = CGRectMake(bufferBarX, bufferBarY, bufferBarWidth, bufferBarHeight);
    UIColor *bufferBarBackgroundColor = [UIColor colorWithRed:179.0 / 255.0
                                                        green:179.0 / 255.0
                                                         blue:179.0 / 255.0
                                                        alpha:0.8];
    
    _bufferBar = [[OOOoyalaTVBar alloc] initWithFrame:bufferBarFrame
                                                color:bufferBarBackgroundColor];
    
    [self addSubview:self.durationBar];
    [self addSubview:self.bufferBar];
    [self addSubview:self.progressBar];
  }
  
  return self;
}

#pragma mark - Public functions

- (void)updateBarBuffer:(CGFloat)bufferTime
               playhead:(CGFloat)playheadTime
               duration:(CGFloat)duration
            totalLength:(CGFloat)length {
  
  [self updateBar:self.bufferBar barTime:bufferTime duration:duration totalLength:length];
  [self updateBar:self.progressBar barTime:playheadTime duration:duration totalLength:length];
}

- (void)updateProgressBarTime:(CGFloat)time
         duration:(CGFloat)duration
      totalLength:(CGFloat)length {
  [self updateBar:self.progressBar barTime:time duration:duration totalLength:length];
}

#pragma mark - Private functions

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
