//
//  OOOoyalaTVPlayerViewController.m
//  OoyalaTVSkinSDK
//
//  Copyright © 2016 Ooyala, Inc. All rights reserved.
//

#import "OOOoyalaTVPlayerViewController.h"
#import "OOOoyalaTVConstants.h"
#import "OOOoyalaTVGradientView.h"
#import "OOOoyalaTVButton.h"
#import "OOOoyalaTVLabel.h"
#import "OOOoyalaTVBar.h"
#import <OoyalaTVSDK/OOOoyalaPlayer.h>

@interface OOOoyalaTVPlayerViewController ()

@property (nonatomic, strong) UIActivityIndicatorView *activityView;

@property (nonatomic, strong) UITapGestureRecognizer *tapForward;
@property (nonatomic, strong) UITapGestureRecognizer *tapBackward;

@property (nonatomic, strong) OOOoyalaTVLabel *durationLabel;
@property (nonatomic, strong) OOOoyalaTVLabel *playheadLabel;
@property (nonatomic, strong) OOOoyalaTVButton *playPauseButton;
@property (nonatomic, strong) OOOoyalaTVBar *durationBar;
@property (nonatomic, strong) OOOoyalaTVBar *progressBar;
@property (nonatomic, strong) OOOoyalaTVBar *bufferBar;
@property (nonatomic, strong) OOOoyalaTVGradientView *progressBarBackground;
@property (nonatomic) CGFloat lastTriggerTime;

@end

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
  self.progressBarBackground = [[OOOoyalaTVGradientView alloc] initWithFrame:CGRectMake(0, self.view.bounds.size.height - bottomDistance * 2, self.view.bounds.size.width, bottomDistance * 2)];
  
  [self.view addSubview:self.progressBarBackground];
}

- (void)setupPlayPauseButton {
  // frame
  self.playPauseButton = [[OOOoyalaTVButton alloc] initWithFrame:CGRectMake(headDistance, self.progressBarBackground.bounds.size.height - playPauseButtonHeight - 38, headDistance, playPauseButtonHeight)];
  [self.playPauseButton addTarget:self action:@selector(togglePlay) forControlEvents:UIControlEventTouchUpInside];
  
  // icon
  [self.playPauseButton changePlayingState:[self.player isPlaying]];
  
  // add to view
  [self.progressBarBackground addSubview:self.playPauseButton];
}

- (void)setupBars {
  self.durationBar = [[OOOoyalaTVBar alloc] initWithFrame:CGRectMake(barX, self.progressBarBackground.bounds.size.height - bottomDistance - barHeight, self.view.bounds.size.width - barX - headDistance - labelWidth - componentSpace, barHeight)
                                                    color:[UIColor colorWithRed:153.0/255.0
                                                                          green:153.0/255.0
                                                                           blue:153.0/255.0
                                                                          alpha:0.3]];
  self.progressBar = [[OOOoyalaTVBar alloc] initWithFrame:CGRectMake(barX, self.progressBarBackground.bounds.size.height - bottomDistance - barHeight, 0, barHeight)
                                                    color:[UIColor colorWithRed:68.0/255.0
                                                                          green:138.0/255.0
                                                                           blue:225.0/255.0
                                                                          alpha:1.0]];
  self.bufferBar = [[OOOoyalaTVBar alloc] initWithFrame:CGRectMake(barX, self.progressBarBackground.bounds.size.height - bottomDistance - barHeight, 0, barHeight)
                                                  color:[UIColor colorWithRed:179.0/255.0
                                                                        green:179.0/255.0
                                                                         blue:179.0/255.0
                                                                        alpha:0.8]];
  
  [self.progressBarBackground addSubview:self.durationBar];
  [self.progressBarBackground addSubview:self.bufferBar];
  [self.progressBarBackground addSubview:self.progressBar];
}

- (void)setupBar:(UIView *)bar
           color:(UIColor *)color {
  bar.backgroundColor = color;
  bar.layer.cornerRadius = barCornerRadius;
  
  [self.progressBarBackground addSubview:bar];
}

- (void)setupLabels {
  self.playheadLabel = [[OOOoyalaTVLabel alloc] initWithFrame:CGRectMake(playheadLabelX, self.progressBarBackground.bounds.size.height - bottomDistance - labelHeight, labelWidth, labelHeight)
                                                         time:self.player.playheadTime];
  self.durationLabel = [[OOOoyalaTVLabel alloc] initWithFrame:CGRectMake(self.progressBarBackground.bounds.size.width - headDistance - labelWidth, self.progressBarBackground.bounds.size.height - bottomDistance - labelHeight, labelWidth, labelHeight)
                                                         time:self.player.duration];

  [self.progressBarBackground addSubview:self.playheadLabel];
  [self.progressBarBackground addSubview:self.durationLabel];
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
  NSDateFormatter *dateformat = [[NSDateFormatter alloc] init];
  [dateformat setDateFormat:duration < 3600 ? @"mm:ss" : @"H:mm:ss"];
  self.playheadLabel.text = [NSString stringWithFormat:@"%@", [dateformat stringFromDate:[NSDate dateWithTimeIntervalSince1970:playhead]]];
  self.durationLabel.text = [NSString stringWithFormat:@"%@", [dateformat stringFromDate:[NSDate dateWithTimeIntervalSince1970:duration]]];
  
  [self.playPauseButton changePlayingState:[self.player isPlaying]];
  
  // update progressBar and bufferBar
  [self updateBar:self.progressBar barTime:playhead];
  [self updateBar:self.bufferBar barTime:self.player.bufferedTime];
  
  if (playhead - self.lastTriggerTime > hideBarInterval && playhead - self.lastTriggerTime < hideBarInterval + 2) {
    [self hideProgressBar];
  }
}

- (void)updateBar:(OOOoyalaTVBar *)bar
          barTime:(CGFloat)time{
  if (bar && self.player.duration != 0) {
    CGRect frame = bar.frame;
    frame.size.width = (time / self.player.duration) * (self.view.bounds.size.width - 388);
    bar.frame = frame;
  }
}

- (void)togglePlay {
  if ([self.player isPlaying]) {
    [self.player pause];
  } else {
    [self.player play];
  }
  
  [self showProgressBar];
  [self.playPauseButton changePlayingState:[self.player isPlaying]];
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
