"use strict";

{
  C3.Plugins.Colyseus.Instance = class ColyseusInstance extends C3.SDKWorldInstanceBase
  {
    constructor(inst, properties)
    {
      super(inst);

      if (properties)
      {
        this.endpoint = properties[0];
      }
    }

    Release()
    {
      super.Release();
    }

    Draw(renderer)
    {
      //
    }

    SaveToJson()
    {
      return {
        // data to be saved for savegames
      };
    }

    LoadFromJson(o)
    {
      // load state for savegames
    }
  };

}
