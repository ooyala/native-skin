//
//  OOOoyalaTVPlayerViewController.m
//  OoyalaTVSkinSDK
//
//  Copyright © 2016 Ooyala, Inc. All rights reserved.
//

#import "OOOoyalaTVPlayerViewController.h"
#import <OoyalaTVSDK/OOOoyalaPlayer.h>

@interface OOOoyalaTVPlayerViewController ()

@property (nonatomic, strong) UIActivityIndicatorView *activityView;

@property (nonatomic, strong) NSDateFormatter *dateFormatter;
@property (nonatomic, strong) UITapGestureRecognizer *tapForward;
@property (nonatomic, strong) UITapGestureRecognizer *tapBackward;

@property (nonatomic, strong) UILabel *durationLabel;
@property (nonatomic, strong) UILabel *playheadLabel;
@property (nonatomic, strong) UIButton *playPauseButton;
@property (nonatomic, strong) UIView *durationBar;
@property (nonatomic, strong) UIView *progressBar;
@property (nonatomic, strong) UIView *progressBarBackground;
@property (nonatomic) CGFloat lastTriggerTime;

@end

static CGFloat const headDistance = 54;
static CGFloat const playPauseButtonWidth = 45;
static CGFloat const playPauseButtonHeight = 45;
static CGFloat const componentSpace = 20;
static CGFloat const labelWidth = 80;
static CGFloat const labelHeight = 20;
static CGFloat const barHeight = 20;
static CGFloat const barCornerRadius = 10;
static CGFloat const bottomDistance = 50;
static CGFloat const barTailDistance = headDistance + componentSpace + labelWidth;
static CGFloat const playheadLabelX = headDistance + playPauseButtonWidth + componentSpace;
static CGFloat const barX = playheadLabelX + componentSpace + labelWidth;

@implementation OOOoyalaTVPlayerViewController

- (instancetype)init {
  if (self = [super init]) {
    _showsPlaybackControls = NO;
  }
  return self;
}

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player {
  if (self = [self init]) {
    _player = player;
  }
  return self;
}

- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear: animated];

  if (self.player) [self setupViewController];
}

- (void)viewWillDisappear:(BOOL)animated {
  [self removeObservers];
  [super viewWillDisappear:animated];
}

- (void)setupUI {
  [self setupProgessBackground];
  [self setupPlayPauseButton];
  [self setupBars];
  [self setupLabels];
}

- (void)setupProgessBackground {
  self.progressBarBackground = [[UIView alloc] initWithFrame:CGRectMake(0, self.view.bounds.size.height - bottomDistance * 2, self.view.bounds.size.width, bottomDistance * 2)];
  self.progressBarBackground.backgroundColor = [UIColor clearColor];
  
  // add gradient
  CAGradientLayer *gradient = [CAGradientLayer layer];
  gradient.frame = self.progressBarBackground.bounds;
  gradient.colors = [NSArray arrayWithObjects:(id)[UIColor colorWithRed:0 green:0 blue:0 alpha:0.15], (id)[[UIColor clearColor] CGColor], nil];
  
 [self.progressBarBackground.layer insertSublayer:gradient atIndex:0];
  [self.view addSubview:self.progressBarBackground];
}

- (void)setupPlayPauseButton {
  // frame
  self.playPauseButton = [[UIButton alloc] initWithFrame:CGRectMake(headDistance, self.progressBarBackground.bounds.size.height - playPauseButtonHeight - 38, 54, playPauseButtonHeight)];
  [self.playPauseButton addTarget:self action:@selector(togglePlay) forControlEvents:UIControlEventTouchUpInside];
  
  // icon
  [self setupPlayPause];
  
  // add to view
  [self.progressBarBackground addSubview:self.playPauseButton];
}

- (void)setupPlayPause {
  NSString *fontString = [self.player isPlaying] ? @"g": @"v";
  
  UIFont *ooFont = [UIFont fontWithName:@"ooyala-slick-type" size:40.0];
  
  NSDictionary *attrsDictionary = @{NSForegroundColorAttributeName :[UIColor whiteColor]};
  NSMutableAttributedString *buttonString = [[NSMutableAttributedString alloc] initWithString:fontString attributes:attrsDictionary];
  if (ooFont) {
    [buttonString addAttribute:NSFontAttributeName value:ooFont range:NSMakeRange(0, 1)];
  }
  
  self.playPauseButton.titleLabel.textAlignment = NSTextAlignmentCenter;
  [self.playPauseButton setAttributedTitle:buttonString forState:UIControlStateNormal];
}

