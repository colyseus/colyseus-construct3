"use strict";

{
  var Colyseus = globalThis['Colyseus'];

  C3.Plugins.Colyseus.Instance = class ColyseusInstance extends C3.SDKWorldInstanceBase
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
          self.Trigger(C3.Plugins.Colyseus.Cnds.OnJoinRoom);

          room.onError(function (code, message) {
            self.lastError = { code: code, message: message };
            self.Trigger(C3.Plugins.Colyseus.Cnds.OnError);
          });

          room.onStateChange.once(function() {
            function registerCallbacksOnStructure (instance, path) {
              instance.onChange = onChange.bind(undefined, [...path]);

              var schema = instance['_definition'].schema;
              for (var field in schema) {
                var schemaType = typeof(schema[field]);
                if (schemaType === "object" || schemaType === "function") {
                  instance[field].onAdd = onAdd.bind(undefined, [...path, field]);
                  instance[field].onChange = onItemChange.bind(undefined, [...path, field]);
                  instance[field].onRemove = onRemove.bind(undefined, [...path, field]);
                }
              }

              instance.triggerAll();
            }

            function onAdd (path, instance, index) {
              // only register callbacks on child Schema structures.
              if (instance['_definition']) {
                registerCallbacksOnStructure(instance, [...path, index]);
              }

              self.lastPath = path.join(".");
              self.lastIndex = index;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus.Cnds.OnSchemaAdd);
            }

            function onItemChange (path, instance, index) {
              self.lastPath = path.join(".");
              self.lastIndex = index;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus.Cnds.OnSchemaChange);
            }

            function onChange (path, changes) {
              self.lastIndex = undefined;
              self.lastPath = path.join(".");
              for (var i = 0, l = changes.length; i < l; i++) {
                self.lastField = changes[i].field;
                self.lastValue = changes[i].value;
                self.lastPreviousValue = changes[i].previousValue;
                self.Trigger(C3.Plugins.Colyseus.Cnds.OnSchemaFieldChange);
              }
            }

            function onRemove (path, instance, index) {
              self.lastPath = path.join(".");
              self.lastIndex = index;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus.Cnds.OnSchemaRemove);
            }

            registerCallbacksOnStructure(self.room.state, []);
          });

          room.onStateChange(function (state) {
            self.Trigger(C3.Plugins.Colyseus.Cnds.OnStateChange);
          });

          room.onMessage("*", function (type, message) {
            if (self.debug)
            {
              console.info("Colyseus: onMessage", type, message);
            }
            self.lastValue = message;
            self.lastType = type;
            self.Trigger(C3.Plugins.Colyseus.Cnds.OnMessage);
          });

        }).catch(function(err) {
            console.error("Colyseus Error:", err.code);
            console.error(err.message);
            self.lastError = err;
            self.Trigger(C3.Plugins.Colyseus.Cnds.OnError);
        });
    }
  };

}
