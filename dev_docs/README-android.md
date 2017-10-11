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

You will need to perform a number of steps to succeed here:

## Setup the Javascript code in the sample app
At a high level - If you make changes to the javascript code you will need to bundle it using react native cli tools and add the new bundle to the sample application.

### Setup React Native dependencies
Please follow the requirements section of the following site: [http://facebook.github.io/react-native/docs/getting-started.html#requirements](http://facebook.github.io/react-native/docs/getting-started.html#requirements)

### Configure OoyalaSkinSDK React Project
run `npm install` in the Ooyala Skin SDK

    `cd native-skin/sdk/react/ && npm install`

run `git submodule update --init` to initialize the skin-config

### Bundle the javascript into a file
Whenever you make a change in the javascript code you need to bundle the javascript code into a single file and add it to the sample app. To do so you need to run the `react-native bundle` command, here is an example that will output the content to the file `index.android.jsbundle` in your current directory, you may want to use the same name (`index.android.jsbundle`) since that is the default name in the SkinSDK. Be sure to run this command from the `sdk/react/` folder after you installed the node dependencies.

Example:
`cd sdk/react/ && react-native bundle --dev=false --bundle-output index.android.jsbundle --entry-file index.android.js --platform android`

### Copy the bundled javascript into the sample app
After you have the `index.android.jsbundle` file you need to copy it into the OoyalaSkinSampleApp. You need to copy it into the folder `app/src/main/assets/` of the Sample app.

### Comment out unnecessary Gradle tasks
In the OoyalaSkinSampleApp open the file `app/build.gradle` and comment all the methods the _Task_ suffix. For Example:

```
//task copyAssetsTask(type: Copy) {
//    from new File(vendorDir, 'Ooyala/OoyalaSkinSDK-Android/index.android.jsbundle')
//    from new File(vendorDir, 'Ooyala/OoyalaSkinSDK-Android/skin-config/skin.json')
//    into new File(projectDir, './src/main/assets')
//    println "Assets updated."
//}
//tasks.copyAssetsTask.execute()
//
// comment out the rest of the other methods/tasks with xTask format as the name.
```

### Run the OoyalaSkinSampleApp in an emulator or device
You should be able to run the application and see that you are now using the javascript code you bundled in the app. In javascript you can try adding a `console.log` to verify you are using it. The log will be output in the android monitor of Android Studio.

## Set Up OoyalaSkinSDK Java Source Code to modify the Native code
You should also connect the OoyalaSkinSDK Java Source Code to the application.

* Open OoyalaSkinSampleApp Android Studio Project
* In `OoyalaSkinSampleApp/settings.gradle`, add the `:skin` module to your project

```
include ':skin'
project(':skin').projectDir=new File(settingsDir, '../../native-skin/sdk/android/skin/')
```

* You will get errors after trying to import the skin module. To fix them open `native-skin/sdk/android/build.gradle` and copy the `ext` variables defined and a couple of the classpath dependencies listed in the file into the `OoyalaSkinSampleApp/build.gradle` file. At the end the build.gradle from the sample app should look similar to the following code snippet:

```
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:2.3.3'
        classpath 'com.novoda:bintray-release:0.3.4'
        classpath 'com.github.dcendents:android-maven-gradle-plugin:1.5'
    }
}

allprojects {
    repositories {
        jcenter()
    }
}

ext {
    vendorDir = new File(projectDir, '../vendor')
}

project.ext.libraryVersion = 'X.X.X'
project.ext.publishedGroupId = 'X'
project.ext.bintrayRepo = "X"

project.ext.developerId = 'X'
project.ext.developerName = 'x'
project.ext.developerEmail = 'email@email.com'

project.ext.bintrayUser = 'X'
project.ext.bintrayApiKey = 'X'

project.ext.androidSDKPath = file("${projectDir}/../").absolutePath
```

* In `OoyalaSkinSampleApp/app/build.gradle`, comment out the compiled `OoyalaSDK.jar` and `OoyalaSkinSDK.jar`, and add the `:skin` module

```
dependencies {
// compile files('libs/OoyalaSDK.jar')
// compile files('libs/OoyalaSkinSDK.jar')
compile project(':skin')

... // more dependencies
}
```

### Connect Correct skin-config to OoyalaSkinSampleApp.  
The Skin-config may have been updated since the last release, and if you are using the OoyalaSkinSDK source code, you will have to reference the correct version of the skin-config.  
Assuming you have connected the OoyalaSkinSDK to the OoyalaSkinSampleApp:

    1. Delete the existing `app/src/main/assets/skin-config` folder from OoyalaSkinSampleApp project
    2. Add the new `skin-config` files from native-skin/skin-config into the same assets folder of the sample app.
    3. Copy the `skin.json` from `skin-config` and put it in `app/src/main/assets/` outside of the skin-config folder.

### Run the Ooyala Skin Sample App in an emulator or device
Now, you should be able to run the application, and see any modifications to the OoyalaSkinSDK (skin module) within your application

# How to update an existing application with the Android Skin

1. Download and unzip [OoyalaSkinSDK-Android.zip](https://ooyala.box.com/android-skin-release)

2. Copy **OoyalaSkinSDK.jar** into **libs/** directory of your app

3. Copy **react-native-0.35.0.aar** into **libs/** directory of your app

4. Modify your app gradle build file configuration to include OoyalaSkinSDK and React support as shown in the following Gradle build file snippet:

        android {
            compileSdkVersion 25
            buildToolsVersion "25.0.2"
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
            compile 'com.google.android.exoplayer:exoplayer:r1.5.7'
            compile 'com.android.support:appcompat-v7:25.3.1'
            compile 'com.android.support:recyclerview-v7:25.3.1'
            compile 'com.facebook.fresco:fresco:0.11.0'
            compile 'com.facebook.fresco:imagepipeline-okhttp3:0.11.0'
            compile 'com.facebook.stetho:stetho:1.2.0'
            compile 'com.facebook.soloader:soloader:0.1.0'
            compile 'com.facebook.stetho:stetho-okhttp:1.2.0'
            compile 'com.fasterxml.jackson.core:jackson-core:2.2.3'
            compile 'com.google.code.findbugs:jsr305:3.0.0'
            compile 'com.squareup.okhttp3:okhttp:3.4.1'
            compile 'com.squareup.okhttp3:okhttp-ws:3.4.1'
            compile 'com.squareup.okhttp3:okhttp-urlconnection:3.4.1'
            compile 'com.squareup.okio:okio:1.9.0'
            compile 'org.webkit:android-jsc:r174650'
            compile(name:'react-native', version:'0.35.0', ext:'aar')
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
