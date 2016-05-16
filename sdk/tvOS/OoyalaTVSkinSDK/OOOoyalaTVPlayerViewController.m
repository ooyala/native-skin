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
@property (nonatomic, strong) UIVisualEffectView *controlsView;
@property (nonatomic, strong) UILabel *durationLabel;
@property (nonatomic, strong) UILabel *playerStateLabel;

@property (nonatomic, strong) NSDateFormatter *dateFormatter;

@property (nonatomic, strong) UITapGestureRecognizer *tapForward;
@property (nonatomic, strong) UITapGestureRecognizer *tapBackward;

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
  [super viewWillAppear:  animated];
  
  if (self.player) [self setupViewController];
}

- (void)viewWillDisappear:(BOOL)animated {
  [self removeObservers];
  [super viewWillDisappear:animated];
}

- (void)dealloc {
  [self removeObservers];
}

- (void)setPlayer:(OOOoyalaPlayer *)player {
  _player = player;
  if (_player) [self setupViewController];
}

- (UIVisualEffectView *)controlsView {
  if (!_controlsView) {
    self.controlsView = [[UIVisualEffectView alloc] initWithEffect:[UIBlurEffect effectWithStyle:UIBlurEffectStyleLight]];
  }
  return _controlsView;
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

- (UILabel *)durationLabel {
  if (!_durationLabel) {
    _durationLabel = [[UILabel alloc] init];
    _durationLabel.textColor = [UIColor blackColor];
    _durationLabel.font = [_durationLabel.font fontWithSize:20];
  }
  return _durationLabel;
}

- (UILabel *)playerStateLabel {
  if (!_playerStateLabel) {
    _playerStateLabel = [[UILabel alloc] init];
    _playerStateLabel.textColor = [UIColor blackColor];
    _playerStateLabel.font = [_playerStateLabel.font fontWithSize:20];
  }
  return _playerStateLabel;
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
  
  // Play/Pause button action
  UITapGestureRecognizer *playGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(togglePlay)];
  playGesture.allowedPressTypes = @[@(UIPressTypePlayPause)];
  [self.view addGestureRecognizer:playGesture];
  
  // Controls view with blur effect
  [self.view addSubview:self.controlsView];
  
  // setup control widgets
  [self.controlsView.contentView addSubview:self.durationLabel];
  [self.controlsView.contentView addSubview:self.playerStateLabel];
  
  [self setControlLayoutConstraints];
  
  [self addObservers];
}

