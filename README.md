# ios-skin

The Alice redesign for the iOS SDK.

##Prerequisites

In order to be successful running this sample app, you are expected to understand the following:

  1. An understanding of the Apple Developer ecosystem, with an understanding of building, running, and provisioning applications
  2. An understanding of the Core Ooyala SDK, how to configure and run simple Ooyala integrations (see https://github.com/ooyala/ios-sample-apps)
  3. A passing understanding of brew, git, and node

##In order to run the sample app, please first install React's required installs

For more details please refer to: https://facebook.github.io/react-native/docs/getting-started.html#content

  1. install xcode
  2. install homebrew
  3. brew install node
  4. brew install watchman

##Clone this repo and update submodule:
  1. git clone git@github.com:ooyala/ios-skin.git
  2. git submodule init
  3. git submodule update

##Now install react-native:

  1. cd sdk/OoyalaSkinSDK
  2. npm install

##Now you should be able to run the sample app

  1. go to repo root
  2. open OoyalaSkin.xcworkspace
  3. launch OoyalaSkin

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
