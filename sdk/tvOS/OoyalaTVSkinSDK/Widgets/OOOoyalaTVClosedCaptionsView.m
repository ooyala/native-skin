/**
 * @file       OOClosedCaptionsView.m
 * @brief      Implementation of OOClosedCaptionsView
 * @details    OOClosedCaptionsView.m in OoyalaSDK
 * @date       1/6/12
 * @copyright Copyright (c) 2015 Ooyala, Inc. All rights reserved.
 */

#import "OOOoyalaTVClosedCaptionsView.h"
#import "OoyalaSDK/OOCaption.h"
#import "OoyalaSDK/OOClosedCaptionsStyle.h"
#import "OOOoyalaTVClosedCaptionsLabel.h"
#import <CoreText/CoreText.h>
static CGFloat arbitraryScalingFactor = 1.2;


@interface OOClosedCaptionsTextBackgroundView : UIView
@property (nonatomic, strong) NSMutableArray* textRects;
@property (nonatomic, strong) UIColor *highlightColor;
@property (nonatomic) CGFloat highlightOpacity;
@property (nonatomic) CGSize shadowOffset;
@property (nonatomic) CGFloat shadowOpacity;
@end

@implementation OOClosedCaptionsTextBackgroundView


-(id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        self.shadowOffset = CGSizeMake(0, 0);
        self.shadowOpacity = 0;
        self.highlightColor = [UIColor clearColor];
        self.highlightOpacity = 0;
    }
    return self;
}


-(void)updateBackground {
    [self setNeedsDisplay];
}

// Draw highlight for OOClosedCaptionsTextView
-(void)drawRect:(CGRect)rect {
    // It works but there is overlap between each highlight
    [super drawRect:rect];
    
    // The original textRects has 2 px vertical overlap which can be seen on transparent highlight
    // Recalculate the highlightRects
    NSMutableArray* highlightRects = [[NSMutableArray alloc] init];
    CGFloat nextY = [[self.textRects objectAtIndex:0] CGRectValue].origin.y;
    for (int i = 0; i < [self.textRects count]; i++) {
        CGRect textRect = [[self.textRects objectAtIndex:i] CGRectValue];
        CGRect highlightRect = CGRectMake(textRect.origin.x, nextY, textRect.size.width, textRect.size.height);
        [highlightRects addObject:[NSValue valueWithCGRect:highlightRect]];
        nextY = highlightRect.origin.y + highlightRect.size.height;
    }
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGFloat shadowColorValues[] = {0, 0, 0, self.shadowOpacity};
    CGColorSpaceRef ShadowColorSpace = CGColorSpaceCreateDeviceRGB();
    CGColorRef shadowColor = CGColorCreate(ShadowColorSpace, shadowColorValues);
    
    CGContextSaveGState(context);
    CGContextSetShadowWithColor(context, self.shadowOffset, 5, shadowColor);
    
    
    const CGFloat* colors = CGColorGetComponents(self.highlightColor.CGColor);
    for (int i = 0; i < [highlightRects count]; i++) {
        CGRect rectangle = [[highlightRects objectAtIndex:i] CGRectValue];
        CGContextRef context = UIGraphicsGetCurrentContext();
        CGContextSetRGBFillColor(context, colors[0], colors[1], colors[2], self.highlightOpacity);
        CGContextSetRGBStrokeColor(context, 1.0, 1.0, 1.0, 0.5);
        CGContextFillRect(context, rectangle);
    }
    
    CGColorRelease(shadowColor);
    CGColorSpaceRelease(ShadowColorSpace);
    
    CGContextRestoreGState(context);
    
}

@end


@interface OOClosedCaptionsTextView : UITextView
@property (nonatomic, strong) NSString* nextText;
@property (nonatomic) MACaptionAppearanceTextEdgeStyle edgeStyle;
@property (nonatomic) CGFloat textSize;
@property (nonatomic, strong) OOClosedCaptionsTextBackgroundView* backgroundView;
@property (nonatomic, strong) NSMutableArray* resultLines;
@property (nonatomic, strong) OOClosedCaptionsStyle* style;
@end

@implementation OOClosedCaptionsTextView