- (void)setupBars {
  self.durationBar = [[UIView alloc] initWithFrame:CGRectMake(barX, self.progressBarBackground.bounds.size.height - bottomDistance - barHeight, self.view.bounds.size.width - barX - headDistance - labelWidth - componentSpace, barHeight)];
  self.progressBar = [[UIView alloc] initWithFrame:CGRectMake(barX, self.progressBarBackground.bounds.size.height - bottomDistance - barHeight, 0, barHeight)];
  
  [self setupBar:self.durationBar
           color:[UIColor colorWithRed:153.0/255.0
                                 green:153.0/255.0
                                  blue:153.0/255.0
                                 alpha:0.3]];
  [self setupBar:self.progressBar
           color:[UIColor colorWithRed:68.0/255.0
                                 green:138.0/255.0
                                  blue:225.0/255.0
                                 alpha:1.0]];
}

- (void)setupBar:(UIView *)bar
           color:(UIColor *)color {
  bar.backgroundColor = color;
  bar.layer.cornerRadius = barCornerRadius;
  
  [self.progressBarBackground addSubview:bar];
}

- (void)setupLabels {
  [self setupTimeLabel:self.playheadLabel
                 frame:CGRectMake(playheadLabelX, self.progressBarBackground.bounds.size.height - bottomDistance - labelHeight, labelWidth, labelHeight)
                  time:self.player.playheadTime];
  [self setupTimeLabel:self.durationLabel
                 frame:CGRectMake(self.progressBarBackground.bounds.size.width - headDistance - labelWidth, self.progressBarBackground.bounds.size.height - bottomDistance - labelHeight, labelWidth, labelHeight)
                  time:self.player.duration];
}

- (void)setupTimeLabel:(UILabel *)label
                 frame:(CGRect)frame
                  time:(CGFloat)time {
  [label setFrame:frame];
  label.textColor = [UIColor whiteColor];
  label.textAlignment = NSTextAlignmentCenter;
  
  [self.dateFormatter setDateFormat:time < 3600 ? @"mm:ss" : @"HH:mm:ss"];
  label.text = [NSString stringWithFormat:@"%@",
                             [self.dateFormatter stringFromDate:[NSDate dateWithTimeIntervalSince1970:time]]];
  
  [self.progressBarBackground addSubview:label];
}

- (void)dealloc {
  [self removeObservers];
}

- (void)setPlayer:(OOOoyalaPlayer *)player {
  _player = player;
  if (_player) [self setupViewController];
}

- (UIActivityIndicatorView *)activityView {
  if (!_activityView) {
    _activityView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    _activityView.hidesWhenStopped = YES;
  }
  return _activityView;
}

- (void)setShowsPlaybackControls:(BOOL)showsPlaybackControls {
  _showsPlaybackControls = showsPlaybackControls;
  [self enableSeek:_showsPlaybackControls];
}

- (UILabel *)playheadLabel {
  if (!_playheadLabel) {
    _playheadLabel = [[UILabel alloc] init];
    _playheadLabel.textColor = [UIColor whiteColor];
    _playheadLabel.font = [_playheadLabel.font fontWithSize:20];
  }
  return _playheadLabel;
}

- (UILabel *)durationLabel {
  if (!_durationLabel) {
    _durationLabel = [[UILabel alloc] init];
    _durationLabel.textColor = [UIColor whiteColor];
    _durationLabel.font = [_durationLabel.font fontWithSize:20];
  }
  return _durationLabel;
}

- (NSDateFormatter *)dateFormatter {
  if (!_dateFormatter) {
    _dateFormatter = [[NSDateFormatter alloc] init];
    [_dateFormatter setTimeZone:[NSTimeZone timeZoneWithName:@"GMT"]];
  }
  return _dateFormatter;
}

- (UITapGestureRecognizer *)tapForward {
  if (!_tapForward) {
    _tapForward = [[UITapGestureRecognizer alloc] init];
    _tapForward.allowedPressTypes = @[@(UIPressTypeRightArrow)];
  }
  return _tapForward;
}

- (UITapGestureRecognizer *)tapBackward {
  if (!_tapBackward) {
    _tapBackward = [[UITapGestureRecognizer alloc] init];
    _tapBackward.allowedPressTypes = @[@(UIPressTypeLeftArrow)];
  }
  return _tapBackward;
}

/*!
 @param enable
 When you enabled, forward and backward tap gesture recognizers will be on. If disable, they will be off.
 */
- (void)enableSeek:(BOOL)enable {
  if (enable) {
    [self addTapGesture:self.tapForward inView:self.view];
    [self addTapGesture:self.tapBackward inView:self.view];
  } else {
    [self removeTapGesture:self.tapForward inView:self.view];
    [self removeTapGesture:self.tapBackward inView:self.view];
  }
}

- (void)addTapGesture:(UITapGestureRecognizer *)tapGesture inView:(UIView *)view {
  [tapGesture addTarget:self action:@selector(seek:)];
  [view addGestureRecognizer:tapGesture];
}

