package com.ooyala.android.ooyalaskinsdk;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.uimanager.ViewManager;
import com.ooyala.android.OoyalaPlayer;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zchen on 9/21/15.
 */

class OoyalaReactPackage extends MainReactPackage {
  private OoyalaSkinLayout _layout;
  private OoyalaPlayer _player;
  private ReactPackage _mainPackage;

  public OoyalaReactPackage(OoyalaSkinLayout l, OoyalaPlayer p) {
    super();
    _layout = l;
    _player = p;
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.addAll(super.createNativeModules(reactContext));
    modules.add(new OoyalaSkinLayoutController(reactContext, _layout, _player));
    return modules;
  }

  @Override
  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return super.createJSModules();
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    List<ViewManager> managers = new ArrayList<>();
    managers.addAll(super.createViewManagers(reactContext));
    managers.add(new ClosedCaptionsViewManager());
    managers.add(new CountdownViewManager());
    managers.add(new VolumeViewManager());
    return managers;
  }
}
