//
//  OOSkinViewController.h
//  OoyalaSkin
//
//

#import <UIKit/UIKit.h>

@class OOOoyalaPlayer;
@class OOSkinOptions;
@class OOClosedCaptionsStyle;
@class OOReactBridge;

/**
 * The primary class for the Skin UI
 * Use it to display the Ooyala Skin UI alongside the OOOoyalaPlayer
 */
@interface OOSkinViewController : UIViewController

@property (nonatomic, readonly) OOOoyalaPlayer *player;
@property (nonatomic, readonly) OOSkinOptions *skinOptions;
@property (nonatomic, readonly) NSString *version;
@property (nonatomic, readonly) OOClosedCaptionsStyle *closedCaptionsDeviceStyle;

/**
 Programatically change the fullscreen mode of the player.
 Use this only after setting the OOSkinViewController.view.frame. Using it before will result in unexpected results.
 
 Here is an example on how to use this property:
 @code
 // assume the property skinController of type OOSkinViewController exists and is already instantiated.
 // Also assume you have an IBOutlet to a self.videoView pointing to an existing view.
 [self addChildViewController:self.skinController];
 self.skinController.view.frame = self.videoView.bounds;
 // this will begin the player in fullscreen mode
 self.skinController.fullscreen = YES;
 
 [self.skinController.player setEmbedCode:MY_EMBED_CODE];
 @endcode
 */
@property (nonatomic, getter=isFullscreen) BOOL fullscreen;

// notifications
extern NSString *const OOSkinViewControllerFullscreenChangedNotification; /* Fires when player goes FullScreen  */


- (instancetype) init __attribute__((unavailable("init not available")));
- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
                   skinOptions:(OOSkinOptions *)jsCodeLocation
                        parent:(UIView *)parentView
                 launchOptions:(NSDictionary *)options;

- (void)ccStyleChanged:(NSNotification *) notification;

- (void)sendBridgeEventWithName:(NSString *)eventName body:(id)body;

@end