// Autolayout constraints for the controls bar
- (void)setControlLayoutConstraints {
  // disable masking issues with autolayout
  self.controlsView.translatesAutoresizingMaskIntoConstraints = NO;
  self.controlsView.contentView.translatesAutoresizingMaskIntoConstraints = NO;
  self.durationLabel.translatesAutoresizingMaskIntoConstraints = NO;
  self.playerStateLabel.translatesAutoresizingMaskIntoConstraints = NO;
  
  // controlsView constraints
  NSLayoutConstraint *constraint = [NSLayoutConstraint
                                    constraintWithItem:self.controlsView
                                    attribute:NSLayoutAttributeHeight
                                    relatedBy:NSLayoutRelationEqual
                                    toItem:nil
                                    attribute:NSLayoutAttributeNotAnAttribute
                                    multiplier:0.0 constant:80.0];
  [self.controlsView addConstraint:constraint];
  
  constraint = [NSLayoutConstraint constraintWithItem:self.controlsView
                                            attribute:NSLayoutAttributeLeading
                                            relatedBy:NSLayoutRelationEqual
                                               toItem:self.view
                                            attribute:NSLayoutAttributeLeading
                                           multiplier:1.0f constant:0.0];
  [self.view addConstraint:constraint];
  
  constraint = [NSLayoutConstraint constraintWithItem:self.controlsView
                                            attribute:NSLayoutAttributeTrailing
                                            relatedBy:NSLayoutRelationEqual
                                               toItem:self.view
                                            attribute:NSLayoutAttributeTrailing
                                           multiplier:1.0f constant:0.0];
  [self.view addConstraint:constraint];
  
  constraint = [NSLayoutConstraint constraintWithItem:self.controlsView
                                            attribute:NSLayoutAttributeBottom
                                            relatedBy:NSLayoutRelationEqual
                                               toItem:self.view
                                            attribute:NSLayoutAttributeBottomMargin
                                           multiplier:1.0f constant:0.0];
  [self.view addConstraint:constraint];
  
  // controlsView's contentView constraints
  // this is necessary because the content view doesn't take the controlsView frame
  // area by default. We need to specify it with constraints.
  constraint = [NSLayoutConstraint constraintWithItem:self.controlsView.contentView
                                            attribute:NSLayoutAttributeLeading
                                            relatedBy:NSLayoutRelationEqual
                                               toItem:self.controlsView
                                            attribute:NSLayoutAttributeLeading
                                           multiplier:1.0f constant:0.0];
  [self.controlsView addConstraint:constraint];
  
  constraint = [NSLayoutConstraint constraintWithItem:self.controlsView.contentView
                                            attribute:NSLayoutAttributeTrailing
                                            relatedBy:NSLayoutRelationEqual
                                               toItem:self.controlsView
                                            attribute:NSLayoutAttributeTrailing
                                           multiplier:1.0f constant:0.0];
  [self.controlsView addConstraint:constraint];
  
  constraint = [NSLayoutConstraint constraintWithItem:self.controlsView.contentView
                                            attribute:NSLayoutAttributeTop
                                            relatedBy:NSLayoutRelationEqual
                                               toItem:self.controlsView
                                            attribute:NSLayoutAttributeTop
                                           multiplier:1.0f constant:0.0];
  [self.controlsView addConstraint:constraint];
  
  constraint = [NSLayoutConstraint constraintWithItem:self.controlsView.contentView
                                            attribute:NSLayoutAttributeBottom
                                            relatedBy:NSLayoutRelationEqual
                                               toItem:self.controlsView
                                            attribute:NSLayoutAttributeBottom
                                           multiplier:1.0f constant:0.0];
  [self.controlsView addConstraint:constraint];
  
  // durationLabel constraints
  constraint = [NSLayoutConstraint constraintWithItem:self.durationLabel
                                            attribute:NSLayoutAttributeLeading
                                            relatedBy:NSLayoutRelationEqual
                                               toItem:self.controlsView.contentView
                                            attribute:NSLayoutAttributeLeadingMargin
                                           multiplier:1.0f constant:20.0];
  [self.controlsView.contentView addConstraint:constraint];
  
  constraint = [NSLayoutConstraint constraintWithItem:self.durationLabel
                                            attribute:NSLayoutAttributeCenterY
                                            relatedBy:NSLayoutRelationEqual
                                               toItem:self.controlsView.contentView
                                            attribute:NSLayoutAttributeCenterYWithinMargins
                                           multiplier:1.0f constant:0.0];
  [self.controlsView.contentView addConstraint:constraint];
  
  // playerStateLabel constraints
  constraint = [NSLayoutConstraint constraintWithItem:self.playerStateLabel
                                            attribute:NSLayoutAttributeTrailing
                                            relatedBy:NSLayoutRelationEqual
                                               toItem:self.controlsView.contentView
                                            attribute:NSLayoutAttributeTrailingMargin
                                           multiplier:1.0f constant:-20.0];
  [self.controlsView.contentView addConstraint:constraint];
  
  constraint = [NSLayoutConstraint constraintWithItem:self.playerStateLabel
                                            attribute:NSLayoutAttributeCenterY
                                            relatedBy:NSLayoutRelationEqual
                                               toItem:self.controlsView.contentView
                                            attribute:NSLayoutAttributeCenterYWithinMargins
                                           multiplier:1.0f constant:0.0];
  [self.controlsView.contentView addConstraint:constraint];
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
      self.playerStateLabel.text = @"Loading";
      break;
    case OOOoyalaPlayerStateReady:
      self.playerStateLabel.text = @"Ready";
      break;
    case OOOoyalaPlayerStatePlaying:
      self.playerStateLabel.text = @"Playing";
      break;
    case OOOoyalaPlayerStatePaused:
      self.playerStateLabel.text = @"Paused";
      break;
    case OOOoyalaPlayerStateError:
      self.playerStateLabel.text = @"Error";
      break;
    default:
      self.playerStateLabel.text = @"";
      break;
  }
  
  if (self.player.state != OOOoyalaPlayerStateLoading) {
    [self.activityView stopAnimating];
  }
  
  [self updateTimeWithDuration:self.player.duration
                      playhead:self.player.playheadTime];
}

- (void)updateTimeWithDuration:(CGFloat)duration playhead:(CGFloat)playhead {
  [self.dateFormatter setDateFormat:duration < 3600 ? @"m:ss" : @"H:mm:ss"];
  self.durationLabel.text = [NSString stringWithFormat:@"%@/%@",
                             [self.dateFormatter stringFromDate:[NSDate dateWithTimeIntervalSince1970:playhead]],
                             [self.dateFormatter stringFromDate:[NSDate dateWithTimeIntervalSince1970:duration]]];
}

- (void)togglePlay {
  if ([self.player isPlaying]) {
    [self.player pause];
  } else {
    [self.player play];
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
}

- (UIView *)preferredFocusedView {
  return self.player.view;
}


@end
