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

# How to update an existing Application with the Android Skin

1. Download and unzip OoyalaSkinSDK.zip

2. Copy **OoyalaSkinSDK.jar** into **libs/** directory of your app

3. Modify your app gradle build file configuration to include OoyalaSkinSDK and React support as shown in the following Gradle build file snippet:

    ```
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

    dependencies {
        compile files('libs/OoyalaSDK.jar')
        compile files('libs/OoyalaSkinSDK.jar')
        compile 'com.facebook.react:react-native:0.16.+'
    }
    ``` 

4. To let android use 32-bit libraries on 64-bit devices add the following property into the **gradle.properties**:
  ```
  android.useDeprecatedNdk=true
  ```

5. Put **fonts**,**index.android.bundle** and **skin.json** into **src/main/assets**

6. Include **OoyalaSkinLayout** to **layout.xml** of activity that displays a player:

    ```
    <com.ooyala.android.ooyalaskinsdk.OoyalaSkinLayout
        android:id="@+id/ooyalaSkin"
    	...
    />
    ```

7. Modify your activity to use new **OoyalaSkinLayout**:
```
public void onCreate(Bundle savedInstanceState) {
    ...
    
    setContentView(R.layout.layout.xml);

    EMBED = getIntent().getExtras().getString("embed_code");

    //Initialize the player
    OoyalaSkinLayout skinLayout = (OoyalaSkinLayout)findViewById(R.id.ooyalaSkin);
    PlayerDomain domain = new PlayerDomain(DOMAIN);
    Options options = new Options.Builder()
              .setShowAdsControls(false)
              .setShowPromoImage(true)
              .setPreloadContent(false)
              .build();
    player = new OoyalaPlayer(PCODE, domain, options);

    OoyalaSkinLayoutController controller = new OoyalaSkinLayoutController(getApplication(), skinLayout, player);
	
    ...

}
```
