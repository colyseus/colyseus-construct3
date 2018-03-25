"use strict";

{
  const PLUGIN_CLASS = SDK.Plugins.Colyseus;

  PLUGIN_CLASS.Instance = class MyCustomInstance extends SDK.IInstanceBase
  {
    constructor(sdkType, inst)
    {
      super(sdkType, inst);
    }

    Release()
    {
    }

    Draw (iRenderer, iDrawParams) {
        debugger;
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
