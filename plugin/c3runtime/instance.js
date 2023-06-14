"use strict";

{
  var Colyseus = globalThis['Colyseus'];

  C3.Plugins.Colyseus_SDK.Instance = class ColyseusInstance extends C3.SDKWorldInstanceBase
  {
    constructor(inst, properties)
    {
      super(inst);

      if (properties)
      {
        this.endpoint = properties[0];
        this.client = new Colyseus.Client(this.endpoint);
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

    _MatchMake (methodName, roomName, options)
    {
        var self = this;
        var options = JSON.parse(options || "{}");

        this.client[methodName](roomName, options).then(function(room) {
          self.room = room;

          self.sessionId = self.room.sessionId;
          self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnJoinRoom);

          room.onError(function (code, message) {
            self.lastError = { code: code, message: message };
            self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnError);
          });

          room.onLeave(function (code) {
            self.lastError = code;
            self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnLeaveRoom);
          });

          room.onStateChange.once(function() {
            function registerCallbacksOnStructure (instance, path) {
              instance.onChange(function(_) { onChange([...path], []) });

              var schema = instance['_definition'].schema;
              for (var field in schema) {
                var schemaType = typeof(schema[field]);
                if (schemaType === "object" || schemaType === "function") {
                  instance[field].onAdd(function (instance, index) { onAdd([...path, field], instance, index); })
                  instance[field].onChange(function (instance, index) { onItemChange([...path, field], instance, index); });
                  instance[field].onRemove(function (instance, index) { onRemove([...path, field], instance, index); })
                }
              }
            }

            function onAdd (path, instance, index) {
              // only register callbacks on child Schema structures.
              if (instance['_definition']) {
                registerCallbacksOnStructure(instance, [...path, index]);
              }

              self.lastPath = path.join(".");
              self.lastIndex = index;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnSchemaAdd);
            }

            function onItemChange (path, instance, index) {
              self.lastPath = path.join(".");
              self.lastIndex = index;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnSchemaChange);
            }

            function onChange (path, changes) {
              self.lastIndex = undefined;
              self.lastPath = path.join(".");
              for (var i = 0, l = changes.length; i < l; i++) {
                self.lastField = changes[i].field;
                self.lastValue = changes[i].value;
                self.lastPreviousValue = changes[i].previousValue;
                self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnSchemaFieldChange);
              }
            }

            function onRemove (path, instance, index) {
              self.lastPath = path.join(".");
              self.lastIndex = index;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnSchemaRemove);
            }

            registerCallbacksOnStructure(self.room.state, []);
          });

          room.onStateChange(function (state) {
            self.lastPath = ".";
            self.lastIndex = undefined;
            self.lastValue = state;
            self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnStateChange);
          });

          room.onMessage("*", function (type, message) {
            if (self.debug)
            {
              console.info("Colyseus: onMessage", type, message);
            }
            self.lastMessage = message;
            self.lastType = type;
            self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnMessage);
          });

        }).catch(function(err) {
            console.error("Colyseus Error:", err.code);
            console.error(err.message);
            self.lastError = err;
            self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnError);
        });
    }
  };

}
