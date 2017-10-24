#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class OOOoyalaPlayer;
@class OOOoyalaTVPlayerViewController;

@interface OOTVGestureManager : NSObject

- (instancetype)initWithController:(OOOoyalaTVPlayerViewController *)controller;

- (void)addGestures;
- (void)removeGestures;

@end