-(id) initWithFrame:(CGRect)frame style:(OOClosedCaptionsStyle*) style backgroundView:(OOClosedCaptionsTextBackgroundView*) backgroundView{
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

/**
 * Add scaling based on video view size when compared to portrait width
 * Captions show up with "default" size when the width of the player is the portrait width
 * When the width of the player is larger or smaller, we will scale the captions accordingly
 */
-(void) setFont:(NSString *)fontName frame:(CGRect)frame baseFontSize:(CGFloat)fontSize {
    CGSize mainBoundsSize = [UIScreen mainScreen].bounds.size;
    CGFloat portraitWidth = mainBoundsSize.width > mainBoundsSize.height ? mainBoundsSize.height : mainBoundsSize.width;
    CGFloat scalingFactor = frame.size.width / portraitWidth;
    [self setFont:[UIFont fontWithName:fontName size:fontSize * scalingFactor*arbitraryScalingFactor]];
}

-(void) setText:(NSString *)text {
    // Make sure each text are split correctly before adding to UITextView
    self.nextText = text;
    
    if (&MACaptionAppearanceCopyForegroundColor && self.edgeStyle == kMACaptionAppearanceTextEdgeStyleUniform) {
        [self setNeedsDisplay];
    }
    [super setText:text];
}

// Draw outline for paint-on and pop-on presentation
- (void)drawRect:(CGRect)rect
{
    if (&MACaptionAppearanceCopyForegroundColor && self.edgeStyle == kMACaptionAppearanceTextEdgeStyleUniform) {
        // The presentation style can be changed before these threads finish
        if (self.style.presentation == OOClosedCaptionRollUp) {
            return;
        }
        
        CGContextRef textContext = UIGraphicsGetCurrentContext();
        CGContextSaveGState(textContext);
        CGContextSetLineWidth(textContext, self.textSize * 0.05);
        CGContextSetTextDrawingMode (textContext, kCGTextFillStroke);
        CGContextSetFillColorWithColor(textContext, [UIColor blackColor].CGColor);
        
        NSMutableParagraphStyle *paragraphStyle = [[NSParagraphStyle defaultParagraphStyle] mutableCopy];
        paragraphStyle.lineBreakMode = NSLineBreakByWordWrapping;
        paragraphStyle.alignment = NSTextAlignmentLeft;
        
        NSArray* separatedLines = [self.nextText componentsSeparatedByString:@"\n"];
        NSMutableArray* textRects = [[NSMutableArray alloc] init];
        textRects = [self getRectsForEachLine:separatedLines];
        for (int i = 0; i < [textRects count]; i++) {
            [[separatedLines objectAtIndex:i] drawInRect:[[textRects objectAtIndex:i] CGRectValue]
                                          withAttributes:@{NSFontAttributeName: self.font,
                                                           NSParagraphStyleAttributeName: paragraphStyle}];
        }
        CGContextRestoreGState(textContext);
    }
}

-(NSMutableArray*)getRectsForEachLine:(NSArray*)separatedLines {
    NSMutableArray* textRects = [[NSMutableArray alloc] init];
    UITextPosition *beginning = self.beginningOfDocument;
    NSUInteger startPostition = 0;
    for (NSString* line in separatedLines) {
        NSRange range = NSMakeRange(startPostition, line.length);
        UITextPosition *start = [self positionFromPosition:beginning offset:range.location];
        UITextPosition *end = [self positionFromPosition:start offset:range.length];
        UITextRange *textRange = [self textRangeFromPosition:start toPosition:end];
        CGRect textRect = [self firstRectForRange:textRange];
        
        // The +0.5 in textRect.origin.y is for match the outline better with text. maybe changed with font size
        CGRect newTextRect = CGRectMake(textRect.origin.x, textRect.origin.y + 1.5, textRect.size.width, textRect.size.height);
        [textRects addObject:[NSValue valueWithCGRect:newTextRect]];
        startPostition += line.length + 1;
    }
    return textRects;
}
@end


@interface OOOoyalaTVClosedCaptionsView()
@property (nonatomic, strong) OOClosedCaptionsTextView* textView;
@property (nonatomic, strong) OOClosedCaptionsTextBackgroundView* backgroundView;
@property (nonatomic, strong) NSString* splitText;
@property (nonatomic) CGFloat textViewEdge; // The space between bottom of textview and bottom of the parent view
@property (nonatomic, strong) NSString* currentText;
@property (nonatomic) BOOL stopPainting;
@end

@implementation OOOoyalaTVClosedCaptionsView

+ (void) setArbitararyScalingFactor:(CGFloat)scalingFactor {
    arbitraryScalingFactor = scalingFactor;
}

- (id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    [self setBackgroundColor:[UIColor clearColor]];
    [self setContentMode:UIViewContentModeScaleAspectFill];
    [self setAutoresizingMask:UIViewAutoresizingFlexibleTopMargin|UIViewAutoresizingFlexibleBottomMargin|UIViewAutoresizingFlexibleLeftMargin|UIViewAutoresizingFlexibleRightMargin];
    self.textViewEdge = 10;
    return self;
}

- (OOCaption *)caption {
    return caption;
}

- (void)setCaption:(OOCaption *)_caption {
    caption = _caption;
    [self setNeedsDisplay];
}

- (OOClosedCaptionsStyle *)style {
    return style;
}

- (void)setStyle:(OOClosedCaptionsStyle *)_style {
    style = _style;
    for (UIView *subview in self.textView.subviews) {
        [subview removeFromSuperview];
    }
    [self.textView removeFromSuperview];
    self.textView = nil;
    
    if (self.backgroundView != nil) {
        self.backgroundView.hidden = YES;
        [self.backgroundView removeFromSuperview];
        self.backgroundView = nil;
    }
    
    CGFloat height = self.style.textSize * 6;
    CGRect frame = CGRectMake(.1 * self.bounds.size.width, self.frame.size.height - height - self.textViewEdge, .8 * self.bounds.size.width, height);
    // When showing shadow in UITextView the background of UITextView itself has to have clearColor.
    // Add this backgroundView as real background
    self.backgroundView = [[OOClosedCaptionsTextBackgroundView alloc] initWithFrame:frame];
    self.backgroundView.autoresizingMask = UIViewAutoresizingFlexibleTopMargin|UIViewAutoresizingFlexibleLeftMargin|UIViewAutoresizingFlexibleRightMargin;
    
    // For classic style setting in device we should take style.backgroundOpacity
    // For other settings we should take style.windowOpacity
    // This could be a problem of
    self.backgroundView.backgroundColor = style.windowColor;
    self.backgroundView.highlightOpacity = style.backgroundOpacity;
    self.backgroundView.highlightColor = style.backgroundColor;
    
    self.backgroundView.alpha = fmax(style.backgroundOpacity, style.windowOpacity);
    
    self.backgroundView.hidden = YES;
    self.backgroundView.layer.cornerRadius = 10;
    self.backgroundView.layer.masksToBounds = YES;
    
    // setup UITextView according to style
    self.textView = [[OOClosedCaptionsTextView alloc] initWithFrame:frame style:_style backgroundView:self.backgroundView];
    self.textView.autoresizingMask = UIViewAutoresizingFlexibleTopMargin|UIViewAutoresizingFlexibleLeftMargin|UIViewAutoresizingFlexibleRightMargin;
    
    [self addSubview:self.backgroundView];
    [self addSubview:self.textView];
    
    [self setNeedsDisplay];
}

- (void)drawRect:(CGRect)rect {
    //do not draw if no text
    if (self.caption.text == nil) {
        self.textView.hidden = YES;
        self.backgroundView.hidden = YES;
        return;
    }
    
    if (self.textView.hidden || self.backgroundView.hidden) {
        self.textView.hidden = NO;
        self.backgroundView.hidden = NO;
    }
    
    
    if (self.style.presentation == OOClosedCaptionPaintOn) {
        // During paint-on presentation if the textview changes position then all the text will be redraw which will cause problem
        // So after shifting the textview we just pop-on all the text at once and start paint-on for next caption.text
        // However, those threads do not finished before we pop-on the text, there will be some text drawn by threads append after existing text.
        // To resolve this problem, after pop-on the text I set self.stopPainting = YES so that the thread will not draw any character for this
        // caption.text. And set self.stopPainting = NO after all threads finish.
        if (![self.currentText isEqualToString:caption.text]) {
            self.stopPainting = NO;
            self.currentText = caption.text;
            [self matchFrameWithText];
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0),
                           ^{
                               // characterDelay may be need to update based on length of sentence.
                               [self paintOn:self.splitText characterDelay:fmin(0.03, (((caption.end - caption.begin) / [caption.text length])) * 2 / 3)];
                           });
        } else {
            self.stopPainting = YES;
            [self matchFrameWithText];
            [self.textView setText:self.splitText];
        }
    } else if (self.style.presentation == OOClosedCaptionRollUp) {
        // RollUp has fixed window size for each font size so do not need match frame everytime
        CGFloat height = self.style.textSize * 6;
        CGRect frame = CGRectMake(.1 * self.bounds.size.width, self.frame.size.height - height - self.textViewEdge, .8 * self.bounds.size.width, height);
        self.textView.frame = frame;
        self.backgroundView.frame = frame;
        [self rollUp:caption.text];
    } else {
        // ClosedCaptionPopOn
        [self matchFrameWithText];
    }
    // update highlight
    self.backgroundView.textRects = [self.textView getRectsForEachLine:[self.splitText componentsSeparatedByString:@"\n"]];
    [self.backgroundView updateBackground];
}

