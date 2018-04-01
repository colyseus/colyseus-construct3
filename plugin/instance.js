"use strict";

{
  const PLUGIN_CLASS = SDK.Plugins.Colyseus;

  PLUGIN_CLASS.Instance = class ColyseusInstance extends SDK.IInstanceBase
  {
    constructor(sdkType, inst)
    {
      super(sdkType, inst);
    }

    Release()
    {
    }

    OnCreate()
    {
      // this._client = new Colyseus.Client();
    }

    OnPropertyChanged(id, value)
    {
    }

    LoadC2Property(name, valueString)
    {
      return false; // not handled
    }
  };
}
