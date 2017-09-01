#!/bin/sh
react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output index.android.jsbundle
cp ./index.android.jsbundle /Users/ivan_sakharovskii/Projects/Ooyala/android/SampleApps/android-sample-apps/VRSampleApp/app/src/main/assets/
