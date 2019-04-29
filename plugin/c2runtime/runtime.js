// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Colyseus = function(runtime)
{
  this.runtime = runtime;
};

(function ()
 {
   var Colyseus = window['Colyseus'];

   var pluginProto = cr.plugins_.Colyseus.prototype;

   /////////////////////////////////////
   // Object type class
   pluginProto.Type = function(plugin)
   {
     this.plugin = plugin;
     this.runtime = plugin.runtime;
   };

   var typeProto = pluginProto.Type.prototype;

   typeProto.onCreate = function()
   {
   };

   /////////////////////////////////////
   // Instance class
   pluginProto.Instance = function(type)
   {
     this.type = type;
     this.runtime = type.runtime;

     // Initialise object properties
     this.endpoint = "";
   };

   var instanceProto = pluginProto.Instance.prototype;

   instanceProto.onCreate = function()
   {
     // Read properties set in C3
     this.endpoint = this.properties[0];
   };

  //  instanceProto.onDestroy = function()
  //  {
  //    // leave the room
  //    if (this.room) { this.room.leave(); }
   
  //    // close the connection with server.
  //    if (client) { client.close(); }
  //  };

   instanceProto.saveToJSON = function ()
   {
     return {};
   };

   instanceProto.loadFromJSON = function (o)
   {
   };

   /**BEGIN-PREVIEWONLY**/
   instanceProto.getDebuggerValues = function (propsections)
   {
   };
   /**END-PREVIEWONLY**/

   //////////////////////////////////////
   // Conditions
   function Cnds() { };

   /**
    * Conditions for Client
    */
   Cnds.prototype.OnOpen = function () { return true; };
   Cnds.prototype.OnClose = function () { return true; };
   Cnds.prototype.OnClientError = function () { return true; };

   /**
    * Conditions for Room
    */
   Cnds.prototype.OnJoinRoom = function () { return true; };
   Cnds.prototype.OnLeaveRoom = function () { return true; };
   Cnds.prototype.OnRoomError = function () { return true; };
   Cnds.prototype.OnStateChange = function () { return true; };
   Cnds.prototype.OnMessage = function (type) { return this.lastType === type; };


   /* Schema Serializer */
   Cnds.prototype.OnSchemaAdd = function (path) { return checkPath(this.lastPath, path); },
   Cnds.prototype.OnSchemaChange = function (path) {
     console.log("OnSchemaChange:", this.lastPath, path);
     return checkPath(this.lastPath, path); 
   },
   Cnds.prototype.OnSchemaFieldChange = function (path) { return checkPath(this.lastPath, path); },
   Cnds.prototype.OnSchemaRemove = function (path) { return checkPath(this.lastPath, path); },

   Cnds.prototype.IsIndex = function (index) { return this.lastIndex === index; },
   Cnds.prototype.IsField = function (field) { return this.lastField === field; }

  //  var operations = ['any', 'add', 'replace', 'remove'];
  //  Cnds.prototype.OnRoomListen = function (path, operationIndex) {
  //    var self = this;
  //    var change = this.lastChange;
  //    var operation = operations[operationIndex];

  //    // the operation doesn't match with the operation user is interested in.
  //    if (operation !== "any" && change.operation !== operation) {
  //      return false;
  //    }

  //    var rules = path.split("/");

  //    if (!this.listeners[path]) {
  //      rules = rules.map(function(segment) {
  //        // replace placeholder matchers
  //        return (segment.indexOf(":") === 0)
  //          ? self.room.matcherPlaceholders[segment] || self.room.matcherPlaceholders[":*"]
  //          : new RegExp("^" + segment + "$");
  //      });
  //      this.listeners[path] = rules;
  //    }

  //    if (change.path.length !== this.listeners[path].length) {
  //      return false;
  //    }

  //    for (var i = 0, len = this.listeners[path].length; i < len; i++) {
  //      let matches = change.path[i].match(this.listeners[path][i]);
  //      if (!matches || matches.length === 0 || matches.length > 2) {
  //        return false;
  //      }
  //    }

  //    // alright! let's execute the callback!
  //    return true;
  //  };

   pluginProto.cnds = new Cnds();

   //////////////////////////////////////
   // Actions
   function Acts() {};

   Acts.prototype.Connect = function (endpoint)
   {
     var self = this;

     this.client = new Colyseus.Client(endpoint || this.endpoint);
     this.client.onError.add(function() { self.runtime.trigger(pluginProto.cnds.OnClientError, self); });
     this.client.onOpen.add(function() { self.runtime.trigger(pluginProto.cnds.OnOpen, self); });
     this.client.onClose.add(function() { self.runtime.trigger(pluginProto.cnds.OnClose, self); });
   };

   Acts.prototype.Disconnect = function ()
   {
     if (this.client) {
       this.client.close();
     }
   };

   Acts.prototype.JoinRoom = function (roomName, options)
   {
     var self = this;
     var options = JSON.parse(options || "{}");

     this.room = this.client.join(roomName, options);
     this.listeners = {};

     this.room.onError.add(function () {
       self.runtime.trigger(pluginProto.cnds.OnRoomError, self);
     });

     this.room.onJoin.add(function () {
       self.sessionId = self.room.sessionId;
       self.runtime.trigger(pluginProto.cnds.OnJoinRoom, self);
     });

     this.room.onStateChange.addOnce(function() {
       function registerCallbacksOnStructure(instance, path) {
         instance.onChange = onChange.bind(undefined, [...path]);
         instance.triggerAll();

         var schema = instance._schema;
         for (var field in schema) {
           if (schema[field].map || Array.isArray(schema[field])) {
             instance[field].onAdd = onAdd.bind(undefined, [...path, field]);
             instance[field].onChange = onItemChange.bind(undefined, [...path, field]);
             instance[field].onRemove = onRemove.bind(undefined, [...path, field]);
             instance[field].triggerAll();
           }
         }
       }

       function onAdd(path, instance, index) {
         registerCallbacksOnStructure(instance, [...path, index]);

         self.lastPath = path.join(".");
         self.lastIndex = index;
         self.lastValue = instance;
         self.runtime.trigger(pluginProto.cnds.OnSchemaAdd, self);
       }

       function onItemChange(path, instance, index) {
         self.lastPath = path.join(".");
         self.lastIndex = index;
         self.lastValue = instance;
         self.runtime.trigger(pluginProto.cnds.OnSchemaChange, self);
       }

       function onChange(path, changes) {
         self.lastIndex = undefined;
         self.lastPath = path.join(".");
         for (var i = 0; i < changes.length; i++) {
           self.lastField = changes[i].field;
           self.lastValue = changes[i].value;
           self.lastPreviousValue = changes[i].previousValue;
           self.runtime.trigger(pluginProto.cnds.OnSchemaFieldChange, self);
         }
       }

       function onRemove(path, instance, index) {
         self.lastPath = path.join(".");
         self.lastIndex = index;
         self.lastValue = instance;
         self.runtime.trigger(pluginProto.cnds.OnSchemaRemove, self);
       }

       registerCallbacksOnStructure(self.room.state, []);
     });

     this.room.onStateChange.add(function (state) {
       self.runtime.trigger(pluginProto.cnds.OnStateChange, self);
     });

     this.room.onMessage.add(function (message) {
       self.lastValue = message;
       self.lastType = message.type;
       self.runtime.trigger(pluginProto.cnds.OnMessage, self);
     });

     //  this.room.listen(function(change) {
     //    self.lastChange = change;
     //    self.lastValue = change.value;
     //    self.runtime.trigger(pluginProto.cnds.OnRoomListen, self);
     //  });
   };

   Acts.prototype.RoomSend = function (type, data)
   {
     if (
       this.room &&
       this.room.connection &&
       this.room.connection.readyState === WebSocket.OPEN
     ) {
       this.room.send([type, JSON.parse(data)]);

     } else {
       console.log("RoomSend: not connected.");
     }
   }

   Acts.prototype.RoomLeave = function ()
   {
     if (this.room) {
       this.room.leave()
     }
   }

   pluginProto.acts = new Acts();

   //////////////////////////////////////
   // Expressions
   function Exps() {};

   Exps.prototype.SessionId = function (ret)
   {
     ret.set_string((this.room && this.room.sessionId) || "");
   };

   Exps.prototype.State = function (ret, variablePath)
   {
     ret.set_any(getDeepVariable(variablePath, (this.room && this.room.state) || {}));
   };

   Exps.prototype.JSON = function (ret, data) {
     console.log("JSON =>", JSON.stringify(eval(`(${data})`)));
     ret.set_string(JSON.stringify(eval(`(${data})`)));
   };

   Exps.prototype.CurrentIndex = function (ret) {
     ret.set_any(this.lastIndex);
   }

   Exps.prototype.CurrentField = function (ret) {
     ret.set_string(this.lastField || "");
   }

   Exps.prototype.CurrentValue = function (ret) {
     ret.set_any(this.lastValue);
   }

   Exps.prototype.CurrentValueAt = function (ret, path) {
     ret.set_any(getDeepVariable(path, this.lastValue));
   }

   Exps.prototype.Value = function (ret) {
     ret.set_any(this.lastValue);
   };

   Exps.prototype.ValueAt = function (ret, path) {
     ret.set_any(getDeepVariable(path, this.lastValue));
   };

   pluginProto.exps = new Exps();

   //////////////////////////////////////
   // Utilities
   function getDeepVariable (path, container) {
     var path = path.split(".");
     var value = container;

     // deeply get the requested variable from the room's state.
     try {
       do {
         value = value[path.shift()];
       } while (path.length > 0);
     } catch (e) {
       console.warn(e);
       return null;
     }

     return value;
   }

   var ANY = ":any:";
   function checkPath (lastPath, path) {
     if (lastPath === path) {
       return true;

     } else if (path.indexOf(ANY) >= 0) {
       var lastSegments = lastPath.split(".");
       var segments = path.split(".");

       if (lastSegments.length === segments.length) {
         for (var i = 0; i < segments.length; i++) {
           if (segments[i] !== ANY && segments[i] !== lastSegments[i]) {
             return false;
           }
         }
         return true;

       } else {
         return false;
       }

     } else {
       return false;
     }
   }

 }());
