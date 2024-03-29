//
//  OOPlayerProtocol.h
//  OoyalaSDK
//
//  Copyright © 2015 Ooyala, Inc. All rights reserved.
//

@import CoreMedia.CMTimeRange;

#import "OOPlayerState.h"

#ifndef OOPlayerProtocol_h
#define OOPlayerProtocol_h

@class UIImage;

@protocol OOPlayerProtocol <NSObject>

/**
 * @return YES if the player will put its own controls on-screen;
 * NO if the player wants the Ooyala controls to be used instead.
 */
- (BOOL)hasCustomControls;

/**
 * This is called when pause is clicked
 */
- (void)pause;

/**
 * This is called when play is clicked
 */
- (void)play;

/**
 * This is called when stop is clicked
 */
- (void)stop;

/**
 * Get the current item's buffer
 * @return buffer as CMTimeRange
 */
- (Float64)buffer;

/**
 * Set the current playhead time of the player
 * @param time CMTime to set the playhead time to
 */
- (void)seekToTime:(Float64)time;

- (void)setVideoGravity:(OOOoyalaPlayerVideoGravity)gravity;

- (void)setClosedCaptionsLanguage:(NSString *)language;

/**
 * This returns the player state
 * @return the state
 */
@property (nonatomic) OOOoyalaPlayerState ooPlayerState;
@property (nonatomic) BOOL seekable;
@property (nonatomic, readonly) CMTimeRange seekableTimeRange;
@property (nonatomic) BOOL allowsExternalPlayback;
@property (nonatomic, readonly) BOOL externalPlaybackActive;
@property (nonatomic) float rate; // playback rate
@property (nonatomic, readonly) double bitrate;
@property (nonatomic, readonly) BOOL supportsVideoGravityButton;
@property (nonatomic, readonly, getter = isLiveClosedCaptionsAvailable) BOOL liveClosedCaptionsAvailable;

@optional

@property (nonatomic) BOOL usesExternalPlaybackWhileExternalScreenIsActive;
@property (nonatomic) float volume; /** the player volume*/

/**
 * Get the current item's duration
 * @return duration as CMTime
 */
- (Float64)duration;

/**
 * Get the current playhead time
 * @return the current playhead time as CMTime
 */
- (Float64)playheadTime;

/**
 * @return current frame of playing asset
 */
- (UIImage *)screenshot;

- (void)disablePlaylistClosedCaptions;

@end

#endif // OOPlayerProtocol_h
