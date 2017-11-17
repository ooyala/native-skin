#import <OOOoyalaTVTopBar.h>
#import <OOOoyalaTVConstants.h>
#import <OOOoyalaTVBar.h>

@interface OOOoyalaTVTopBar ()

@property (nonatomic, strong) OOOoyalaTVBar *optionsBar;
@property (nonatomic, strong) UILabel *optionsTitle;

@end

@implementation OOOoyalaTVTopBar

- (OOOoyalaTVTopBar *)initWithBackground:(UIView *)background {
    self = [super init];
    
    if (self) {
        CGRect barFrame = CGRectMake(background.bounds.size.width - ccWidth - componentSpace * 4, componentSpace * 4, ccWidth , ccHeight);
        CGRect titleFrame = CGRectMake(0, 0, ccWidth * 0.92, componentSpace * 4);
        [self initSubviews:barFrame :titleFrame];
        self.optionsBar.backgroundColor = [UIColor colorWithRed:153.0/255.0
                                                          green:153.0/255.0
                                                           blue:153.0/255.0
                                                          alpha:0.7];
    }
    
    return self;
}

- (OOOoyalaTVTopBar *)initMiniView:(UIView *)background {
    self = [super init];
    
    if (self) {
        CGRect barFrame = CGRectMake(background.bounds.size.width - ccWidth/4 - componentSpace * 4, componentSpace * 4, ccWidth/4 , componentSpace * 4);
        CGRect titleFrame = CGRectMake(0, 0, ccWidth * 0.25, componentSpace * 4);
        [self initSubviews:barFrame :titleFrame];
        self.optionsTitle.textAlignment = NSTextAlignmentCenter;
        self.optionsBar.backgroundColor = [UIColor clearColor];
        self.optionsBar.layer.borderWidth = 2;
        self.optionsBar.layer.borderColor = [UIColor colorWithRed:153.0/255.0
                                                                green:153.0/255.0
                                                                 blue:153.0/255.0
                                                                alpha:0.7].CGColor;
    }
    
    return self;
}

- (void)initSubviews:(CGRect)barFrame :(CGRect)titleFrame{
    self.optionsBar = [[OOOoyalaTVBar alloc] initWithFrame:barFrame
                                                     color:[UIColor colorWithRed:153.0/255.0
                                                                           green:153.0/255.0
                                                                            blue:153.0/255.0
                                                                           alpha:0.7]];
    self.optionsTitle = [[UILabel alloc] initWithFrame: titleFrame];
    self.optionsTitle.textColor = [UIColor whiteColor];
    self.optionsTitle.textAlignment = NSTextAlignmentRight;
    self.optionsTitle.font = [self.optionsTitle.font fontWithSize:40.0];
    self.optionsTitle.text = @"CC";
    
    self.layer.cornerRadius = cornerRadius;
    
    [self addSubview:self.optionsBar];
    [self.optionsBar addSubview:self.optionsTitle];

}

- (void)removeTopBar {
    [self.optionsBar removeFromSuperview];
}

- (void)addLanguages:(UIView *)view {
    [self.optionsBar addSubview:view];
}

- (BOOL)canBecomeFocused {
    return YES;
}


@end
