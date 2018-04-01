"use strict";

{
  const PLUGIN_CLASS = SDK.Plugins.Colyseus;

  PLUGIN_CLASS.Type = class ColyseusPluginType extends SDK.ITypeBase
  {
    constructor(sdkPlugin, iObjectType)
    {
      super(sdkPlugin, iObjectType);
    }
  };
}
