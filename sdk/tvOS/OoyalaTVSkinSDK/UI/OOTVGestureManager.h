#import <UIKit/UIKit.h>

@class OOOoyalaPlayer;
@class OOOoyalaTVPlayerViewController;

@interface OOTVGestureManager : NSObject

@property (nonatomic) double playheadTime;
@property (nonatomic) double durationTime;

- (instancetype)initWithController:(OOOoyalaTVPlayerViewController *)controller;

- (void)addGestures;
- (void)removeGestures;

@end
