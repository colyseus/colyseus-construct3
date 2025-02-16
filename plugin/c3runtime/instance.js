const Colyseus = globalThis['Colyseus'];

const C3 = globalThis.C3;

C3.Plugins.Colyseus_SDK.Instance = class ColyseusInstance extends globalThis.ISDKInstanceBase {
  constructor() {
    super();

    const properties = this._getInitProperties();

    if (properties) {
      this.endpoint = properties[0] || this.endpoint;
      this.client = new Colyseus.Client(this.endpoint);
    }
  }

  _release()
	{
		super._release();
	}

	_saveToJson()
	{
		return {
			// data to be saved for savegames
		};
	}

	_loadFromJson(o)
	{
		// load state for savegames
	}

  _MatchMake(methodName, roomName, rawOptions) {
    const self = this;

    const options = (methodName !== "reconnect")
      ? JSON.parse(rawOptions || "{}")
      : rawOptions;

    const args = (methodName === "consumeSeatReservation" || methodName === "reconnect")
      ? [options]
      : [roomName, options];

    this.client[methodName](...args).then(function (room) {
      const $ = Colyseus.getStateCallbacks(room);

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

      room.onStateChange.once(function () {
        function registerCallbacksOnStructure(schemaInstance, path) {
          const metadata = schemaInstance.constructor[Symbol.metadata];

          for (const index in metadata) {
            const field = metadata[index].name;
            const type = metadata[index].type;
            const schemaType = typeof(type);

            if (schemaType === "object") {
              const isSchemaChild = Object.values(type).some((value) => value['_definition']);

              // on item added to collection
              $(schemaInstance)[field].onAdd(function (item, key) {
                self.lastCollection = schemaInstance[field];
                onItemAdd([...path, field], item, key, isSchemaChild);

                //
                // if it's a Schema child, detect changes on it and trigger
                // "On item change" in the collection itself
                //
                if (isSchemaChild) {
                  // trigger "On item change"
                  $(item).onChange(function () {
                    onItemChange([...path, field], item, key);
                  });
                }
              });

              // on item removed from collection
              $(schemaInstance)[field].onRemove(function (item, key) {
                self.lastCollection = schemaInstance[field];
                onItemRemove([...path, field], item, key);
              });

            } else if (schemaType === "function") {
              $(schemaInstance).listen(field, function (instance, _) {
                // created the schema instance
                onChangeAtPath(field, path, instance, undefined);

                // direct schema instance
                $(instance).onChange(function () {
                  onChangeAtPath(field, path, instance, undefined);
                });

                // "listen" on all instance fields
                registerCallbacksOnStructure(instance, [...path, field]);
              });

            } else {

              // field on schema instance
              $(schemaInstance).listen(field, function (value, previousValue) {
                onChangeAtPath(field, path, value, previousValue);
              });
            }
          }
        }

        function onChangeAtPath(key, path, value, previousValue) {
          self.lastKey = key;
          self.lastPath = [...path, key].join(".");
          self.lastValue = value;
          self.lastPreviousValue = previousValue;
          if (self.debug) {
            console.log("onChange", self.lastPath, self.lastKey, self.lastValue);
          }
          self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnChangeAtPath);
        }

        function onItemAdd(path, instance, key, isSchemaChild) {
          // only register callbacks on child Schema structures.
          if (isSchemaChild) {
            registerCallbacksOnStructure(instance, [...path, key]);
          }

          self.lastCollectionPath = path.join(".");
          self.lastPath = self.lastCollectionPath + "." + key;
          self.lastKey = key;
          self.lastValue = instance;
          self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnChangeAtPath);
          self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnCollectionItemAdd);
        }

        function onItemChange(path, instance, key) {
          self.lastCollectionPath = path.join(".");
          self.lastPath = self.lastCollectionPath + "." + key;
          self.lastKey = key;
          self.lastValue = instance;
          self.Trigger(C3.Plugins.Colyseus_SDK.Cnds.OnCollectionItemChange);
        }

        function onItemRemove(path, instance, key) {
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
      if (this.debug) {
        console.warn("Colyseus: no value at path '" + rawPath + "'. Using empty string: \"\"", { path: rawPath, value: JSON.stringify(container) });
      }
      value = "";
    }

    return value;
  }

  castType(value) {
    //
    // Some types are not easily usable by C3, so we need to cast them.
    //
    switch (typeof (value)) {
      case "boolean":
        // convert boolean to number
        return Number(value);

      case "object":
        return JSON.stringify(value);

      case "number":
        return value;

      default:
        // Everything else
        // (in case of undefined, convert it to empty string)
        return value || "";
    }
  }
};
