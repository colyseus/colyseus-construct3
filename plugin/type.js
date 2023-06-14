"use strict";

{
  const PLUGIN_CLASS = SDK.Plugins.Colyseus_SDK;

  PLUGIN_CLASS.Type = class ColyseusPluginType extends SDK.ITypeBase
  {
    constructor(sdkPlugin, iObjectType)
    {
      super(sdkPlugin, iObjectType);
    }
  };
}