- (void)removeTapGesture:(UITapGestureRecognizer *)tapGesture inView:(UIView *)view {
  [view removeGestureRecognizer:tapGesture];
  [tapGesture removeTarget:self action:@selector(seek:)];
}

- (void)setupViewController {
  self.player.view.frame = self.view.bounds;
  [self.view addSubview:self.player.view];
  
  self.activityView.center = self.view.center;
  [self.view addSubview:self.activityView];
  
  self.lastTriggerTime = 0;
  
  // Play/Pause button action
  UITapGestureRecognizer *playGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(togglePlay)];
  playGesture.allowedPressTypes = @[@(UIPressTypePlayPause)];
  [self.view addGestureRecognizer:playGesture];
  
  // enable seeking
  self.showsPlaybackControls = YES;
  
  [self setupUI];
  
  [self addObservers];
}

- (void)addObservers {
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(syncUI) name:OOOoyalaPlayerStateChangedNotification object:self.player];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(syncUI) name:OOOoyalaPlayerTimeChangedNotification object:self.player];
}

- (void)removeObservers {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)syncUI {
  switch (self.player.state) {
    case OOOoyalaPlayerStateLoading:
      [self.activityView startAnimating];
      break;
    case OOOoyalaPlayerStateReady:
      break;
    case OOOoyalaPlayerStatePlaying:
      break;
    case OOOoyalaPlayerStatePaused:
      break;
    case OOOoyalaPlayerStateError:
      break;
    default:
      break;
  }
  
  if (self.player.state != OOOoyalaPlayerStateLoading) {
    [self.activityView stopAnimating];
  }
  
  [self updateTimeWithDuration:self.player.duration
                      playhead:self.player.playheadTime];
}

- (void)updateTimeWithDuration:(CGFloat)duration playhead:(CGFloat)playhead {
  [self.dateFormatter setDateFormat:duration < 3600 ? @"mm:ss" : @"H:mm:ss"];
  self.playheadLabel.text = [NSString stringWithFormat:@"%@", [self.dateFormatter stringFromDate:[NSDate dateWithTimeIntervalSince1970:playhead]]];
  self.durationLabel.text = [NSString stringWithFormat:@"%@", [self.dateFormatter stringFromDate:[NSDate dateWithTimeIntervalSince1970:duration]]];
  
  [self setupPlayPause];
  
  if (self.progressBar && duration != 0) {
    CGRect frame = self.progressBar.frame;
    frame.size.width = (playhead / duration) * (self.view.bounds.size.width - 388);
    self.progressBar.frame = frame;
  }
  if (playhead - self.lastTriggerTime > 5 && playhead - self.lastTriggerTime < 8) {
    [self hideProgressBar];
  }
}

- (void)togglePlay {
  if ([self.player isPlaying]) {
    [self.player pause];
  } else {
    [self.player play];
  }
  
  [self showProgressBar];
  [self setupPlayPause];
}

- (void)showProgressBar {
  self.lastTriggerTime = self.player.playheadTime;
  if (self.progressBarBackground.frame.origin.y == self.view.bounds.size.height) {
    [UIView animateWithDuration:0.5 delay:0.0 options:UIViewAnimationCurveEaseIn animations:^{
      self.progressBarBackground.alpha = 1.0;
      
      CGRect frame = self.progressBarBackground.frame;
      frame.origin.y -= frame.size.height;
      self.progressBarBackground.frame = frame;
    } completion: nil];
  }
}

- (void)hideProgressBar {
  if (self.progressBarBackground.frame.origin.y < self.view.bounds.size.height) {
    [UIView animateWithDuration:0.5 delay:0.0 options:UIViewAnimationCurveEaseOut animations:^{
      self.progressBarBackground.alpha = 0.0;
      
      CGRect frame = self.progressBarBackground.frame;
      frame.origin.y += frame.size.height;
      self.progressBarBackground.frame = frame;
    } completion: nil];
  }
}

- (void)seek:(UITapGestureRecognizer *)sender {
  if ([sender.allowedPressTypes containsObject:@(UIPressTypeRightArrow)]) {
    [self player:self.player seekForward:YES time:10];
  } else if ([sender.allowedPressTypes containsObject:@(UIPressTypeLeftArrow)]) {
    [self player:self.player seekForward:NO time:10];
  }
}

- (void)player:(OOOoyalaPlayer *)player seekForward:(BOOL)forward time:(Float64)time {
  if (forward) {
    [player seek:player.playheadTime + time];
  } else {
    [player seek:player.playheadTime - time];
  }
  
  [self showProgressBar];
}

- (UIView *)preferredFocusedView {
  return self.player.view;
}


@end
