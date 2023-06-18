"use strict";

{
  const Colyseus = globalThis['Colyseus'];

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

    _MatchMake (methodName, roomName, rawOptions)
    {
        const self = this;
        const options = JSON.parse(rawOptions || "{}");

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
            // attach static error handler on schema
            if (room.state) {
              room.state.constructor.onError = function(e) {
                console.error("@colyseus/schema:", e);
                self.lastError = { code: -1, message: e.message };
                self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnAnyError);
              };
            }

            function registerCallbacksOnStructure (instance, path) {
              const schema = instance['_definition'].schema;
              for (let field in schema) {
                const schemaType = typeof(schema[field]);
                if (schemaType === "object" || schemaType === "function") {
                  const collection = instance[field];

                  // on item added to collection
                  collection.onAdd(function (instance, key) {
                    self.lastCollection = collection;
                    onItemAdd([...path, field], instance, key);
                  });

                  // on item removed from collection
                  collection.onRemove(function (instance, key) {
                    self.lastCollection = collection;
                    onItemRemove([...path, field], instance, key);
                  });

                  // on item changed in collection
                  collection.onChange(function (instance, key) {
                    self.lastCollection = collection;
                    onItemChange([...path, field], instance, key);
                  });

                } else {
                  instance.listen(field, function (value, previousValue) {
                    self.lastKey = field;
                    self.lastPath = [...path, field].join(".");
                    self.lastValue = value;
                    self.lastPreviousValue = previousValue;
                    if (self.debug) {
                      console.log("onChange", self.lastPath, self.lastKey, self.lastValue);
                    }
                    self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnChangeAtPath);
                  });
                }
              }
            }

            function onItemAdd (path, instance, key) {
              // only register callbacks on child Schema structures.
              if (instance['_definition']) {
                registerCallbacksOnStructure(instance, [...path, key]);
              }

              self.lastCollectionPath = path.join(".");
              self.lastPath = self.lastCollectionPath + "." + key;
              self.lastKey = key;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnCollectionItemAdd);
            }

            function onItemChange (path, instance, key) {
              self.lastCollectionPath = path.join(".");
              self.lastPath = self.lastCollectionPath + "." + key;
              self.lastKey = key;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnCollectionItemChange);
            }

            function onItemRemove (path, instance, key) {
              self.lastCollectionPath = path.join(".");
              self.lastPath = self.lastCollectionPath + "." + key;
              self.lastKey = key;
              self.lastValue = instance;
              self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnCollectionItemRemove);
            }

            registerCallbacksOnStructure(self.room.state, []);
          });

          room.onStateChange(function (state) {
            self.lastPath = "";
            self.lastKey = undefined;
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

    getDeepVariable(rawPath, container) {
      const path = rawPath.split(".");
      let value = container;

      // deeply get the requested variable from the room's state.
      try {
        do {
          value = (typeof (value.get) !== "function") // MapSchema's .get() method
            ? value[path.shift()]
            : value.get(path.shift());
        } while (path.length > 0);

      } catch (e) {
        return undefined;
      }

      return value;
    }


  };

}
