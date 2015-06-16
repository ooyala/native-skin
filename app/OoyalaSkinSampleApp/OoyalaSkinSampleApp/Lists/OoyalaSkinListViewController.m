/**
 * @class      BasicPlaybackListViewController BasicPlaybackListViewController.m "BasicPlaybackListViewController.m"
 * @brief      A list of playback examples that demonstrate basic playback
 * @date       01/12/15
 * @copyright  Copyright (c) 2015 Ooyala, Inc. All rights reserved.
 */

#import "OoyalaSkinListViewController.h"
#import "DefaultSkinPlayerViewController.h"
#import "SampleAppPlayerViewController.h"

#import "PlayerSelectionOption.h"

@interface OoyalaSkinListViewController ()
@property NSMutableArray *options;
@property NSMutableArray *optionList;
@property NSMutableArray *optionEmbedCodes;
@end

@implementation OoyalaSkinListViewController

- (id)init {
  self = [super init];
  self.title = @"Ooyala Skin Sample App";
  return self;
}

- (void)addAllBasicPlayerSelectionOptions {
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"Original Alice Test Asset" embedCode:@"ZhMmkycjr4jlHIjvpIIimQSf_CjaQs48" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"(Small Skin) Original Alice Test Asset" embedCode:@"ZhMmkycjr4jlHIjvpIIimQSf_CjaQs48" viewController: [DefaultSkinPlayerViewController class] nib: @"SmallSkinPlayerViewTwo"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"HLS Video" embedCode:@"Y1ZHB1ZDqfhCPjYYRbCEOz0GR8IsVRm1" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"MP4 Video" embedCode:@"h4aHB1ZDqV7hbmLEv4xSOx3FdUUuephx" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"VOD with CCs" embedCode:@"92cWp0ZDpDm4Q8rzHfVK6q9m6OtFP-ww" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"CC to no-CC Channel" embedCode:@"ZwNThkdTrSfttI2N_-MH3MRIdJQ3Ox8I" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"4:3 Aspect Ratio" embedCode:@"FwaXZjcjrkydIftLal2cq9ymQMuvjvD8" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"VAST Ad Pre-roll" embedCode:@"Zlcmp0ZDrpHlAFWFsOBsgEXFepeSXY4c" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"VAST Ad Mid-roll" embedCode:@"pncmp0ZDp7OKlwTPJlMZzrI59j8Imefa" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"VAST Ad Post-roll" embedCode:@"Zpcmp0ZDpaB-90xK8MIV9QF973r1ZdUf" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"VAST Ad Wrapper" embedCode:@"pqaWp0ZDqo17Z-Dn_5YiVhjcbQYs5lhq" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"Ooyala Ad Pre-roll" embedCode:@"M4cmp0ZDpYdy8kiL4UD910Rw_DWwaSnU" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"Ooyala Ad Mid-roll" embedCode:@"xhcmp0ZDpnDB2-hXvH7TsYVQKEk_89di" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"Ooyala Ad Post-roll" embedCode:@"Rjcmp0ZDr5yFbZPEfLZKUveR_2JzZjMO" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"Multi Ad combination" embedCode:@"Ftcmp0ZDoz8tALmhPcN2vMzCdg7YU9lc" viewController: [DefaultSkinPlayerViewController class] nib: @"DefaultSkinPlayerView"]];
}

- (void)viewDidLoad {
  [super viewDidLoad];
  self.navigationController.navigationBar.translucent = NO;
  [self.tableView registerNib:[UINib nibWithNibName:@"TableCell" bundle:nil]forCellReuseIdentifier:@"TableCell"];

  [self addAllBasicPlayerSelectionOptions];
}

- (void)insertNewObject:(PlayerSelectionOption *)selectionObject {
  if (!self.options) {
    self.options = [[NSMutableArray alloc] init];
  }
  [self.options addObject:selectionObject];
  NSIndexPath *indexPath = [NSIndexPath indexPathForRow:0 inSection:0];
  [self.tableView insertRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationAutomatic];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
}

#pragma mark - Table View

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
  return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
  return self.options.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
  UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"TableCell" forIndexPath:indexPath];
  
  PlayerSelectionOption *selection = self.options[indexPath.row];
  cell.textLabel.text = [selection title];
  return cell;
}

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
  return NO;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
  // When a row is selected, load its desired PlayerViewController
  PlayerSelectionOption *selection = self.options[indexPath.row];
  SampleAppPlayerViewController *controller = [(SampleAppPlayerViewController *)[[selection viewController] alloc] initWithPlayerSelectionOption:selection];
  [self.navigationController pushViewController:controller animated:YES];
}
@end
