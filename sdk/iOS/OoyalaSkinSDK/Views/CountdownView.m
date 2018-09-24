//
//  CountdownView.m
//  ReactNativeCountdownTimer
//
//  Created by Eric Vargas on 11/30/15.
//  Copyright © 2015 Ooyala. All rights reserved.
//

#import "CountdownView.h"

@interface CountdownView ()

@property (nonatomic) CAShapeLayer *circleLayer;
@property (nonatomic) UILabel *timerLabel;
@property (nonatomic) NSTimer *timer;
@property (nonatomic) BOOL canceled;
@property (nonatomic) float fontSize;

@end

@implementation CountdownView

- (instancetype)init {
  if (self = [super init]) {
    self.canceled = NO;
  }
  return self;
}

- (CAShapeLayer *)circleLayer {
  if (!_circleLayer) {
    _circleLayer = [CAShapeLayer new];
  }
  return _circleLayer;
}

- (UILabel *)timerLabel {
  if (!_timerLabel) {
    _timerLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, CGRectGetWidth(self.frame), CGRectGetHeight(self.frame))];
  }
  return _timerLabel;
}

- (void)setTime:(float)time {
  _time = time;
}

- (void)setAutomatic:(BOOL)automatic {
  _automatic = automatic;
  
  if (_automatic && !self.timer) {
    self.timer = [NSTimer scheduledTimerWithTimeInterval:0.1
                                                  target:self
                                                selector:@selector(updateTimer:)
                                                userInfo:nil
                                                 repeats:YES];
  }
}

- (void)setCanceled:(BOOL)canceled {
  _canceled = canceled;
  if (_canceled && self.timer) {
    [self removeCircleLayer];
    [self.timer invalidate];
  }
}

- (void)setTimeLeft:(float)timeLeft {
  _timeLeft = timeLeft;
  self.timerLabel.text = [NSString stringWithFormat:@"%.0f", _timeLeft];
  self.circleLayer.strokeEnd = (self.time - self.timeLeft) / self.time;
}

- (void)setFontSize:(float)fontSize {
  _fontSize = fontSize;
  self.timerLabel.font = [self.timerLabel.font fontWithSize:_fontSize];
}

- (void)setRadius:(CGFloat)radius {
  _radius = radius;
  self.fontSize = _radius <= 15 ? 10.0 : 14.0;
}

- (void)updateTimer:(NSTimer *)timer {
  if (self.timeLeft < 0.1) {
    self.timeLeft = 0;
    [self.timer invalidate];
    
    if (self.onTimerCompleted) {
      self.onTimerCompleted(@{@"timeLeft": @(self.timeLeft) });
    }
    return;
  }
  
  if (self.onTimerUpdate) {
    self.onTimerUpdate(@{@"timeLeft": @(self.timeLeft) });
  }
  
  self.timeLeft -= 0.1;
}

- (void)setFillAlpha:(float)fillAlpha {
  _fillAlpha = fillAlpha;
  self.circleLayer.fillColor = [self.fillColor colorWithAlphaComponent:_fillAlpha].CGColor;
}

- (void)setFillColor:(UIColor *)fillColor {
  _fillColor = fillColor;
  self.circleLayer.fillColor = [_fillColor colorWithAlphaComponent:self.fillAlpha].CGColor;
}

- (void)setStrokeColor:(UIColor *)strokeColor {
  _strokeColor = strokeColor;
  self.circleLayer.strokeColor = _strokeColor.CGColor;
}

- (void)configure {
  self.circleLayer.frame = self.bounds;
  self.circleLayer.lineWidth = 2;
  if (!self.circleLayer.superlayer) {
    [self.layer addSublayer:self.circleLayer];
  }
  
  [self configureTimerLabel];
}

- (void)configureTimerLabel {
  self.timerLabel.textColor = UIColor.whiteColor;
  self.timerLabel.textAlignment = NSTextAlignmentCenter;
  self.timerLabel.font = [UIFont fontWithName:@"Roboto-Regular" size:self.fontSize];
  self.timerLabel.translatesAutoresizingMaskIntoConstraints = NO;
  [self addSubview:self.timerLabel];
  
  [self addConstraint:[NSLayoutConstraint constraintWithItem:self
                                                   attribute:NSLayoutAttributeCenterX
                                                   relatedBy:NSLayoutRelationEqual
                                                      toItem:self.timerLabel
                                                   attribute:NSLayoutAttributeCenterX
                                                  multiplier:1.0
                                                    constant:0.0]];
  [self addConstraint:[NSLayoutConstraint constraintWithItem:self
                                                   attribute:NSLayoutAttributeCenterY
                                                   relatedBy:NSLayoutRelationEqual
                                                      toItem:self.timerLabel
                                                   attribute:NSLayoutAttributeCenterY
                                                  multiplier:1.0
                                                    constant:0.0]];
}

- (UIBezierPath *)circlePath {
  return [UIBezierPath bezierPathWithArcCenter:CGPointMake(self.radius, self.radius)
                                        radius:self.radius
                                    startAngle:(-M_PI/2)
                                      endAngle:(3*M_PI/2)
                                     clockwise:YES];
}

- (void)removeCircleLayer {
  [self.circleLayer removeAnimationForKey:@"strokeEnd"];
  [self.circleLayer removeFromSuperlayer];
  
  [self.timerLabel removeFromSuperview];
}

- (void)layoutSubviews {
  [self configure];
  self.circleLayer.path = [self circlePath].CGPath;
  [super layoutSubviews];
}

- (void)dealloc {
  [self.timer invalidate];
}

@end
