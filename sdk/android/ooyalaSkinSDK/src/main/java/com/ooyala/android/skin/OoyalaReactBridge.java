package com.ooyala.android.skin;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ooyala.android.util.DebugMode;

/**
 * A Bridge which handles the sending of events, and receipt of method calls from the UI
 */
public class OoyalaReactBridge extends ReactContextBaseJavaModule implements BridgeEventHandler {
  private BridgeEventHandler handler;

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
    this.handler = handler;
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
    handler.onClosedCaptionUpdateRequested(parameters);
  }

  @ReactMethod
  public void onPress(ReadableMap parameters) {
    handler.onPress(parameters);
  }

  @ReactMethod
  public void shareTitle(ReadableMap parameters) {
    handler.shareTitle(parameters);
  }
  @ReactMethod
  public void shareUrl(ReadableMap parameters) {
    handler.shareUrl(parameters);
  }

  @ReactMethod
  public void onScrub(ReadableMap parameters) {
    handler.onScrub(parameters);
  }

  @ReactMethod
  public void onDiscoveryRow(ReadableMap parameters) {
    handler.onDiscoveryRow(parameters);
  }
}
