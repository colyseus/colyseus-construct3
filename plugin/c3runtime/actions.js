"use strict";

{
  var Colyseus = window['Colyseus'];

  C3.Plugins.Colyseus.Acts =
  {
    Connect(endpoint)
    {
      var self = this;

      this.client = new Colyseus.Client(endpoint || this.endpoint);
      this.client.onError.add(function() { self.Trigger(C3.Plugins.Colyseus.Cnds.OnClientError); });
      this.client.onOpen.add(function() { self.Trigger(C3.Plugins.Colyseus.Cnds.OnOpen); });
      this.client.onClose.add(function() { self.Trigger(C3.Plugins.Colyseus.Cnds.OnClose); });
    },

    Disconnect()
    {
      if (this.client) {
        this.client.close();
      }
    },

    JoinRoom (roomName, options)
    {
      var self = this;
      var options = JSON.parse(options || "{}");

      this.room = this.client.join(roomName, options);

      this.room.onError.add(function () {
        self.Trigger(C3.Plugins.Colyseus.Cnds.OnRoomError);
      });

      this.room.onJoin.add(function () {
        self.sessionId = self.room.sessionId;

        function registerCallbacksOnStructure (instance, path) {
          instance.onChange = onChange.bind(undefined, [...path]);

          var schema = instance._schema;
          for (var field in schema) {
            if (schema[field].map || Array.isArray(schema[field])) {
              instance[field].onAdd = onAdd.bind(undefined, [...path, field]);
              instance[field].onChange = onItemChange.bind(undefined, [...path, field]);
              instance[field].onRemove = onRemove.bind(undefined, [...path, field]);
            }
          }
        }

        function onAdd (path, instance, index) {
          registerCallbacksOnStructure(instance, [...path, index]);

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
          for (var i=0; i<changes.length; i++) {
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

        self.Trigger(C3.Plugins.Colyseus.Cnds.OnJoinRoom);
      });

      this.room.onStateChange.add(function (state) {
        self.Trigger(C3.Plugins.Colyseus.Cnds.OnStateChange);
      });

      this.room.onMessage.add(function (message) {
        self.lastValue = message;
        self.lastType = message.type;
        self.Trigger(C3.Plugins.Colyseus.Cnds.OnMessage);
      });

      // this.listeners = {};

      // // disable fossil-delta for now
      // this.room.listen(function(change) {
      //   self.lastChange = change;
      //   self.lastValue = change.value;
      //   self.Trigger(C3.Plugins.Colyseus.Cnds.OnRoomListen);
      // });
    },

    RoomSend (type, data)
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
    },

    RoomLeave()
    {
      if (this.room) {
        this.room.leave()
      }
    },

  };

}
