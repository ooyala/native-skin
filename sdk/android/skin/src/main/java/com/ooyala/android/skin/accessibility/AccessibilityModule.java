package com.ooyala.android.skin.accessibility;

import android.content.Context;
import android.view.View;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityManager;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

/**
 * Created by orobles on 1/5/18.
 */

@ReactModule(name = "AndroidAccessibility")
public class AccessibilityModule extends ReactContextBaseJavaModule {

    public AccessibilityModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AndroidAccessibility";
    }

    @ReactMethod
    public void announce(String message) {
        AccessibilityManager manager = (AccessibilityManager) getReactApplicationContext()
                .getSystemService(Context.ACCESSIBILITY_SERVICE);
        if (manager !=  null && manager.isEnabled()) {
            AccessibilityEvent e = AccessibilityEvent.obtain();
            e.setEventType(AccessibilityEvent.TYPE_ANNOUNCEMENT);
            e.setClassName(getClass().getName());
            e.setPackageName(getReactApplicationContext().getPackageName());
            e.getText().add(message);
            manager.sendAccessibilityEvent(e);
        }
    }
}
