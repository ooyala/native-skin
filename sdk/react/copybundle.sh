#!/usr/bin/env bash

react-native bundle --dev=false --bundle-output index.android.jsbundle --entry-file index.android.js --platform android

mv index.android.jsbundle /Users/ivan_sakharovskii/Projects/Ooyala/android/android-sample-apps/vendor/Ooyala/OoyalaSkinSDK-Android/index.android.jsbundle