// Set UITextView frame based on current closed caption text size
// This is for both pop-on and paint-on
- (void)matchFrameWithText {
    
    // Set maxWidth based on the self.frame (the passed frame in init function is the frame of player)
    CGFloat maxWidth = 0.0;
    maxWidth = self.frame.size.width * 0.9;
    
    
    [self.textView setFont:style.textFontName frame:self.frame  baseFontSize:style.textSize];
    
    // Find the longest line in current closed caption
    NSArray* lines = [caption.text componentsSeparatedByString:@"\n"];
    CGSize maxLineSize = CGSizeMake(0, 0);
    for (NSString* line in lines) {
        CGSize size = [line sizeWithAttributes:@{NSFontAttributeName: self.textView.font}];
        if (size.width > maxLineSize.width) {
            maxLineSize = size;
            if (maxLineSize.width > maxWidth) {
                break;
            }
        }
    }
    
    CGFloat frameWidth = maxWidth;
    if (maxWidth > maxLineSize.width) {
        frameWidth = maxLineSize.width;
    }
    
    // Calculate height of the frame based on the width calculated above
    NSMutableString* resultText = [[NSMutableString alloc] init];
    NSInteger lineCount = [lines count];
    
    // Need to split some lines if those lines are longer than the maxWidth
    if (maxLineSize.width >= maxWidth) {
        NSInteger currentLineNum = 0;
        for (NSString* line in lines) {
            currentLineNum++;
            NSMutableString* temp = [NSMutableString stringWithString:line];
            
            // Find the last whitespace before exceeding maxWidth and insert a new line char there to split that line
            int prevWhitespaceIndex = 0;
            for (int i = 0; i < [line length]; i++) {
                char currentChar = [line characterAtIndex:i];
                CGSize subStringSize = [[line substringToIndex:i] sizeWithAttributes:@{NSFontAttributeName: self.textView.font}];
                if (subStringSize.width > frameWidth) {
                    // Insert a newline char in previous index of whitespace to split current line into two lines
                    [temp insertString:@"\n" atIndex:prevWhitespaceIndex];
                    lineCount++;
                    break;
                }
                if (currentChar == ' ') {
                    prevWhitespaceIndex = i;
                }
            }
            
            // Reconstruct a new closed caption text with split lines
            if (currentLineNum == [lines count]) {
                if (temp != nil) {
                    [resultText appendString: temp];
                }
            } else {
                if ([NSString stringWithFormat: @"%@\n", temp] != nil) {
                    [resultText appendString: [NSString stringWithFormat: @"%@\n", temp]];
                }
            }
        }
    } else {
        if (caption.text != nil) {
            [resultText appendString: caption.text];
        }
    }
    // If the presentation is PaintOn then the text should be added one by one later in different threads.
    if (style.presentation != OOClosedCaptionPaintOn) {
        [self.textView setText:resultText];
    } else {
        [self.textView setText:@""]; // clean the layer before next text
    }
    
    frameWidth *= 1.1; // text padding
    frameWidth += 16;
    CGSize newSize = [self.textView sizeThatFits:CGSizeMake(frameWidth, MAXFLOAT)];
    CGRect newFrame = self.textView.frame;
    
    CGFloat linePadding = 10;
    newFrame.size = CGSizeMake(fmaxf(newSize.width, frameWidth), (maxLineSize.height + linePadding) * lineCount);
    
    CGFloat originalX = (self.frame.size.width - newFrame.size.width) / 2   ;
    self.textView.frame = CGRectMake(originalX, self.frame.size.height - newFrame.size.height - self.textViewEdge, frameWidth, (linePadding * 2 + maxLineSize.height * lineCount));
    
    if (style.presentation == OOClosedCaptionPopOn) {
        self.textView.textAlignment = NSTextAlignmentCenter;
    }
    self.backgroundView.frame = self.textView.frame;
    self.splitText = resultText;
}

