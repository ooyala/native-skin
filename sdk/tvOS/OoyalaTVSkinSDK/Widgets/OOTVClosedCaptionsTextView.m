//
//  OOTVClosedCaptionsTextView.m
//  OoyalaTVSkinSDK
//
//  Copyright © 2017 ooyala. All rights reserved.
//

#import "OOTVClosedCaptionsTextView.h"


static CGFloat arbitraryScalingFactor = 1.2;

@implementation OOTVClosedCaptionsTextView

#pragma mark - Initialization

- (id)initWithFrame:(CGRect)frame style:(OOClosedCaptionsStyle *)style backgroundView:(OOTVClosedCaptionsTextBackgroundView *)backgroundView {
  self = [super initWithFrame:frame];
  
  // Disable scroll and set the content off to be zero so that when the container will not
  //  scroll if we have some text out of the window.
  [self setContentOffset:CGPointZero animated:NO];
  [self setScrollEnabled:NO];
  
  self.style = style;
  self.backgroundView = backgroundView;
  
  [self setFont:style.textFontName frame:frame baseFontSize:style.textSize];
  
  [self setTextColor:style.textColor];
  
  self.alpha = style.textOpacity;
  self.textSize = style.textSize;
  //self.editable = NO;
  self.userInteractionEnabled = NO;
  // This is important!!!! make sure shadow can be shown
  self.backgroundColor = [UIColor clearColor];
  if (style.presentation != OOClosedCaptionPaintOn) {
    self.textAlignment = NSTextAlignmentCenter;
  }
  if (&MACaptionAppearanceCopyForegroundColor) {
    // Settings for text edge style
    if (style.edgeStyle == kMACaptionAppearanceTextEdgeStyleUniform) {
      self.edgeStyle = kMACaptionAppearanceTextEdgeStyleUniform;
    } else if (style.edgeStyle != kMACaptionAppearanceTextEdgeStyleNone && style.edgeStyle != kMACaptionAppearanceTextEdgeStyleUndefined) {
      self.layer.shadowColor = [[UIColor blackColor] CGColor];
      self.layer.shadowOpacity = 1.0f;
      self.layer.shadowRadius = 1.0f;
      if (style.edgeStyle == kMACaptionAppearanceTextEdgeStyleDropShadow) {
        self.layer.shadowOffset = CGSizeMake(0.0f, 0.0f);
        backgroundView.shadowOffset = CGSizeMake(0.0f, 0.0f);
        backgroundView.shadowOpacity = 0.8;
      } else if (style.edgeStyle == kMACaptionAppearanceTextEdgeStyleDepressed) {
        self.layer.shadowOffset = CGSizeMake(4.0f, -4.0f);
        backgroundView.shadowOffset = CGSizeMake(4.0f, -4.0f);
        backgroundView.shadowOpacity = 0.8;
      } else if (style.edgeStyle == kMACaptionAppearanceTextEdgeStyleRaised) {
        self.layer.shadowOffset = CGSizeMake(-4.0f, 4.0f);
        backgroundView.shadowOffset = CGSizeMake(-4.0f, 4.0f);
        backgroundView.shadowOpacity = 0.8;
      }
    }
  }
  return self;
}

#pragma mark - Public functions

/**
 * Add scaling based on video view size when compared to portrait width
 * Captions show up with "default" size when the width of the player is the portrait width
 * When the width of the player is larger or smaller, we will scale the captions accordingly
 */
- (void)setFont:(NSString *)fontName frame:(CGRect)frame baseFontSize:(CGFloat)fontSize {
  CGSize mainBoundsSize = [UIScreen mainScreen].bounds.size;
  CGFloat portraitWidth = mainBoundsSize.width > mainBoundsSize.height ? mainBoundsSize.height : mainBoundsSize.width;
  CGFloat scalingFactor = frame.size.width / portraitWidth;
  [self setFont:[UIFont fontWithName:fontName size:fontSize * scalingFactor*arbitraryScalingFactor]];
}

- (void)setText:(NSString *)text {
  // Make sure each text are split correctly before adding to UITextView
  self.nextText = text;
  
  if (&MACaptionAppearanceCopyForegroundColor && self.edgeStyle == kMACaptionAppearanceTextEdgeStyleUniform) {
    [self setNeedsDisplay];
  }
  [super setText:text];
}

- (NSArray *)getRectsForEachLine:(NSArray *)separatedLines {
  NSMutableArray* textRects = [[NSMutableArray alloc] init];
  UITextPosition *beginning = self.beginningOfDocument;
  NSUInteger startPostition = 0;
  for (NSString* line in separatedLines) {
    NSRange range = NSMakeRange(startPostition, line.length);
    UITextPosition *start = [self positionFromPosition:beginning offset:(NSInteger)range.location];
    UITextPosition *end = [self positionFromPosition:start offset:(NSInteger)range.length];
    UITextRange *textRange = [self textRangeFromPosition:start toPosition:end];
    CGRect textRect = [self firstRectForRange:textRange];
    
    // The +0.5 in textRect.origin.y is for match the outline better with text. maybe changed with font size
    CGRect newTextRect = CGRectMake(textRect.origin.x, textRect.origin.y + 1.5, textRect.size.width, textRect.size.height);
    [textRects addObject:[NSValue valueWithCGRect:newTextRect]];
    startPostition += line.length + 1;
  }
  return [textRects copy];
}

@end
