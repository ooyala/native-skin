# ios-skin

This is the repository that contains all information regarding the new iOS Skin

## Overview

## iOS Getting Started Guide

[Check out the iOS Skin Getting Started Guide](dev_docs/README-ios.md) to get a better understanding of the new iOS Skin, OoyakaSkinSDK-iOS, and OoyalaSkinSampleApp


# Below this is unorganized developer notes

##Run sample app on device without a service

  1. on terminal go to sdk/OoyalaSkinSDK
  2. run "react-native bundle" (note: react-native bundle --minify does not work) 
  3. run "cp iOS/main.jsbundle ../../app/OoyalaSkinSampleApp/OoyalaSkinSampleApp/main.jsbundle"
  4. in DefaultSkinPlayerViewController.m comment out "NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle"];"
  5. uncomment "NSURL *jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];"
  6. now you should be able to run the app on device.

##Generate ipa for distribution

  1. Follow the steps in previous section to run sample app on device
  2. With a provisioned device connected, select OoyalaSkinSampleApp schema and the connected device in Xcode.
  3. From Xcode menu, choose "Product->Archive"
  4. From Xcode orgnizer, choose "Export"
  5. Select "Save for enterprise" and follow the instructions to generate ipa file. 

##Build the OoyalaSkinSDK.framework

  1. xcodebuild -project sdk/OoyalaSkinSDK/OoyalaSkinSDK.xcodeproj/ -sdk iphonesimulator -target OoyalaSkinSDKUniversal
  2. find OoyalaSkinSDK.framework in sdk/OoyalaSkinSDK/build/

##Running Unit Tests

  1. Some of the JavaScript components have unit tests in their file. It is possible
     to run them using the [Node REPL](https://nodejs.org/api/repl.html).
  1. For example, run the REPL and then do ".load collapsingBarUtils.js" followed by
     "CollapsingBarUtils.TestSuite.Run();".
  
