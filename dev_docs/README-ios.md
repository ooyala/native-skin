# iOS Skin Getting Started Guide

#Prerequisites

In order to be successful running this sample app, you are expected to understand the following:

  1. An understanding of the Apple Developer ecosystem, with an understanding of building, running, and provisioning applications
  2. An understanding of the Core Ooyala SDK, how to configure and run simple Ooyala integrations (see [https://github.com/ooyala/ios-sample-apps](https://github.com/ooyala/ios-sample-apps))
  3. A passing understanding of brew, git, and node

# Overview

This document will explain a number of different use cases:

1. How to Run the Sample Application
2. How to perform simple customizations to the Sample Application
3. How to perform complex modifications to the Sample Application
4. How to update an existing Application with the iOS Skin

it's *highly* reccomended that you attempt these use cases in order, to have a complete understanding of the iOS Skin.

# How to Run the Sample Application

These will be the first steps that would allow you to run the Ooyala Skin Sample App, and should be the first thing you try

1. `git clone https://github.com/ooyala/ios-sample-apps`
2. `open ios-sample-apps/OoyalaSkinSampleApp/OoyalaSkinSampleApp.xcodeproj`
3. Run the application


# How to Perform Simple Customizations to the Sample Application

### Modify the Skin Config

This will allow you to modify some of the configurations allowed by the Skin Config.  For more information, check out the skin-config repo README.

1. Open OoyalaSkinSampleApp.xcodeproj
2. Modify skin-config/skin.json
3. Re-run the application

### Add your own test assets to the Sample App

Just like all other sample applications, you can modify the ListViewController with your own embed codes to see how your videos work.  Note that your assets may require additional configuration of the application to work.

1. Open OoyalaSkinSampleApp.xcodeproj
2. Modify OoyalaSkinSampleApp/players/BasicTestsListViewController.m
3. Re-run the application

# How to Perform Complex Modifications to the Sample Application
The following will run you through linking the OoyalaSkinSDK source code to the OoyalaSkinSampleApp.  This will allow you to do cool things, like modify the UI code and add your own features

At a high level - Android React Native allows you to set up a React JS server, then force your device/emulator to access that server to get up-to-date javascript.

You will need to perform a number of steps to succeed here:

## Set Up React Native to modify the Javascript
The first step would be to get React Native set up and running, then to test it in the Sample App. Follow these steps to give that a shot:

### Setup React Native Dependencies

Please follow the requirements section of the following site: [http://facebook.github.io/react-native/docs/getting-started.html#requirements](http://facebook.github.io/react-native/docs/getting-started.html#requirements)

### Configure OoyalaSkinSDK React Project

run `npm install` in the Ooyala Skin SDK

    cd native-skin/sdk/react/ && npm install

run `git submodule update --init` to initialize the skin-config

### Start React-Native server
You need to start the react-native server to get your javascript to be applied to the sample application

    cd native-skin/sdk/react/ && react-native start

To test - you can try to request [http://localhost:8081/index.ios.bundle?platform=ios&dev=true](http://localhost:8081/index.android.bundle?platform=ios&dev=true) and see if results come back


### Modify Sample App Players to point to React-Native server

1.  Comment out the original jsCodeLocation that points to the compiled bundle, and point it to the server that will be started by React Native

        // NSURL *jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
        NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle"];
4. Run the Ooyala Skin Sample App in a Simulator

In order to run the Sample App on the device,  you will need to provide a url that would be accessible by the physical hardware device (i.e. the local ip of the dev computer)


## Set Up OoyalaSkinSDK Source Code to modify the Native code
After you've tested the application using the React Native JS server, then you should connect the OoyalaSkinSDK Java Source Code to the application.

### Connect OoyalaSkinSDK to OoyalaSkinSampleApp

1. Open OoyalaSkin.xcworkspace
2. Add the OoyalaSkinSampleApp.xcodeproj into OoyalaSkin.xcworkspace
3. In OoyalaSkinSampleApp Project Settings, remove existing OoyalaSkinSDK and add the Workspace version

### Connect correct skin-config to OoyalaSkinSampleApp

The Skin-config may have been updated since the last release, and if you are using the OoyalaSkinSDK source code, you will have to reference the correct version of the skin-config.

Assuming you have connected the OoyalaSkinSDK to the OoyalaSkinSampleApp:

1. Delete the existing 'skin-config' folder from OoyalaSkinSampleApp project
2. Add the new 'skin-config' files from native-skin/skin-config

# How to Update an Existing Application with the iOS Skin

By this point, you should have a strong understanding of how the iOS Skin works, and how to manipulate it within the Ooyala Skin Sample App. Here are the steps to integrate the iOS Skin into your own application.

If you'd like to take another extra step, try _following these steps to update the BasicPlaybackSampleApp_ as proof of the process

1. Download [OoyalaSDK-iOS](http://support.ooyala.com/resources/mobile-and-client-sdks), which contains:
    * Ooyala SDK (link binary with this library)
2. Download [OoyalaSkinSDK-iOS](http://support.ooyala.com/resources/mobile-and-client-sdks), which contains:
    * If the above site hasn't been updated yet, you can download the library [here](http://static.ooyala.com.s3.amazonaws.com/sdk/ios/release/OoyalaSkinSDK-iOS.zip)
    * iOS Skin SDK (link binary with this library)
    * ooyala-slick-type font (Add to bundle. Then in Info.plist, add "ooyala-slick-type.ttf" to "Fonts Provided by Application")
    * Default localization files (Add to app bundle)
    * Default skin-config.json (Add to app bundle)
    * main.jsbundle (Add to app bundle)
3. Link JavascriptCore, Social, MessageUI, MediaAccessibility, MediaPlayer Frameworks to your binary. Also link libz.dylib/libz.tbd library.
4. In Build Settings, ensure the Other Linker Flag "-ObjC" is enabled

5. Modify your PlayerViewController to use the new OOSkinViewController

    Replace the OoyalaPlayerViewController in your application to this new class.  Below is an example of what this could look like

        NSURL *jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main"
                                                        withExtension:@"jsbundle"];
        OOSkinOptions *skinOptions = [[OOSkinOptions alloc] initWithDiscoveryOptions:nil
                                                                      jsCodeLocation:jsCodeLocation
                                                                      configFileName:@"skin"
                                                                     overrideConfigs:nil];
        self.skinController = [[OOSkinViewController alloc] initWithPlayer:ooyalaPlayer
                                                               skinOptions:skinOptions
                                                                    parent:_videoView
                                                             launchOptions:nil];
        [self addChildViewController:self.skinController];

5. Double Check your app.  The following is a list of all known requirements for Ooyala Skin SDK to work in your application

    - Ooyala SDK
        * Should be linked
    - Ooyala Skin SDK
        * Should be linked
        * SDK Version in the Skin package's VERSION file should match the VERSION file in the Ooyala SDK
    - ooyala-slick-type Font
        * Should be bundled
        * Should be part of Info.plist
    - Localization Files (en.json, zh.json, etc.)
        * Should be bundled
    - skin-config.json
        * Should be bundled
    - main.jsbundle
        * Should be bundled
    - Ojbective-C code
        * Should use the OOSkinViewController
        * Should use main.jsbundle as the jsCodeLocaiton
    - Necessary frameworks and libraries are linked
    - Other Linker Flags
        * Should have -ObjC


##Generate ipa for distribution

  1. Open the OoyalaSkinSampleApp, confirm that the the application plays on a physical device
  2. With a provisioned device connected, select OoyalaSkinSampleApp schema and the connected device in Xcode.
  3. From Xcode menu, choose "Product->Archive"
  4. From Xcode orgnizer, choose "Export"
  5. Select "Save for enterprise" and follow the instructions to generate ipa file.

##Build the OoyalaSkinSDK.framework

  1. xcodebuild -project sdk/OoyalaSkinSDK/OoyalaSkinSDK.xcodeproj/ -sdk iphonesimulator -target OoyalaSkinSDKUniversal
  2. find OoyalaSkinSDK.framework in sdk/OoyalaSkinSDK/build/
