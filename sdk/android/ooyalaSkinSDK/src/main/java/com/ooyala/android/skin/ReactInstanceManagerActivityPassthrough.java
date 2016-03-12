package com.ooyala.android.skin;

import android.app.Activity;

import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

interface ReactInstanceManagerActivityPassthrough {
  void onBackPressed();
  void onPause();
  void onResume(
          Activity activity,
          DefaultHardwareBackBtnHandler defaultBackButtonImpl);
  void onDestroy();
}