- (void)rollUp: (NSString*)text {
    
    // Calculate the correct offset with this fake UITextView
    UITextView* temp = [[UITextView alloc] initWithFrame:self.textView.frame];
    [temp setFont:self.textView.font];
    
    // Remove all but the visible caption
    int totalHeight = 0;
    CGRect firstFrame = CGRectNull;
    for (UILabel* label in self.textView.subviews) {
        if ([self.textView.subviews count] > 1) {
            [label removeFromSuperview];
            continue;
        }
        
        // Save the last subview to re-draw it later
        if (CGRectIsNull(firstFrame)) {
            firstFrame = label.frame;
        }
        label.frame = CGRectMake((self.textView.frame.size.width - label.frame.size.width)/2, totalHeight, label.frame.size.width, label.frame.size.height);
        totalHeight += label.frame.size.height;
    }
    
    // Create UILabel to hold the text
    OOOoyalaTVClosedCaptionsLabel* textLabel = [[OOOoyalaTVClosedCaptionsLabel alloc] initWithFrame:CGRectMake(0, totalHeight, self.textView.frame.size.width, self.textView.frame.size.height)
                                                                      isUniformEdge: &MACaptionAppearanceCopyForegroundColor && self.textView.edgeStyle == kMACaptionAppearanceTextEdgeStyleUniform];
    
    // Make sure we can add multiple lines to a UILabel
    textLabel.lineBreakMode = NSLineBreakByWordWrapping;
    textLabel.numberOfLines = 0;
    
    [textLabel setText:text];
    textLabel.textColor = self.style.textColor;
    textLabel.backgroundColor = [UIColor clearColor];
    textLabel.font = [UIFont fontWithName:self.style.textFontName size:style.textSize];
    
    [self.textView addSubview:textLabel];
    
    // After adding the subview, move the scrollview so the first frame goes off the screen
    [UIView animateWithDuration: (self.caption.end - self.caption.begin) * 0.3
                     animations:^(void) {
                         self.textView.contentOffset = CGPointMake(0, (firstFrame.size.height));
                     }
                     completion: ^(BOOL finished) {}];
}

