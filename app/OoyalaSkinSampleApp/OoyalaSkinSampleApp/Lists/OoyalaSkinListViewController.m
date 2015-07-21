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

-(void)addCommonWithTitle:(NSString*)title embedCode:(NSString*)embedCode {
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:title
                                                            embedCode:embedCode
                                                                pcode:@"c0cTkxOqALQviQIGAHWY5hP0q9gU"
                                                         playerDomain:@"http://www.ooyala.com"
                                                       viewController: [DefaultSkinPlayerViewController class]
                                                                  nib:@"DefaultSkinPlayerView"]];
}

- (void)addAllBasicPlayerSelectionOptions {

  [self addCommonWithTitle:@"Original Alice Test Asset" embedCode:@"ZhMmkycjr4jlHIjvpIIimQSf_CjaQs48"];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"Small Player View (BigBuck+Ads)"
                                                            embedCode:@"ZhMmkycjr4jlHIjvpIIimQSf_CjaQs48"
                                                                pcode:@"Vpd3E6BNabnn09G72IWye5O2RzN1"
                                                         playerDomain:@"http://www.ooyala.com"
                                                       viewController:[DefaultSkinPlayerViewController class] nib: @"SmallSkinPlayerView"]];

  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"Small Player View (HLS)"
                                                            embedCode:@"Y1ZHB1ZDqfhCPjYYRbCEOz0GR8IsVRm1"
                                                                pcode:@"Vpd3E6BNabnn09G72IWye5O2RzN1"
                                                         playerDomain:@"http://www.ooyala.com"
                                                       viewController:[DefaultSkinPlayerViewController class] nib: @"SmallSkinPlayerView"]];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"Tall Player View"
                                                            embedCode:@"ZhMmkycjr4jlHIjvpIIimQSf_CjaQs48"
                                                                pcode:@"Vpd3E6BNabnn09G72IWye5O2RzN1"
                                                         playerDomain:@"http://www.ooyala.com"
                                                       viewController:[DefaultSkinPlayerViewController class] nib: @"TallPlayerView"]];

  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"Wide Player View"
                                                            embedCode:@"ZhMmkycjr4jlHIjvpIIimQSf_CjaQs48"
                                                                pcode:@"Vpd3E6BNabnn09G72IWye5O2RzN1"
                                                         playerDomain:@"http://www.ooyala.com"
                                                       viewController:[DefaultSkinPlayerViewController class] nib: @"WidePlayerView"]];
  [self addCommonWithTitle:@"HLS Video" embedCode:@"Y1ZHB1ZDqfhCPjYYRbCEOz0GR8IsVRm1"];
  [self addCommonWithTitle:@"MP4 Video" embedCode:@"h4aHB1ZDqV7hbmLEv4xSOx3FdUUuephx"];
  [self addCommonWithTitle:@"VOD with CCs" embedCode:@"92cWp0ZDpDm4Q8rzHfVK6q9m6OtFP-ww"];
  [self addCommonWithTitle:@"CC to no-CC Channel" embedCode:@"ZwNThkdTrSfttI2N_-MH3MRIdJQ3Ox8I"];
  [self addCommonWithTitle:@"4:3 Aspect Ratio" embedCode:@"FwaXZjcjrkydIftLal2cq9ymQMuvjvD8"];
  [self addCommonWithTitle:@"VAST Ad Pre-roll" embedCode:@"Zlcmp0ZDrpHlAFWFsOBsgEXFepeSXY4c"];
  [self addCommonWithTitle:@"VAST Ad Mid-roll" embedCode:@"pncmp0ZDp7OKlwTPJlMZzrI59j8Imefa"];
  [self addCommonWithTitle:@"VAST Ad Post-roll" embedCode:@"Zpcmp0ZDpaB-90xK8MIV9QF973r1ZdUf"];
  [self addCommonWithTitle:@"VAST Ad Wrapper" embedCode:@"pqaWp0ZDqo17Z-Dn_5YiVhjcbQYs5lhq"];
  [self addCommonWithTitle:@"Ooyala Ad Pre-roll" embedCode:@"M4cmp0ZDpYdy8kiL4UD910Rw_DWwaSnU"];
  [self addCommonWithTitle:@"Ooyala Ad Mid-roll" embedCode:@"xhcmp0ZDpnDB2-hXvH7TsYVQKEk_89di"];
  [self addCommonWithTitle:@"Ooyala Ad Post-roll" embedCode:@"Rjcmp0ZDr5yFbZPEfLZKUveR_2JzZjMO"];
  [self addCommonWithTitle:@"Multi Ad combination" embedCode:@"Ftcmp0ZDoz8tALmhPcN2vMzCdg7YU9lc"];
  [self addCommonWithTitle:@"Vast multi-ads" embedCode:@"trNnFwdTogG_HxAgEV01zWLg3o8umVEJ"];
  [self insertNewObject: [[PlayerSelectionOption alloc] initWithTitle:@"BYU Live"
                                                            embedCode:@"Rva245YTpHWP-9bchhJL25BMl1shI2fG"
                                                                pcode:@"Vpd3E6BNabnn09G72IWye5O2RzN1"
                                                         playerDomain:@"http://www.byu.edu"
                                                       viewController:[DefaultSkinPlayerViewController class]
                                                                  nib: @"DefaultSkinPlayerView"]];

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
