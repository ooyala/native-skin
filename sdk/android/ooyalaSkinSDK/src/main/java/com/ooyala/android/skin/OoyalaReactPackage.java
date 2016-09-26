package com.ooyala.android.skin;


import javax.inject.Provider;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.ModuleSpec;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.uimanager.ViewManager;
import com.ooyala.android.skin.view.ClosedCaptionsViewManager;
import com.ooyala.android.skin.view.CountdownViewManager;
import com.ooyala.android.skin.view.VolumeViewManager;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zchen on 9/21/15.
 */

class OoyalaReactPackage extends MainReactPackage {
  private static final String TAG = OoyalaReactPackage.class.getSimpleName();
  private OoyalaSkinLayoutController _layoutcontroller;
  private OoyalaReactBridge _bridge;

  public OoyalaReactPackage(OoyalaSkinLayoutController lc) {
    super();
    _layoutcontroller = lc;
  }

  @Override
  public List<ModuleSpec> getNativeModules(final ReactApplicationContext context) {
    List<ModuleSpec> list =  new ArrayList<>();
    list.addAll(super.getNativeModules(context));
    _bridge = new OoyalaReactBridge(context, _layoutcontroller.getBridgeEventHandler());
    list.add(new ModuleSpec(OoyalaReactBridge.class, new Provider() {
      public NativeModule get() {
        return _bridge;
      }
    }));

    return list;
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

  public OoyalaReactBridge getBridge() {
    return _bridge;
  }
}
