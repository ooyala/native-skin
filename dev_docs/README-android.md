# Android Skin Getting Started Guide

#Prerequisites

In order to be successful running this sample app, you are expected to understand the following:

  1. An understanding of the Android Developer ecosystem, with an understanding of building, running, and publishing applications
  2. An understanding of the Core Ooyala SDK, how to configure and run simple Ooyala integrations (see [https://github.com/ooyala/android-sample-apps](https://github.com/ooyala/android-sample-apps))
  3. A passing understanding of brew, git, and node

# Overview

This document will explain a number of different use cases:

1. How to Run the Sample Application
2. How to perform simple customizations to the Sample Application
3. How to perform complex modifications to the Sample Application
4. How to update an existing application with the Android Skin

# How to Run the Sample Application

These will be the first steps that would allow you to run the Ooyala Skin Sample App, and should be the first thing you try:

1. `git clone https://github.com/ooyala/android-sample-apps`
2. `open android-sample-apps/OoyalaSkinSampleApp` in Android Studio
3. Run the application

# How to Perform Simple Customizations to the Sample Application

### Modify the Skin Config

This will allow you to modify some of the configurations allowed by the Skin Config.  For more information, check out the skin-config repo README.

1. Open OoyalaSkinSampleApp Android Studio Project
2. Modify skin-config/skin.json
3. Re-run the application

### Add your own test assets to the Sample App

Just like all other sample applications, you can modify the ListViewController with your own embed codes to see how your videos work.  Note that your assets may require additional configuration of the application to work.

1. Open OoyalaSkinSampleApp Android Studio Project
2. Modify OoyalaSkinSampleApp/app/src/main/java/com/ooyala/sample/lists/OoyalaSkinListActivity.java
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

To test - you can try to request [http://localhost:8081/index.android.bundle?platform=android&dev=true](http://localhost:8081/index.android.bundle?platform=android&dev=true) and see if results come back

### Use the React Native javascript server in the Sample App

1. Modify Sample App Players to point to React Native JS server

        SkinOptions skinOptions = new SkinOptions.Builder().setEnableReactJSServer(true).build();
        playerLayoutController = new OoyalaSkinLayoutController(getApplication(), skinLayout, player, skinOptions);

2. Enable your device/emulator to access your locally-hosted servers
    Running the following command will allow your emulator/device to hit your locally hosted React Native JS server

        adb -d reverse tcp:8081 tcp:8081
### Run the Ooyala Skin Sample App in an emulator or device

You should be able to run the application, and see your react-native server hit every time you load a video.

## Set Up OoyalaSkinSDK Java Source Code to modify the Native code
After you've tested the application using the React Native JS server, then you should connect the OoyalaSkinSDK Java Source Code to the application.

1. Open OoyalaSkinSampleApp Android Studio Project
2. In OoyalaSkinSampleApp/settings.gradle, add the OoyalaSkinSDK module to your project

        include ':ooyalaSkinSDK'
        project(':ooyalaSkinSDK').projectDir=new File(settingsDir, '../../native-skin/sdk/android/ooyalaSkinSDK/')
3. In OoyalaSkinSampleApp/app/build.gradle, comment out the compiles OoyalaSDK.jar and OoyalaSkinSDK.jar, and add the OoyalaSkinSDK project

        //    compile files('libs/OoyalaSDK.jar')
        //    compile files('libs/OoyalaSkinSDK.jar')
        compile project(':ooyalaSkinSDK')


### Connect Correct skin-config to OoyalaSkinSampleApp.  
The Skin-config may have been updated since the last release, and if you are using the OoyalaSkinSDK source code, you will have to reference the correct version of the skin-config.  
Assuming you have connected the OoyalaSkinSDK to the OoyalaSkinSampleApp:

    1. Delete the existing 'skin-config' folder from OoyalaSkinSampleApp project
    2. Add the new 'skin-config' files from native-skin/skin-config

### Run the Ooyala Skin Sample App in an emulator or device
Now, you should be able to run the application, and see any modifications to the OoyalaSkinSDK within your application

# How to update an existing application with the Android Skin

1. Download and unzip [OoyalaSkinSDK-Android.zip](https://ooyala.box.com/android-skin-release)

2. Copy **OoyalaSkinSDK.jar** into **libs/** directory of your app

3. Copy **react-native-0.33.0.aar** into **libs/** directory of your app

4. Modify your app gradle build file configuration to include OoyalaSkinSDK and React support as shown in the following Gradle build file snippet:

        android {
            compileSdkVersion 23
            buildToolsVersion "23.0.0"
            defaultConfig {
                ...
                minSdkVersion 16
                targetSdkVersion 21
                ndk {
                    // React Native for Android is incompatible with 3rd-party 64-bit libraries.
                    abiFilters "armeabi-v7a", "x86"
                }
            }
            ...
        }
        repositories {
            jcenter()
            flatDir {
                dirs 'libs'
            }
        }
        dependencies {
            compile files('libs/OoyalaSDK.jar')
            compile files('libs/OoyalaSkinSDK.jar')
            compile 'com.android.support:appcompat-v7:23.4.0'
            compile 'com.android.support:recyclerview-v7:23.4.0'
            compile 'com.facebook.fresco:fresco:0.11.0'
            compile 'com.facebook.fresco:imagepipeline-okhttp3:0.11.0'
            compile 'com.facebook.stetho:stetho:1.2.0'
            compile 'com.facebook.soloader:soloader:0.1.0'
            compile 'com.facebook.stetho:stetho-okhttp:1.2.0'
            compile 'com.fasterxml.jackson.core:jackson-core:2.2.3'
            compile group: 'com.google.code.findbugs', name: 'jsr305', version: '3.0.0'
            compile 'com.squareup.okhttp3:okhttp:3.4.1'
            compile 'com.squareup.okhttp3:okhttp-ws:3.4.1'
            compile 'com.squareup.okhttp3:okhttp-urlconnection:3.4.1'
            compile 'com.squareup.okio:okio:1.9.0'
            compile group: 'org.webkit', name: 'android-jsc', version: 'r174650'
            compile(name:'react-native', version:'0.33.0', ext:'aar')
            compile 'javax.inject:javax.inject:1'
        }


5. To let android use 32-bit libraries on 64-bit devices add the following property into the **gradle.properties**:
  ```
  android.useDeprecatedNdk=true
  ```

6. Put **fonts**,**index.android.jsbundle** and **skin.json** into **src/main/assets**

7. Include **OoyalaSkinLayout** to **layout.xml** of activity that displays a player:

    ```
    <com.ooyala.android.ooyalaskinsdk.OoyalaSkinLayout
        android:id="@+id/ooyalaSkin"
    	...
    />
    ```

8. Modify your activity to use new **OoyalaSkinLayout**:
```
public void onCreate(Bundle savedInstanceState) {
    ...
    
    setContentView(R.layout.layout.xml);

    EMBED = getIntent().getExtras().getString("embed_code");

    // Get the SkinLayout from our layout xml
    OoyalaSkinLayout skinLayout = (OoyalaSkinLayout)findViewById(R.id.ooyalaPlayer);

    // Create the OoyalaPlayer, with some built-in UI disabled
    PlayerDomain domain = new PlayerDomain(DOMAIN);
    Options options = new Options.Builder().setShowPromoImage(false).build();
    player = new OoyalaPlayer(PCODE, domain, options);

    //Create the SkinOptions, and setup the LayoutController
    SkinOptions skinOptions = new SkinOptions.Builder().build();
    playerLayoutController = new OoyalaSkinLayoutController(getApplication(), skinLayout, player, skinOptions);	
    ...

}
```

### Working with the events in SkinSDK

1. Implement the Observer object in your Activity. For example:
    ```
        public class OoyalaAndroidTestAppActivity extends Activity implements Observer 
    ```
2. Attach your activity to the skinPlayerLayoutController, like this:
    ```
        skinPlayerLayoutController.addObserver(this);
    ```
3. Implement the update method in the Activity:
    ```
        @Override
        public void update(Observable arg0, Object arg1) {
            final String arg = OoyalaNotification.getNameOrUnknown(arg1);
            if (arg == OoyalaSkinLayoutController.FULLSCREEN_CHANGED_NOTIFICATION_NAME) {
                // ((OoyalaNotification)arg1).getData() method will return value of fullscreen
                // which is : fullscreen = true OR false
                Log.d(TAG, "Fullscreen Notification received : " + arg + " - fullScreen: " + ((OoyalaNotification)arg1).getData());
                // TO-DO code what app will do once they
                //  receive fullscreen changed event
        }
    ```
    - arg0 is always the player instance
    - arg1 is the notification

4. The following notifications are defined as part of the OoyalaSkinLayoutController class:
    ```
        public static final String FULLSCREEN_CHANGED_NOTIFICATION_NAME = "fullscreenChanged";
    ```