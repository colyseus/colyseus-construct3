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
            self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnRoomError);
            self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnAnyError);
          });

          room.onLeave(function (code) {
            self.lastCloseCode = code;
            self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnLeaveRoom);
          });

          room.onStateChange.once(function() {
            function registerCallbacksOnStructure (instance, path) {
              instance.onChange(function(_) { onChange([...path], instance) });

              var schema = instance['_definition'].schema;
              for (var field in schema) {
                var schemaType = typeof(schema[field]);
                if (schemaType === "object" || schemaType === "function") {
                  var collection = instance[field];

                  // on item added to collection
                  collection.onAdd(function (instance, index) {
                    self.lastCollection = collection;
                    onItemAdd([...path, field], instance, index);
                  });

                  // on item removed from collection
                  collection.onRemove(function (instance, index) {
                    self.lastCollection = collection;
                    onItemRemove([...path, field], instance, index);
                  });

                  // on item changed in collection
                  collection.onChange(function (instance, index) {
                    self.lastCollection = collection;
                    onItemChange([...path, field], instance, index);
                  });
                }
              }
            }

            function onItemAdd (path, instance, index) {
              // only register callbacks on child Schema structures.
              if (instance['_definition']) {
                registerCallbacksOnStructure(instance, [...path, index]);
              }

              self.lastCollectionPath = path.join(".");
              self.lastPath = self.lastCollectionPath + "." + index;
              self.lastIndex = index;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnCollectionItemAdd);
            }

            function onItemChange (path, instance, index) {
              self.lastCollectionPath = path.join(".");
              self.lastPath = self.lastCollectionPath + "." + index;
              self.lastIndex = index;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnCollectionItemChange);
            }

            function onItemRemove (path, instance, index) {
              self.lastCollectionPath = path.join(".");
              self.lastPath = self.lastCollectionPath + "." + index;
              self.lastIndex = index;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnCollectionItemRemove);
            }

            function onChange (path, instance) {
              self.lastIndex = undefined;
              self.lastPath = path.join(".");
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnChangeAtPath);
            }

            registerCallbacksOnStructure(self.room.state, []);
          });

          room.onStateChange(function (state) {
            self.lastPath = "";
            self.lastIndex = undefined;
            self.lastValue = state;
            self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnStateChange);
          });

          room.onMessage("*", function (type, message) {
            if (self.debug) {
              console.info("Colyseus: onMessage", type, message);
            }
            self.lastMessage = message;
            self.lastType = type;
            self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnMessage);
          });

        }).catch(function (e) {
          if (self.debug) {
            console.error("Colyseus Error:", e.code);
            console.error(e.message);
          }
          if (e instanceof ProgressEvent) {
            self.lastError = { code: e.target.status, message: e.target.statusText };
          } else {
            self.lastError = e;
          }
          self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnJoinError);
          self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnAnyError);
        });
    }

    getDeepVariable(path, container) {
      var path = path.split(".");
      var value = container;

      // deeply get the requested variable from the room's state.
      try {
        do {
          value = (typeof (value.get) !== "function") // MapSchema's .get() method
            ? value[path.shift()]
            : value.get(path.shift());
        } while (path.length > 0);
      } catch (e) {
        console.warn(e);
        return null;
      }

      return value;
    }
  };

}
