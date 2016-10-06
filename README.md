# native-skin

This is the repository that contains all information regarding the new iOS and Android Skins. This repo is the source for all things related to the new Ooyala SDK User Interface ('skin').  

**The sample applications will not run without configuration. Please consult the Getting Started Guides for setup.**

# First Steps: iOS Getting Started Guide

Trying things for the first time? [Check out the iOS Skin Getting Started Guide](dev_docs/README-ios.md) to try the sample application, while getting a better understanding of the new iOS Skin, OoyakaSkinSDK-iOS, and OoyalaSkinSampleApp

# First Steps: Android Getting Started Guide

Trying things for the first time? [Check out the Android Skin Getting Started Guide](dev_docs/README-android.md) to try the sample application, while getting a better understanding of the new Android Skin, OoyakaSkinSDK-Android, and OoyalaSkinSampleApp



# Overview

This project focuses on the creation of Ooyala's new Player UI for the native Ooyala SDKs. This new UI must...

1. be visually consistent with the Ooyala Web UI.  
2. be easily integratable with existing Ooyala SDK applications
3. be easily configurable with customization that supports a majority of use cases.
4. be easily modifiable for larger interface changes that some developers may need to make.

This project relies on __React Native__, a UI Framework that allows for similar code to be run for all of Web, Android, and iOS SDKs.

- (iOS) However, in most cases you do not necessarily need to install any React Native dependencies

# Definitions

- **OoyalaSkinSDK.zip**: The zip package that contains all libraries, resources, and auxilary files that are necessary to add the Skin UI to an application
- **OoyalaSkinSDK**: This can refer to two different things:
    1. *Compiled Skin SDK*: This is the OoyalaSkinSDK.framework or OoyalaSkinSDK.jar which you can embed into your application directly
    2. *Source Code SDK*: This is the raw source code that would compile into (1).  You can link this directly into your application as an alternative to (1)
- **OoyalaSkinSampleApp**: The Android or iOS Sample Application that highlights scenarios which demonstrate various features of the Skin UI
- **React Native Javascript**: The javscript that is written with the React Native framework. This code defines the entire UI interface.  This can be delivered to the application in two ways:
    1. *JSBundle*: This refers to the method where you pre-package all of your javascript files into one (called the jsbundle), and you physically insert that into your application (for example, added into the iOS application through the application's bundle).
    2. *Local Hosting*: React Native provides a way to quickly debug and test javascript code by hosting a Node server that packages all of our javascript files on the fly, and put it into the sample app
- **Skin Config**: A series of JSON files that can be found at [https://github.com/ooyala/skin-config](https://github.com/ooyala/skin-config). These files define:
    1. *skin.json*: A configuration that is applied to the OoyalaSkinSDK, which outlines the desired look and feel of the user interface.
    2. *skin-schema.json*: A JSON schema that defines all of the possible options for the skin.json
    3. *[language].json*: A series of files that represent the localization of all strings used in our Skin UI (i.e. en.json, zh.json)

## Other Developer notes

### Running Unit Tests

  1. Some of the JavaScript components have unit tests in their file. It is possible
     to run them using the [Node REPL](https://nodejs.org/api/repl.html).
  1. For example, run the REPL and then do ".load collapsingBarUtils.js" followed by
     "CollapsingBarUtils.TestSuite.Run();".

### Bundle
to bundle iOS or Android:
     cd sdk/react && react-native bundle --dev=false --bundle-output iOS/main.jsbundle --entry-file index.ios.js
     cd sdk/react && react-native bundle --dev=false --bundle-output index.android.jsbundle --entry-file index.android.js --platform android
