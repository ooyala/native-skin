# Creating Buttons
Here are high level steps on how to create a button, and follow the execution through the entire workflow
Feel free to PR your own notes if you have more detailed information you'd like to add

## Make a button constant
https://github.com/ooyala/native-skin/blob/stable/sdk/react/constants.js#L12

## Add the button within the skin.json
You may need to work on getting a button into the Alice Font, which is more work than this conversation.
You may also consider creating your own font file for your own.

https://github.com/ooyala/skin-config/blob/857608f90ffbc1b78b16799caec0b9276bdba915/skin.json#L208

https://github.com/ooyala/skin-config/blob/857608f90ffbc1b78b16799caec0b9276bdba915/skin.json#L226

https://github.com/ooyala/skin-config/blob/857608f90ffbc1b78b16799caec0b9276bdba915/skin-schema.json#L1121

## Create a Widget
https://github.com/ooyala/native-skin/blob/stable/sdk/react/widgets/controlBarWidgets.js#L95

## Add to the Widget Map
https://github.com/ooyala/native-skin/blob/stable/sdk/react/widgets/controlBarWidgets.js#L157

## Listen to the button in the Native code
https://github.com/ooyala/native-skin/blob/stable/sdk/android/ooyalaSkinSDK/src/main/java/com/ooyala/android/skin/OoyalaSkinBridgeEventHandlerImpl.java#L54

https://github.com/ooyala/native-skin/blob/stable/sdk/iOS/OoyalaSkinSDK/OOReactBridge.m#L61

(Probably good to add a generic "Else, emit an event on the notification queue")

## Respond within the Native code

You would need to listen to the event emitted by the native code