- (void)paintOn:(NSString*)text characterDelay:(NSTimeInterval)delay {
    for (int i=0; i<text.length; i++) {
        if (!self.stopPainting && [text isEqualToString:self.splitText]) {
            dispatch_async(dispatch_get_main_queue(),
                           ^{
                               // The presentation style can be changed before these threads finish
                               if (style.presentation == OOClosedCaptionRollUp || style.presentation == OOClosedCaptionPopOn) {
                                   return;
                               }
                               if (i == 0) {
                                   // Make sure each closed caption be on the top of UITextView
                                   [self.textView setText:@""];
                               }
                               [self.textView setText:[NSString stringWithFormat:@"%@%C", self.textView.text, [text characterAtIndex:i]]];
                           });
            [NSThread sleepForTimeInterval:delay];
        }
    }
}

// Update textView frame for rotation
-(void) layoutSubviews {
    [super layoutSubviews];
    
    // Relayout the frame for roll-up
    if (self.style.presentation == OOClosedCaptionRollUp) {
        CGFloat height = self.style.textSize * 6;
        CGRect frame = CGRectMake(.1 * self.bounds.size.width, self.frame.size.height - height - self.textViewEdge, .8 * self.bounds.size.width, height);
        self.textView.frame = frame;
        self.backgroundView.frame = frame;
        
        // Remove all but the visible caption
        int totalHeight = 0;
        CGRect firstFrame = CGRectNull;
        for (UILabel* label in self.textView.subviews) {
            if ([self.textView.subviews count] > 1) {
                [label removeFromSuperview];
                continue;
            }
            
            // Save the last subview to re-draw it later
            if (CGRectIsNull(firstFrame)) {
                firstFrame = label.frame;
            }
            label.frame = CGRectMake((self.textView.frame.size.width - label.frame.size.width)/2, totalHeight, label.frame.size.width, label.frame.size.height);
            totalHeight += label.frame.size.height;
        }
        
        self.textView.contentOffset = CGPointMake(0, 0);
    }
    
    [self matchFrameWithText];
}

@end
