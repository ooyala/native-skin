package com.ooyala.android.ooyalaskinsdk;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ooyala.android.util.DebugMode;

import java.lang.ref.WeakReference;

/**
 * A Bridge which handles the sending of events, and receipt of method calls from the UI
 */
public class OoyalaReactBridge extends ReactContextBaseJavaModule implements BridgeEventHandler {
  private WeakReference<BridgeEventHandler> handler;

  @Override
  public String getName() {
    return "OoyalaReactBridge";
  }

  /**
   * Create an instance of an OoyalaReactBridge
   * @param c the ReactApplicationContext
   * @param handler the class (Usually the OoyalaSkinLayoutController) that handles all the emitted events
   */
  public OoyalaReactBridge(ReactApplicationContext c, BridgeEventHandler handler) {
    super(c);
    this.handler = new WeakReference<>(handler);
  }

  /**
   * Send an event through the React Bridge.
   * @param eventName the text name of the event to send
   * @param params The WritableMap which is passed as parameters in the event
   */
  public void sendEvent(String eventName, ReadableMap params) {
    ReactContext context = this.getReactApplicationContext();
    if (context.hasActiveCatalystInstance()) {
      context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    } else {
      DebugMode.logW("TAG", "Trying to send an event without an active Catalyst Instance: " + eventName + ", Params:" + params.toString());
    }
  }

  /******** BridgeEventHandler Passthroughs **********/
  @ReactMethod
  public void onClosedCaptionUpdateRequested(ReadableMap parameters) {
    handler.get().onClosedCaptionUpdateRequested(parameters);
  }

  @ReactMethod
  public void onPress(ReadableMap parameters) {
    handler.get().onPress(parameters);
  }

  @ReactMethod
  public void shareTitle(ReadableMap parameters) {
    handler.get().shareTitle(parameters);
  }
  @ReactMethod
  public void shareUrl(ReadableMap parameters) {
    handler.get().shareUrl(parameters);
  }

  @ReactMethod
  public void onScrub(ReadableMap parameters) {
    handler.get().onScrub(parameters);
  }

  @ReactMethod
  public void onDiscoveryRow(ReadableMap parameters) {
    handler.get().onDiscoveryRow(parameters);
  }
}
