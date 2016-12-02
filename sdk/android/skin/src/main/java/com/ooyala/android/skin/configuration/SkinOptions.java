package com.ooyala.android.skin.configuration;

import com.ooyala.android.util.DebugMode;

import org.json.JSONObject;

public class SkinOptions {
  private static final String TAG = SkinOptions.class.getSimpleName();

  // Skin Options variables
  private final String bundleAssetName;
  private final JSONObject skinOverrides;
  private final boolean enableReactJSServer;
  private final String reactJSServerHost;
  private final String skinConfigAssetName;
  /**
   * Supports a fluid syntax for configuration.
   */
  public static class Builder {

    //Builder Variables - Should be same as Skin Options
    private String bundleAssetName;
    private JSONObject skinOverrides;
    private boolean enableReactJSServer;
    private String reactJSServerHost;
    private String skinConfigAssetName;

    /**
     * Defaults to the following values:
     * bundleAssetName = index.android.jsbundle;
     */
    public Builder() {
      this.bundleAssetName = "index.android.jsbundle";
      this.skinOverrides = new JSONObject();
      this.enableReactJSServer = false;
      this.reactJSServerHost = "127.0.0.1:8081";
      this.skinConfigAssetName = "skin.json";
    }

    /**
     * Set the file name of the jsbundle for the Skin included in the application's assets
     * Default: index.android.jsbundle
     * @param bundleAssetName
     * @return the builder, to continue building the Options
     */
    public Builder setBundleAssetName(String bundleAssetName) {
      this.bundleAssetName = bundleAssetName;
      return this;
    }

    /**
     * Set the JSONObject to override parts of the skin.json file in the application
     * Default: new JSONObject()
     * @param skinOverrides
     * @return the builder, to continue building the Options
     */
    public Builder setSkinOverrides(JSONObject skinOverrides) {
      this.skinOverrides = skinOverrides;
      return this;
    }

    /**
     * Setting to true enables the OoyalaSkin to query a server URL to get the Skin Javascript
     * Default: false
     * @param enableReactJSServer
     * @return the builder, to continue building the Options
     */
    public Builder setEnableReactJSServer(boolean enableReactJSServer) {
      this.enableReactJSServer = enableReactJSServer;
      return this;
    }

    /**
     * Set the React JS host server to use when dynamically querying for Skin Javascript
     * Note: Must have enableReactJSServer set to true to be used
     * Default: "127.0.0.1:8081"
     * @param reactJSServerHost
     * @return the builder, to continue building the Options
     */
    public Builder setReactJSServerHost(String reactJSServerHost) {
      this.reactJSServerHost = reactJSServerHost;
      return this;
    }

    /**
     * Set the file name of the skin configuration included in the application's assets
     * Default: "skin.json"
     * @param skinConfigAssetName
     * @return the builder, to continue building the Options
     */
    public Builder setSkinConfigAssetName(String skinConfigAssetName) {
      this.skinConfigAssetName = skinConfigAssetName;
      return this;
    }

    /**
     * Build the Options Class
      @return
     */
    public SkinOptions build() {
      return new SkinOptions(
              bundleAssetName,
              skinOverrides,
              enableReactJSServer,
              reactJSServerHost,
              skinConfigAssetName);
    }
  }

  /**
   * Initialize an Options object with given parameters:
   * @param bundleAssetName
   * @param skinOverrides
   * @param enableReactJSServer
   * @param reactJSServerHost
   * @param skinConfigAssetName
   * @return the initialized Options - Return the configured options.
   */
  private SkinOptions(String bundleAssetName, JSONObject skinOverrides, boolean enableReactJSServer,
                      String reactJSServerHost, String skinConfigAssetName) {
    this.bundleAssetName = bundleAssetName;
    this.skinOverrides = skinOverrides;
    this.enableReactJSServer = enableReactJSServer;
    this.reactJSServerHost = reactJSServerHost;
    this.skinConfigAssetName = skinConfigAssetName;
    DebugMode.logI(TAG, "Skin Options created \n" + this.toString());
  }

  /**
   * Get the file name of the jsbundle for the Skin included in the application's assets
   * @return bundleAssetName
   */
  public String getBundleAssetName() {
    return bundleAssetName;
  }

  /**
   * Get the JSONObject to override parts of the skin.json file in the application
   * @return skinOverrides
   */
  public JSONObject getSkinOverrides() {
    return skinOverrides;
  }

  /**
   * If true, enables the OoyalaSkin to query a server URL to get the Skin Javascript
   * @return enableReactJSServer
   */
  public boolean getEnableReactJSServer() {
    return enableReactJSServer;
  }

  /**
   * Get the React JS host server to use when dynamically querying for Skin Javascript
   * @return reactJSServerHost
   */
  public String getReactJSServerHost() {
    return reactJSServerHost;
  }

  /**
   * Get the file name of the skin configuration included in the application's assets
   * @return skinConfigAssetName
   */
  public String getSkinConfigAssetName() {
    return skinConfigAssetName;
  }

  @Override
  public String toString() {
    String out = "Skin Options: \n";
    out += "  bundleAssetName:" + this.bundleAssetName + "\n";
    out += "  skinOverrides:" + this.skinOverrides.toString() + "\n";
    out += "  enableReactJSServer:" + this.enableReactJSServer + "\n";
    out += "  reactJSServerHost:" + this.reactJSServerHost + "\n";
    out += "  skinConfigAssetName:" + this.skinConfigAssetName + "\n";
    return out;
  }
}
