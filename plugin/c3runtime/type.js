"use strict";

{
  C3.Plugins.Colyseus.Type = class Colyseus extends C3.SDKTypeBase
  {
    constructor(objectClass)
    {
      super(objectClass);
    }

    Release()
    {
      super.Release();
    }

    OnCreate()
    {
      this.GetImageInfo().LoadAsset(this._runtime);
    }

    LoadTextures(renderer)
    {
      return this.GetImageInfo().LoadStaticTexture(renderer, {
        linearSampling: this._runtime.IsLinearSampling()
      });
    }

    ReleaseTextures()
    {
      this.GetImageInfo().ReleaseTexture();
    }
  };
}
